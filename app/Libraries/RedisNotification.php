<?php

/**
 * Redis Notification Publisher
 * Helper library for publishing real-time notifications to websocket via Redis
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2025-12-10
 */

namespace App\Libraries;

class RedisNotification
{
    protected $redis;
    protected $channel;

    public function __construct($channel = 'tickets')
    {
        $this->channel = $channel;

        // Initialize Redis connection
        try {
            $this->redis = new \Redis();
            $redisHost = getenv('REDIS_HOST') ?: '127.0.0.1';
            $redisPort = getenv('REDIS_PORT') ?: 6379;

            $this->redis->connect($redisHost, $redisPort);
        } catch (\Exception $e) {
            log_message('error', "Redis connection failed: {$e->getMessage()}");
            $this->redis = null;
        }
    }

    /**
     * Publish event to Redis channel
     * 
     * @param string $event Event name
     * @param array $data Event data
     * @return bool Success status
     */
    public function publish($event, $data)
    {
        if (!$this->redis) {
            log_message('warning', 'Redis not available, notification not sent');
            return false;
        }

        try {
            $payload = json_encode(array_merge(['event' => $event], $data));
            $result = $this->redis->publish($this->channel, $payload);

            log_message('info', "Published to {$this->channel}: {$event}", ['subscribers' => $result]);
            return true;
        } catch (\Exception $e) {
            log_message('error', "Redis publish error: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Publish SLA breach notification
     * 
     * @param object $ticket Ticket object
     * @param string $breachType Type of breach (response|resolution)
     * @param string $deadline SLA deadline timestamp
     * @return bool Success status
     */
    public function publishSlaBreach($ticket, $breachType = 'resolution', $deadline = null)
    {
        return $this->publish('sla:breach', [
            'ticket' => $this->formatTicket($ticket),
            'sla' => [
                'breachType' => $breachType,
                'deadline' => $deadline ?? $ticket->sla_deadline,
                'breachedAt' => date('Y-m-d H:i:s')
            ]
        ]);
    }

    /**
     * Publish SLA warning notification (deadline approaching)
     * 
     * @param object $ticket Ticket object
     * @param string $timeRemaining Human-readable time remaining
     * @return bool Success status
     */
    public function publishSlaWarning($ticket, $timeRemaining)
    {
        return $this->publish('sla:warning', [
            'ticket' => $this->formatTicket($ticket),
            'sla' => [
                'deadline' => $ticket->sla_deadline,
                'timeRemaining' => $timeRemaining
            ]
        ]);
    }

    /**
     * Publish escalation triggered notification
     * 
     * @param object $ticket Ticket object
     * @param int $level Escalation level
     * @param array $notifyUsers Array of user IDs to notify
     * @param array $notifyRoles Array of role names to notify
     * @param string $nextEscalationAt Next escalation timestamp
     * @return bool Success status
     */
    public function publishEscalation($ticket, $level, $notifyUsers = [], $notifyRoles = [], $nextEscalationAt = null)
    {
        return $this->publish('escalation:triggered', [
            'ticket' => $this->formatTicket($ticket),
            'escalation' => [
                'level' => $level,
                'notifyUsers' => $notifyUsers,
                'notifyRoles' => $notifyRoles,
                'nextEscalationAt' => $nextEscalationAt
            ]
        ]);
    }

    /**
     * Publish escalation resolved notification
     * 
     * @param object $ticket Ticket object
     * @return bool Success status
     */
    public function publishEscalationResolved($ticket)
    {
        return $this->publish('escalation:resolved', [
            'ticket' => $this->formatTicket($ticket)
        ]);
    }

    /**
     * Publish standard ticket event
     * 
     * @param string $action Action (created|updated|deleted)
     * @param object $ticket Ticket object
     * @param int|null $userId User ID to notify
     * @return bool Success status
     */
    public function publishTicketEvent($action, $ticket, $userId = null)
    {
        return $this->publish("ticket:{$action}", [
            'ticket' => $this->formatTicket($ticket),
            'userId' => $userId
        ]);
    }

    /**
     * Format ticket object for transmission
     * 
     * @param object $ticket Ticket object
     * @return array Formatted ticket data
     */
    protected function formatTicket($ticket)
    {
        return [
            'id' => $ticket->id ?? null,
            'ticket_code' => $ticket->ticket_code ?? null,
            'title' => $ticket->title ?? null,
            'description' => $ticket->description ?? null,
            'priority' => $ticket->priority ?? null,
            'status' => $ticket->status ?? null,
            'sla_deadline' => $ticket->sla_deadline ?? null,
            'assigned_to' => $ticket->assigned_to ?? null,
            'created_at' => $ticket->created_at ?? null,
        ];
    }

    /**
     * Publish work order assignment notification
     * 
     * @param object $workOrder Work order object
     * @param int $assignedTo User ID assigned to
     * @param int|null $previousAssignedTo Previous assignee (for reassignment)
     * @return bool Success status
     */
    public function publishWorkOrderAssignment($workOrder, $assignedTo, $previousAssignedTo = null)
    {
        return $this->publish('wo:assigned', [
            'workOrder' => $this->formatWorkOrder($workOrder),
            'assignedTo' => $assignedTo,
            'previousAssignedTo' => $previousAssignedTo
        ]);
    }

    /**
     * Publish work order status change notification
     * 
     * @param object $workOrder Work order object
     * @param string $status New status
     * @param string|null $previousStatus Previous status
     * @return bool Success status
     */
    public function publishWorkOrderStatusChange($workOrder, $status, $previousStatus = null)
    {
        return $this->publish('wo:status_changed', [
            'workOrder' => $this->formatWorkOrder($workOrder),
            'status' => $status,
            'previousStatus' => $previousStatus
        ]);
    }

    /**
     * Publish work order completed notification
     * 
     * @param object $workOrder Work order object
     * @return bool Success status
     */
    public function publishWorkOrderCompleted($workOrder)
    {
        return $this->publish('wo:completed', [
            'workOrder' => $this->formatWorkOrder($workOrder)
        ]);
    }

    /**
     * Publish work order created notification
     * 
     * @param object $workOrder Work order object
     * @param int $userId Creator user ID
     * @return bool Success status
     */
    public function publishWorkOrderCreated($workOrder, $userId)
    {
        return $this->publish('wo:created', [
            'workOrder' => $this->formatWorkOrder($workOrder),
            'userId' => $userId
        ]);
    }

    /**
     * Format work order object for transmission
     * 
     * @param object $workOrder Work order object
     * @return array Formatted work order data
     */
    protected function formatWorkOrder($workOrder)
    {
        return [
            'id' => $workOrder->id ?? null,
            'wo_code' => $workOrder->wo_code ?? null,
            'title' => $workOrder->title ?? null,
            'description' => $workOrder->description ?? null,
            'priority' => $workOrder->priority ?? null,
            'status' => $workOrder->status ?? null,
            'assigned_to' => $workOrder->assigned_to ?? null,
            'created_by' => $workOrder->created_by ?? null,
            'scheduled_date' => $workOrder->scheduled_date ?? null,
            'created_at' => $workOrder->created_at ?? null,
        ];
    }

    /**
     * Publish preventive maintenance due notification
     * 
     * @param object $schedule Schedule maintenance object
     * @param string $urgency Urgency level (due_soon|overdue)
     * @param string $timeInfo Time information (e.g. "besok", "2 hari yang lalu")
     * @return bool Success status
     */
    public function publishPreventiveMaintenanceDue($schedule, $urgency = 'due_soon', $timeInfo = '')
    {
        return $this->publish('pm:due', [
            'schedule' => $this->formatSchedule($schedule),
            'urgency' => $urgency,
            'timeInfo' => $timeInfo
        ]);
    }

    /**
     * Publish schedule run approval needed notification
     * 
     * @param object $scheduleRun Schedule run object
     * @return bool Success status
     */
    public function publishScheduleRunApproval($scheduleRun)
    {
        return $this->publish('pm:approval_needed', [
            'scheduleRun' => $this->formatScheduleRun($scheduleRun)
        ]);
    }

    /**
     * Publish work order overdue notification
     * 
     * @param object $workOrder Work order object
     * @param string $overdueDuration Human-readable overdue duration
     * @return bool Success status
     */
    public function publishWorkOrderOverdue($workOrder, $overdueDuration)
    {
        return $this->publish('wo:overdue', [
            'workOrder' => $this->formatWorkOrder($workOrder),
            'overdueDuration' => $overdueDuration
        ]);
    }

    /**
     * Publish ticket created notification
     * 
     * @param object $ticket Ticket object
     * @return bool Success status
     */
    public function publishTicketCreated($ticket)
    {
        return $this->publish('ticket:created', [
            'ticket' => $this->formatTicket($ticket)
        ]);
    }

    /**
     * Publish incident alert notification
     * 
     * @param object $incident Incident object
     * @return bool Success status
     */
    public function publishIncidentAlert($incident)
    {
        return $this->publish('incident:alert', [
            'incident' => $this->formatIncident($incident)
        ]);
    }

    /**
     * Publish inventory low stock notification
     * 
     * @param object $inventoryItem Inventory item object
     * @return bool Success status
     */
    public function publishInventoryLowStock($inventoryItem)
    {
        return $this->publish('inventory:low_stock', [
            'inventoryItem' => $this->formatInventoryItem($inventoryItem)
        ]);
    }

    /**
     * Publish vendor contract expiry notification
     * 
     * @param object $vendorContract Vendor contract object
     * @param int $daysRemaining Days until expiry
     * @return bool Success status
     */
    public function publishVendorContractExpiry($vendorContract, $daysRemaining)
    {
        return $this->publish('vendor:contract_expiry', [
            'vendorContract' => $this->formatVendorContract($vendorContract),
            'daysRemaining' => $daysRemaining
        ]);
    }

    /**
     * Publish invoice overdue notification
     * 
     * @param object $invoice Invoice object
     * @return bool Success status
     */
    public function publishInvoiceOverdue($invoice)
    {
        return $this->publish('invoice:overdue', [
            'invoice' => $this->formatInvoice($invoice)
        ]);
    }

    /**
     * Format schedule maintenance object for transmission
     * 
     * @param object $schedule Schedule maintenance object
     * @return array Formatted schedule data
     */
    protected function formatSchedule($schedule)
    {
        return [
            'id' => $schedule->id ?? null,
            'schedule_name' => $schedule->schedule_name ?? null,
            'schedule_description' => $schedule->schedule_description ?? null,
            'asset_id' => $schedule->asset_id ?? null,
            'next_run' => $schedule->next_run ?? null,
            'last_run' => $schedule->last_run ?? null,
            'status' => $schedule->status ?? null,
            'repeat_interval_days' => $schedule->repeat_interval_days ?? null,
        ];
    }

    /**
     * Format schedule run object for transmission
     * 
     * @param object $scheduleRun Schedule run object
     * @return array Formatted schedule run data
     */
    protected function formatScheduleRun($scheduleRun)
    {
        return [
            'id' => $scheduleRun->id ?? null,
            'schedule_id' => $scheduleRun->schedule_id ?? null,
            'status' => $scheduleRun->status ?? null,
            'scheduled_date' => $scheduleRun->scheduled_date ?? null,
            'completed_at' => $scheduleRun->completed_at ?? null,
        ];
    }

    /**
     * Format incident object for transmission
     * 
     * @param object $incident Incident object
     * @return array Formatted incident data
     */
    protected function formatIncident($incident)
    {
        return [
            'id' => $incident->id ?? null,
            'incident_code' => $incident->incident_code ?? null,
            'title' => $incident->title ?? null,
            'description' => $incident->description ?? null,
            'severity' => $incident->severity ?? null,
            'status' => $incident->status ?? null,
            'created_at' => $incident->created_at ?? null,
        ];
    }

    /**
     * Format inventory item object for transmission
     * 
     * @param object $inventoryItem Inventory item object
     * @return array Formatted inventory item data
     */
    protected function formatInventoryItem($inventoryItem)
    {
        return [
            'id' => $inventoryItem->id ?? null,
            'sku' => $inventoryItem->sku ?? null,
            'name' => $inventoryItem->name ?? null,
            'category' => $inventoryItem->category ?? null,
            'stock' => $inventoryItem->stock ?? null,
            'reorder_point' => $inventoryItem->reorder_point ?? null,
            'unit' => $inventoryItem->unit ?? null,
            'location' => $inventoryItem->location ?? null,
        ];
    }

    /**
     * Format vendor contract object for transmission
     * 
     * @param object $vendorContract Vendor contract object
     * @return array Formatted vendor contract data
     */
    protected function formatVendorContract($vendorContract)
    {
        return [
            'id' => $vendorContract->id ?? null,
            'contract_id' => $vendorContract->contract_id ?? null,
            'vendor_id' => $vendorContract->vendor_id ?? null,
            'title' => $vendorContract->title ?? null,
            'start_date' => $vendorContract->start_date ?? null,
            'end_date' => $vendorContract->end_date ?? null,
            'amount' => $vendorContract->amount ?? null,
        ];
    }

    /**
     * Format invoice object for transmission
     * 
     * @param object $invoice Invoice object
     * @return array Formatted invoice data
     */
    protected function formatInvoice($invoice)
    {
        return [
            'id' => $invoice->id ?? null,
            'invoice_number' => $invoice->invoice_number ?? null,
            'tenant_id' => $invoice->tenant_id ?? null,
            'amount' => $invoice->amount ?? null,
            'due_date' => $invoice->due_date ?? null,
            'status' => $invoice->status ?? null,
            'created_at' => $invoice->created_at ?? null,
        ];
    }

    // ===== FIELD SERVICE MANAGEMENT NOTIFICATIONS =====

    /**
     * Publish duty assignment notification
     * 
     * @param object $dutyAssignment Duty assignment object
     * @param object $user User object
     * @return bool Success status
     */
    public function publishDutyAssigned($dutyAssignment, $user)
    {
        return $this->publish('duty:assigned', [
            'dutyAssignment' => $this->formatDutyAssignment($dutyAssignment),
            'user' => [
                'id' => $user->id,
                'fullname' => $user->fullname
            ]
        ]);
    }

    /**
     * Publish shift reminder notification
     * 
     * @param object $userShift User shift object
     * @param object $user User object
     * @param string $startTime Shift start time
     * @return bool Success status
     */
    public function publishShiftReminder($userShift, $user, $startTime)
    {
        return $this->publish('shift:reminder', [
            'userShift' => $this->formatUserShift($userShift),
            'user' => [
                'id' => $user->id,
                'fullname' => $user->fullname
            ],
            'startTime' => $startTime
        ]);
    }

    /**
     * Publish clock-in success notification
     * 
     * @param object $attendance Attendance object
     * @param object $user User object
     * @param string $status Attendance status (present/late)
     * @return bool Success status
     */
    public function publishClockIn($attendance, $user, $status)
    {
        return $this->publish('attendance:clock_in', [
            'attendance' => $this->formatAttendance($attendance),
            'user' => [
                'id' => $user->id,
                'fullname' => $user->fullname
            ],
            'status' => $status
        ]);
    }

    /**
     * Publish clock-out success notification
     * 
     * @param object $attendance Attendance object
     * @param object $user User object
     * @return bool Success status
     */
    public function publishClockOut($attendance, $user)
    {
        return $this->publish('attendance:clock_out', [
            'attendance' => $this->formatAttendance($attendance),
            'user' => [
                'id' => $user->id,
                'fullname' => $user->fullname
            ]
        ]);
    }

    /**
     * Publish staff replacement notification
     * 
     * @param object $absentUser Absent user object
     * @param object $replacementUser Replacement user object
     * @param object $dutyAssignment Duty assignment object
     * @return bool Success status
     */
    public function publishStaffReplacement($absentUser, $replacementUser, $dutyAssignment)
    {
        return $this->publish('duty:replacement', [
            'absentUser' => [
                'id' => $absentUser->id,
                'fullname' => $absentUser->fullname
            ],
            'replacementUser' => [
                'id' => $replacementUser->id,
                'fullname' => $replacementUser->fullname
            ],
            'dutyAssignment' => $this->formatDutyAssignment($dutyAssignment)
        ]);
    }

    /**
     * Publish technician absent notification (for supervisors)
     * 
     * @param object $absentUser Absent user object
     * @param object $dutyAssignment Duty assignment object
     * @param bool $replacementFound Whether replacement was found
     * @return bool Success status
     */
    public function publishTechnicianAbsent($absentUser, $dutyAssignment, $replacementFound = false)
    {
        return $this->publish('staff:absent', [
            'absentUser' => [
                'id' => $absentUser->id,
                'fullname' => $absentUser->fullname
            ],
            'dutyAssignment' => $this->formatDutyAssignment($dutyAssignment),
            'replacementFound' => $replacementFound
        ]);
    }

    /**
     * Format duty assignment object for transmission
     * 
     * @param object $dutyAssignment Duty assignment object
     * @return array Formatted duty assignment data
     */
    protected function formatDutyAssignment($dutyAssignment)
    {
        return [
            'id' => $dutyAssignment->id ?? null,
            'duty_type' => $dutyAssignment->duty_type ?? null,
            'start_date' => $dutyAssignment->start_date ?? null,
            'end_date' => $dutyAssignment->end_date ?? null,
            'shift_id' => $dutyAssignment->shift_id ?? null,
            'asset_id' => $dutyAssignment->asset_id ?? null,
            'space_id' => $dutyAssignment->space_id ?? null,
            'zone_id' => $dutyAssignment->zone_id ?? null,
            'notes' => $dutyAssignment->notes ?? null,
        ];
    }

    /**
     * Format user shift object for transmission
     * 
     * @param object $userShift User shift object
     * @return array Formatted user shift data
     */
    protected function formatUserShift($userShift)
    {
        return [
            'id' => $userShift->id ?? null,
            'user_id' => $userShift->user_id ?? null,
            'shift_id' => $userShift->shift_id ?? null,
            'shift_name' => $userShift->shift_name ?? null,
            'start_time' => $userShift->start_time ?? null,
            'end_time' => $userShift->end_time ?? null,
            'effective_date' => $userShift->effective_date ?? null,
        ];
    }

    /**
     * Format attendance object for transmission
     * 
     * @param object $attendance Attendance object
     * @return array Formatted attendance data
     */
    protected function formatAttendance($attendance)
    {
        return [
            'id' => $attendance->id ?? null,
            'user_id' => $attendance->user_id ?? null,
            'attendance_date' => $attendance->attendance_date ?? null,
            'clock_in' => $attendance->clock_in ?? null,
            'clock_out' => $attendance->clock_out ?? null,
            'geo_in' => $attendance->geo_in ?? null,
            'geo_out' => $attendance->geo_out ?? null,
            'status' => $attendance->status ?? null,
        ];
    }

    /**
     * Close Redis connection
     */
    public function __destruct()
    {
        if ($this->redis) {
            $this->redis->close();
        }
    }
}
