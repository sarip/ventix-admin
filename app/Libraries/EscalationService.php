<?php

/**
 * Escalation Service
 * Handles ticket escalation logic, level management, and notifications
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2025-12-10
 */

namespace App\Libraries;

use App\Models\EscalationPolicie;
use App\Models\EscalationLevel;
use App\Models\TicketEscalationState;
use App\Models\Ticket;
use DateTime;

class EscalationService
{
    protected $policyModel;
    protected $levelModel;
    protected $stateModel;
    protected $ticketModel;

    public function __construct()
    {
        $this->policyModel = new EscalationPolicie();
        $this->levelModel = new EscalationLevel();
        $this->stateModel = new TicketEscalationState();
        $this->ticketModel = new Ticket();
    }

    /**
     * Initialize escalation state for a new ticket
     * 
     * @param int $ticketId Ticket ID
     * @param int|null $policyId Escalation policy ID (default: get active default policy)
     * @return bool Success status
     */
    public function initializeEscalationState($ticketId, $policyId = null)
    {
        // If no policy specified, get the default active policy
        if (!$policyId) {
            $defaultPolicy = $this->policyModel
                ->where('is_active', 1)
                ->orderBy('id', 'ASC')
                ->first();

            if (!$defaultPolicy) {
                log_message('warning', "No active escalation policy found for ticket #{$ticketId}");
                return false;
            }

            $policyId = $defaultPolicy->id;
        }

        // Get the first level of this policy
        $firstLevel = $this->levelModel
            ->where('id', $policyId)
            ->where('active', 1)
            ->orderBy('level_order', 'ASC')
            ->first();

        if (!$firstLevel) {
            log_message('warning', "No active escalation levels found for policy #{$policyId}");
            return false;
        }

        // Calculate next escalation time based on first level
        $nextEscalationAt = new DateTime();
        $nextEscalationAt->modify("+{$firstLevel->escalate_after_minutes} minutes");

        $stateData = [
            'ticket_id' => $ticketId,
            'policy_id' => $policyId,
            'current_level' => 0, // Start at level 0 (no escalation yet)
            'last_escalated_at' => null,
            'next_escalation_at' => $nextEscalationAt->format('Y-m-d H:i:s'),
            'escalated_by' => null
        ];

        $result = $this->stateModel->insert($stateData);

        if ($result) {
            log_message('info', "Escalation state initialized for ticket #{$ticketId} with policy #{$policyId}");
        }

        return $result !== false;
    }

    /**
     * Check if ticket needs escalation
     * 
     * @param int $ticketId Ticket ID
     * @return array|false Escalation details if needed, false otherwise
     */
    public function checkEscalationNeeded($ticketId)
    {
        $state = $this->stateModel->find($ticketId);

        if (!$state) {
            return false;
        }

        $ticket = $this->ticketModel->find($ticketId);

        // Don't escalate if ticket is already resolved or closed
        if (in_array($ticket->status, ['resolved', 'closed', 'cancelled'])) {
            return false;
        }

        $now = new DateTime();
        $nextEscalation = new DateTime($state->next_escalation_at);

        // Check if it's time to escalate
        if ($now >= $nextEscalation) {
            return [
                'ticket_id' => $ticketId,
                'current_level' => $state->current_level,
                'policy_id' => $state->policy_id,
                'should_escalate' => true
            ];
        }

        return false;
    }

    /**
     * Get next escalation level configuration
     * 
     * @param int $policyId Escalation policy ID
     * @param int $currentLevel Current escalation level
     * @return object|null Next level configuration or null if no more levels
     */
    public function getNextLevel($policyId, $currentLevel)
    {
        $nextOrder = $currentLevel + 1;

        $nextLevel = $this->levelModel
            ->where('policy_id', $policyId)
            ->where('level_order', $nextOrder)
            ->where('active', 1)
            ->first();

        return $nextLevel;
    }

    /**
     * Escalate ticket to next level
     * 
     * @param int $ticketId Ticket ID
     * @param int|null $escalatedBy User ID who triggered escalation
     * @return bool|array Success status or error details
     */
    public function escalateTicket($ticketId, $escalatedBy = null)
    {
        $state = $this->stateModel->find($ticketId);

        if (!$state) {
            return ['error' => 'Escalation state not found for ticket'];
        }

        // Get next level
        $nextLevel = $this->getNextLevel($state->policy_id, $state->current_level);

        if (!$nextLevel) {
            log_message('warning', "No more escalation levels available for ticket #{$ticketId}");
            return ['error' => 'Maximum escalation level reached'];
        }

        $now = new DateTime();
        $nextEscalationTime = clone $now;

        // Get the level after this one to set next_escalation_at
        $levelAfterNext = $this->getNextLevel($state->policy_id, $nextLevel->level_order);

        if ($levelAfterNext) {
            $nextEscalationTime->modify("+{$levelAfterNext->escalate_after_minutes} minutes");
            $nextEscalationAt = $nextEscalationTime->format('Y-m-d H:i:s');
        } else {
            $nextEscalationAt = null; // No more levels
        }

        // Update escalation state
        $updateData = [
            'current_level' => $nextLevel->level_order,
            'last_escalated_at' => $now->format('Y-m-d H:i:s'),
            'next_escalation_at' => $nextEscalationAt,
            'escalated_by' => $escalatedBy
        ];

        $this->stateModel->update($ticketId, $updateData);

        // Send notifications
        $this->sendNotifications($ticketId, $nextLevel);

        // Update ticket status if action requires it
        $this->executeAction($ticketId, $nextLevel);

        log_message('info', "Ticket #{$ticketId} escalated to level {$nextLevel->level_order}");

        return [
            'success' => true,
            'ticket_id' => $ticketId,
            'escalated_to_level' => $nextLevel->level_order,
            'next_escalation_at' => $nextEscalationAt
        ];
    }

    /**
     * Send escalation notifications
     * 
     * @param int $ticketId Ticket ID
     * @param object $levelConfig Escalation level configuration
     * @return void
     */
    public function sendNotifications($ticketId, $levelConfig)
    {
        $ticket = $this->ticketModel->find($ticketId);

        // Parse notify_roles and notify_users from JSON
        $notifyRoles = json_decode($levelConfig->notify_roles ?? '[]', true);
        $notifyUsers = json_decode($levelConfig->notify_users ?? '[]', true);

        $message = "Ticket #{$ticket->ticket_code} - \"{$ticket->title}\" has been escalated to Level {$levelConfig->level_order}";

        // Log notification (in production, integrate with email/SMS/websocket)
        log_message('info', "Escalation notification: {$message}");
        log_message('info', "Notify roles: " . implode(', ', $notifyRoles));
        log_message('info', "Notify users: " . implode(', ', $notifyUsers));

        // Publish real-time notification via Redis
        $redis = new \App\Libraries\RedisNotification('tickets');
        $state = $this->stateModel->find($ticketId);

        $redis->publishEscalation(
            $ticket,
            $levelConfig->level_order,
            $notifyUsers,
            $notifyRoles,
            $state->next_escalation_at ?? null
        );
        // TODO: Integrate with WebSocket for real-time notifications
        // TODO: Send email notifications
        // TODO: Create internal notifications in database
    }

    /**
     * Execute escalation action
     * 
     * @param int $ticketId Ticket ID
     * @param object $levelConfig Escalation level configuration
     * @return void
     */
    protected function executeAction($ticketId, $levelConfig)
    {
        $action = json_decode($levelConfig->action ?? '{}', true);

        if (empty($action)) {
            return;
        }

        // Example actions: auto-assign, change priority, etc.
        if (isset($action['auto_assign']) && $action['auto_assign']) {
            // TODO: Implement auto-assignment logic
            log_message('info', "Auto-assign action triggered for ticket #{$ticketId}");
        }

        if (isset($action['increase_priority']) && $action['increase_priority']) {
            // TODO: Increase ticket priority
            log_message('info', "Priority increase triggered for ticket #{$ticketId}");
        }
    }

    /**
     * Reset escalation state (when ticket is resolved)
     * 
     * @param int $ticketId Ticket ID
     * @return bool Success status
     */
    public function resetEscalation($ticketId)
    {
        $state = $this->stateModel->find($ticketId);

        if (!$state) {
            return false;
        }

        $updateData = [
            'current_level' => 0,
            'last_escalated_at' => null,
            'next_escalation_at' => null
        ];

        $result = $this->stateModel->update($ticketId, $updateData);

        if ($result) {
            log_message('info', "Escalation reset for ticket #{$ticketId}");

            // Notify that escalation is resolved
            $ticket = $this->ticketModel->find($ticketId);
            if ($ticket) {
                $redis = new \App\Libraries\RedisNotification('tickets');
                $redis->publishEscalationResolved($ticket);
            }
        }

        return $result;
    }

    /**
     * Get escalation state for a ticket
     * 
     * @param int $ticketId Ticket ID
     * @return object|null Escalation state or null
     */
    public function getEscalationState($ticketId)
    {
        return $this->stateModel->find($ticketId);
    }
}
