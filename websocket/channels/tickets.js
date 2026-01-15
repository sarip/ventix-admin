const { emitToUser, emitToRoom } = require("../utils/rooms.js");
const logger = require("../utils/logger.js");

/**
 * Handle ticket-related events including SLA breaches and escalations
 * @param {Server} io - Socket.io server instance  
 * @param {Object} data - Event data from Redis
 */
module.exports = function handleTicketEvent(io, data) {
    const { event, ticket, userId, escalation, sla } = data;

    logger.info(`Ticket event received: ${event}`, { ticketId: ticket?.id, userId });

    switch (event) {
        case "ticket:created":
        case "ticket:updated":
        case "ticket:deleted":
            // Standard ticket events - notify the user
            if (userId) {
                emitToUser(io, userId, "ticket", data);
            }
            // Also emit to ticket-specific room for real-time updates
            if (ticket?.id) {
                emitToRoom(io, `ticket:${ticket.id}`, "ticket:update", data);
            }
            break;

        case "sla:breach":
            // SLA deadline breached - notify assigned users and supervisors
            logger.warn(`SLA breach for ticket #${ticket?.ticket_code}`, {
                ticketId: ticket?.id,
                deadline: sla?.deadline,
                breachType: sla?.breachType
            });

            // Emit to ticket room
            if (ticket?.id) {
                emitToRoom(io, `ticket:${ticket.id}`, "sla:breach", {
                    event: "sla:breach",
                    ticket,
                    sla,
                    message: `SLA ${sla?.breachType || 'deadline'} breached for ticket #${ticket?.ticket_code}`,
                    severity: "high",
                    timestamp: new Date().toISOString()
                });
            }

            // Notify assigned user if exists
            if (ticket?.assigned_to) {
                emitToUser(io, ticket.assigned_to, "sla:breach", {
                    event: "sla:breach",
                    ticket,
                    sla,
                    message: `SLA breach: Ticket #${ticket?.ticket_code} - ${ticket?.title}`,
                    timestamp: new Date().toISOString()
                });
            }

            // Broadcast to supervisors/managers (role-based room)
            emitToRoom(io, "role:supervisor", "sla:breach", {
                event: "sla:breach",
                ticket,
                sla,
                message: `SLA breach detected for ticket #${ticket?.ticket_code}`,
                timestamp: new Date().toISOString()
            });
            break;

        case "sla:warning":
            // SLA deadline approaching - notify assigned user
            if (ticket?.assigned_to) {
                emitToUser(io, ticket.assigned_to, "sla:warning", {
                    event: "sla:warning",
                    ticket,
                    sla,
                    message: `SLA deadline approaching for ticket #${ticket?.ticket_code}`,
                    timeRemaining: sla?.timeRemaining,
                    severity: "medium",
                    timestamp: new Date().toISOString()
                });
            }
            break;

        case "escalation:triggered":
            // Ticket escalated to next level
            logger.info(`Escalation triggered for ticket #${ticket?.ticket_code}`, {
                ticketId: ticket?.id,
                level: escalation?.level,
                nextEscalation: escalation?.nextEscalationAt
            });

            // Emit to ticket room
            if (ticket?.id) {
                emitToRoom(io, `ticket:${ticket.id}`, "escalation:update", {
                    event: "escalation:triggered",
                    ticket,
                    escalation,
                    message: `Ticket escalated to Level ${escalation?.level}`,
                    severity: "critical",
                    timestamp: new Date().toISOString()
                });
            }

            // Notify users/roles based on escalation level configuration
            if (escalation?.notifyUsers && Array.isArray(escalation.notifyUsers)) {
                escalation.notifyUsers.forEach(notifyUserId => {
                    emitToUser(io, notifyUserId, "escalation:alert", {
                        event: "escalation:triggered",
                        ticket,
                        escalation,
                        message: `ESCALATION Level ${escalation.level}: Ticket #${ticket?.ticket_code} requires attention`,
                        timestamp: new Date().toISOString()
                    });
                });
            }

            // Notify role-based rooms
            if (escalation?.notifyRoles && Array.isArray(escalation.notifyRoles)) {
                escalation.notifyRoles.forEach(role => {
                    emitToRoom(io, `role:${role}`, "escalation:alert", {
                        event: "escalation:triggered",
                        ticket,
                        escalation,
                        message: `ESCALATION Level ${escalation.level}: Ticket #${ticket?.ticket_code}`,
                        timestamp: new Date().toISOString()
                    });
                });
            }
            break;

        case "escalation:resolved":
            // Escalation resolved - ticket completed before max level
            if (ticket?.id) {
                emitToRoom(io, `ticket:${ticket.id}`, "escalation:resolved", {
                    event: "escalation:resolved",
                    ticket,
                    message: `Ticket #${ticket?.ticket_code} resolved - escalation cleared`,
                    timestamp: new Date().toISOString()
                });
            }
            break;

        default:
            logger.warn(`Unknown ticket event: ${event}`);
            // Fallback to generic ticket notification
            if (userId) {
                emitToUser(io, userId, "ticket", data);
            }
    }
};
