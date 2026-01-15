<?php

/**
 * SLA Service
 * Handles SLA policy assignment, deadline calculation, and compliance tracking
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2025-12-10
 */

namespace App\Libraries;

use App\Models\SlaPolicie;
use App\Models\SlaTracking;
use App\Models\Ticket;
use App\Models\Asset;
use DateTime;

class SlaService
{
    protected $slaPolicieModel;
    protected $slaTrackingModel;
    protected $ticketModel;
    protected $assetModel;

    public function __construct()
    {
        $this->slaPolicieModel = new SlaPolicie();
        $this->slaTrackingModel = new SlaTracking();
        $this->ticketModel = new Ticket();
        $this->assetModel = new Asset();
    }

    /**
     * Get SLA policy based on category and priority
     * 
     * @param string $category Asset category (e.g., 'AC', 'Electrical', 'Plumbing')
     * @param string $priority Ticket priority ('low', 'medium', 'high', 'critical')
     * @return object|null SLA policy object or null if not found
     */
    public function getSlaPolicy($category, $priority)
    {
        $policy = $this->slaPolicieModel
            ->where('category', $category)
            ->where('priority', $priority)
            ->first();

        return $policy;
    }

    /**
     * Calculate SLA deadline based on policy and ticket creation time
     * 
     * @param object $policy SLA policy object
     * @param string|DateTime $createdAt Ticket creation timestamp
     * @param string $deadlineType 'response' or 'resolution'
     * @return string Calculated deadline in Y-m-d H:i:s format
     */
    public function calculateDeadline($policy, $createdAt, $deadlineType = 'resolution')
    {
        $created = $createdAt instanceof DateTime ? $createdAt : new DateTime($createdAt);

        $hours = $deadlineType === 'response'
            ? $policy->response_time_hours
            : $policy->resolution_time_hours;

        $created->modify("+{$hours} hours");

        return $created->format('Y-m-d H:i:s');
    }

    /**
     * Auto-assign SLA policy to ticket and create tracking record
     * 
     * @param int $ticketId Ticket ID
     * @param string $category Asset category
     * @param string $priority Ticket priority
     * @return bool True if SLA assigned successfully, false otherwise
     */
    public function assignSlaToTicket($ticketId, $category, $priority)
    {
        // Get the appropriate SLA policy
        $policy = $this->getSlaPolicy($category, $priority);

        if (!$policy) {
            log_message('warning', "No SLA policy found for category: {$category}, priority: {$priority}");
            return false;
        }

        // Get ticket details
        $ticket = $this->ticketModel->find($ticketId);
        if (!$ticket) {
            log_message('error', "Ticket not found: {$ticketId}");
            return false;
        }

        // Calculate SLA deadline (using resolution time)
        $deadline = $this->calculateDeadline($policy, $ticket->created_at, 'resolution');

        // Update ticket with SLA deadline
        $this->ticketModel->update($ticketId, ['sla_deadline' => $deadline]);

        // Create SLA tracking record
        $trackingData = [
            'ticket_id' => $ticketId,
            'sla_id' => $policy->id,
            'is_met' => null, // Will be determined later
            'checked_at' => date('Y-m-d H:i:s')
        ];

        $result = $this->slaTrackingModel->insert($trackingData);

        if ($result) {
            log_message('info', "SLA assigned to ticket #{$ticketId}: Policy ID {$policy->id}, Deadline: {$deadline}");
        }

        return $result !== false;
    }

    /**
     * Check SLA compliance for a ticket
     * 
     * @param int $ticketId Ticket ID
     * @return array Compliance status with details
     */
    public function checkCompliance($ticketId)
    {
        $ticket = $this->ticketModel->find($ticketId);
        if (!$ticket) {
            return ['error' => 'Ticket not found'];
        }

        $tracking = $this->slaTrackingModel->where('ticket_id', $ticketId)->first();
        if (!$tracking) {
            return ['error' => 'No SLA tracking record found'];
        }

        $policy = $this->slaPolicieModel->find($tracking->sla_id);

        $now = new DateTime();
        $deadline = new DateTime($ticket->sla_deadline);
        $created = new DateTime($ticket->created_at);

        // Calculate response deadline
        $responseDeadline = new DateTime($ticket->created_at);
        $responseDeadline->modify("+{$policy->response_time_hours} hours");

        $status = in_array($ticket->status, ['resolved', 'closed']);
        $resolvedTime = $ticket->closed_at ? new DateTime($ticket->closed_at) : $now;

        // Check if SLA was met
        $isMet = $status && $resolvedTime <= $deadline;

        // Check response time
        $responseTimeMet = null;
        if ($ticket->status !== 'new') {
            $responseTimeMet = $ticket->updated_at && (new DateTime($ticket->updated_at)) <= $responseDeadline;
        }

        return [
            'ticket_id' => $ticketId,
            'sla_deadline' => $ticket->sla_deadline,
            'is_met' => $isMet,
            'response_time_met' => $responseTimeMet,
            'status' => $ticket->status,
            'time_remaining' => $now < $deadline ? $deadline->diff($now)->format('%H hours %I minutes') : 'Breached',
            'breach_duration' => $now > $deadline ? $now->diff($deadline)->format('%H hours %I minutes') : null
        ];
    }

    /**
     * Update SLA tracking status
     * 
     * @param int $ticketId Ticket ID
     * @param bool|null $isMet Whether SLA was met (null = pending)
     * @return bool Update success status
     */
    public function updateTrackingStatus($ticketId, $isMet)
    {
        $tracking = $this->slaTrackingModel->where('ticket_id', $ticketId)->first();

        if (!$tracking) {
            log_message('warning', "No SLA tracking found for ticket #{$ticketId}");
            return false;
        }

        $updateData = [
            'is_met' => $isMet,
            'checked_at' => date('Y-m-d H:i:s')
        ];

        $result = $this->slaTrackingModel->update($tracking->id, $updateData);

        if ($result) {
            $status = $isMet === null ? 'pending' : ($isMet ? 'met' : 'breached');
            log_message('info', "SLA tracking updated for ticket #{$ticketId}: {$status}");

            // Send real-time notification if SLA breached
            if ($isMet === 0) {
                $ticket = $this->ticketModel->find($ticketId);
                if ($ticket) {
                    $redis = new \App\Libraries\RedisNotification('tickets');
                    $redis->publishSlaBreach($ticket);
                }
            }
        }

        return $result;
    }


    /**
     * Get asset category from asset ID
     * 
     * @param int $assetId Asset ID
     * @return string Category name or 'General' as default
     */
    public function getAssetCategory($assetId)
    {
        $asset = $this->assetModel->find($assetId);
        return $asset ? $asset->category : 'General';
    }
}
