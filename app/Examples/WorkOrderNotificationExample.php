<?php

/**
 * Example: Work Order Notification Integration
 * 
 * This file shows how to integrate work order notifications
 * into your WorkOrderController or service layer.
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-10
 */

namespace App\Examples;

use App\Libraries\RedisNotification;

class WorkOrderNotificationExample
{
    /**
     * Example: Notify when work order is assigned to user
     */
    public function assignWorkOrder($workOrderId, $assignedToUserId)
    {
        // Your existing code to assign work order
        $WorkOrder = new \App\Models\WorkOrder();
        $workOrder = $WorkOrder->find($workOrderId);

        // Store previous assignee for reassignment notification
        $previousAssignedTo = $workOrder->assigned_to;

        // Update assignment
        $WorkOrder->update($workOrderId, [
            'assigned_to' => $assignedToUserId,
            'status' => 'assigned'
        ]);

        // Reload workorder with updated data
        $workOrder = $WorkOrder->find($workOrderId);

        // Send notification
        $redis = new RedisNotification('wo');
        $redis->publishWorkOrderAssignment($workOrder, $assignedToUserId, $previousAssignedTo);

        return $workOrder;
    }

    /**
     * Example: Notify when work order status changes
     */
    public function updateWorkOrderStatus($workOrderId, $newStatus)
    {
        $WorkOrder = new \App\Models\WorkOrder();
        $workOrder = $WorkOrder->find($workOrderId);

        $previousStatus = $workOrder->status;

        // Update status
        $WorkOrder->update($workOrderId, [
            'status' => $newStatus
        ]);

        // Reload
        $workOrder = $WorkOrder->find($workOrderId);

        // Send notification
        $redis = new RedisNotification('wo');
        $redis->publishWorkOrderStatusChange($workOrder, $newStatus, $previousStatus);

        // If completed, send completion notification
        if ($newStatus === 'completed') {
            $redis->publishWorkOrderCompleted($workOrder);
        }

        return $workOrder;
    }

    /**
     * Example: Notify when work order is created
     */
    public function createWorkOrder($data, $userId)
    {
        $WorkOrder = new \App\Models\WorkOrder();

        $workOrderId = $WorkOrder->insert($data);
        $workOrder = $WorkOrder->find($workOrderId);

        // Send notification
        $redis = new RedisNotification('wo');
        $redis->publishWorkOrderCreated($workOrder, $userId);

        // If assigned immediately, send assignment notification too
        if (isset($data['assigned_to'])) {
            $redis->publishWorkOrderAssignment($workOrder, $data['assigned_to']);
        }

        return $workOrder;
    }

    /**
     * Example usage in WorkOrderController
     * 
     * Add this to your WorkOrderController::create() method:
     */
    public function exampleControllerCreate()
    {
        // Example code snippet for WorkOrderController::create()
        /*
        $current_user = $this->request->current_user;
        $WorkOrder = new WorkOrder();

        $create_data = [
            'wo_code' => $this->request->getPost('wo_code'),
            'title' => $this->request->getPost('title'),
            'description' => $this->request->getPost('description'),
            'assigned_to' => $this->request->getPost('assigned_to'),
           'priority' => $this->request->getPost('priority'),
            'status' => 'new',
            'created_by' => $current_user['id']
        ];

        $wo_id = $WorkOrder->insert($create_data);

        // Send real-time notifications
        $workOrder = $WorkOrder->find($wo_id);
        $redis = new RedisNotification('wo');
        $redis->publishWorkOrderCreated($workOrder, $current_user['id']);

        // If assigned immediately, notify assigned user
        if ($create_data['assigned_to']) {
            $redis->publishWorkOrderAssignment($workOrder, $create_data['assigned_to']);
        }

        return $this->successOutput(['wo_id' => $wo_id], 201);
        */
    }

    /**
     * Example usage in WorkOrderController::update() method
     */
    public function exampleControllerUpdate()
    {
        // Example code snippet for WorkOrderController::update()
        /*
        $WorkOrder = new WorkOrder();
        $existingWorkOrder = $WorkOrder->find($id);

        $previousStatus = $existingWorkOrder->status;
        $previousAssignedTo = $existingWorkOrder->assigned_to;

        $update_data = [
            'status' => $this->request->getPost('status'),
            'assigned_to' => $this->request->getPost('assigned_to'),
            // ... other fields
        ];

        $WorkOrder->update($id, $update_data);
        $workOrder = $WorkOrder->find($id);

        // Send notifications
        $redis = new RedisNotification('wo');

        // Status changed
        if ($update_data['status'] && $update_data['status'] !== $previousStatus) {
            $redis->publishWorkOrderStatusChange($workOrder, $update_data['status'], $previousStatus);

            if ($update_data['status'] === 'completed') {
                $redis->publishWorkOrderCompleted($workOrder);
            }
        }

        // Assignment changed
        if ($update_data['assigned_to'] && $update_data['assigned_to'] !== $previousAssignedTo) {
            $redis->publishWorkOrderAssignment($workOrder, $update_data['assigned_to'], $previousAssignedTo);
        }

        return $this->successOutput(['work_order' => $workOrder]);
        */
    }
}
