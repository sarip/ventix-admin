const { emitToUser, emitToRoom } = require("../utils/rooms.js");
const logger = require("../utils/logger.js");

/**
 * Handle work order events including assignments and status updates
 * @param {Server} io - Socket.io server instance  
 * @param {Object} data - Event data from Redis
 */
module.exports = function handleWorkOrderEvent(io, data) {
    const { event, workOrder, userId, assignedTo, previousAssignedTo } = data;

    logger.info(`Work Order event received: ${event}`, {
        workOrderId: workOrder?.id,
        userId,
        assignedTo
    });

    switch (event) {
        case "wo:created":
            // Work order created - notify creator
            if (userId) {
                emitToUser(io, userId, "wo:created", {
                    event: "wo:created",
                    workOrder,
                    message: `Work Order #${workOrder?.wo_code} created successfully`,
                    timestamp: new Date().toISOString()
                });
            }
            break;

        case "wo:assigned":
            // Work order assigned to user
            logger.info(`Work order #${workOrder?.wo_code} assigned to user #${assignedTo}`);

            // Notify the assigned user
            if (assignedTo) {
                emitToUser(io, assignedTo, "wo:assigned", {
                    event: "wo:assigned",
                    workOrder,
                    message: `You have been assigned Work Order #${workOrder?.wo_code}`,
                    severity: "high",
                    timestamp: new Date().toISOString()
                });
            }

            // Notify previous assignee if reassignment
            if (previousAssignedTo && previousAssignedTo !== assignedTo) {
                emitToUser(io, previousAssignedTo, "wo:reassigned", {
                    event: "wo:reassigned",
                    workOrder,
                    message: `Work Order #${workOrder?.wo_code} has been reassigned`,
                    timestamp: new Date().toISOString()
                });
            }

            // Emit to work order room for real-time updates
            if (workOrder?.id) {
                emitToRoom(io, `wo:${workOrder.id}`, "wo:update", {
                    event: "wo:assigned",
                    workOrder,
                    assignedTo,
                    timestamp: new Date().toISOString()
                });
            }

            // Notify supervisors/managers
            emitToRoom(io, "role:supervisor", "wo:assigned", {
                event: "wo:assigned",
                workOrder,
                assignedTo,
                message: `Work Order #${workOrder?.wo_code} assigned to user #${assignedTo}`,
                timestamp: new Date().toISOString()
            });
            break;

        case "wo:status_changed":
            // Work order status changed
            const { status, previousStatus } = data;

            // Notify assigned user
            if (workOrder?.assigned_to) {
                emitToUser(io, workOrder.assigned_to, "wo:status_changed", {
                    event: "wo:status_changed",
                    workOrder,
                    status,
                    previousStatus,
                    message: `Work Order #${workOrder?.wo_code} status changed to ${status}`,
                    timestamp: new Date().toISOString()
                });
            }

            // Emit to work order room
            if (workOrder?.id) {
                emitToRoom(io, `wo:${workOrder.id}`, "wo:update", {
                    event: "wo:status_changed",
                    workOrder,
                    status,
                    previousStatus,
                    timestamp: new Date().toISOString()
                });
            }
            break;

        case "wo:completed":
            // Work order completed
            if (workOrder?.assigned_to) {
                emitToUser(io, workOrder.assigned_to, "wo:completed", {
                    event: "wo:completed",
                    workOrder,
                    message: `Work Order #${workOrder?.wo_code} marked as completed`,
                    severity: "medium",
                    timestamp: new Date().toISOString()
                });
            }

            // Notify creator/requester
            if (workOrder?.created_by && workOrder.created_by !== workOrder.assigned_to) {
                emitToUser(io, workOrder.created_by, "wo:completed", {
                    event: "wo:completed",
                    workOrder,
                    message: `Work Order #${workOrder?.wo_code} has been completed`,
                    timestamp: new Date().toISOString()
                });
            }
            break;

        case "wo:updated":
        case "wo:deleted":
            // Standard work order events
            if (userId) {
                emitToUser(io, userId, "wo:update", data);
            }
            if (workOrder?.id) {
                emitToRoom(io, `wo:${workOrder.id}`, "wo:update", data);
            }
            break;

        default:
            logger.warn(`Unknown work order event: ${event}`);
            // Fallback to generic notification
            if (userId) {
                emitToUser(io, userId, "wo:update", data);
            }
    }
};
