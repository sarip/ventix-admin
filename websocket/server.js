const { Server } = require("socket.io");

const redis = require("./utils/redis.js");
const logger = require("./utils/logger.js");
const config = require("./config.js");
const { joinUserRoom } = require("./utils/rooms.js");

const handleAlertMessage = require("./channels/alerts.js");
const handlePmEvent = require("./channels/pm.js");
const handleWorkOrderEvent = require("./channels/wo.js");
const handleTicketEvent = require("./channels/tickets.js");
const handleInventoryEvent = require("./channels/inventory.js");
const handleVendorEvent = require("./channels/vendor.js");

const io = new Server(config.websocketPort, {
    cors: { origin: "*" },
});

logger.info("Starting WebSocket server on port", config.websocketPort);

// subscribe to all redis channels
config.channels.forEach((ch) => {
    redis.subscribe(ch);
    logger.info("Subscribed to channel:", ch);
});

// handle redis incoming messages
redis.on("message", (channel, message) => {
    try {
        const data = JSON.parse(message);

        switch (channel) {
            case "alerts":
                return handleAlertMessage(io, data);

            case "pm":
                return handlePmEvent(io, data);

            case "wo":
                return handleWorkOrderEvent(io, data);

            case "tickets":
                return handleTicketEvent(io, data);

            case "inventory":
                return handleInventoryEvent(io, data);

            case "vendor":
                return handleVendorEvent(io, data);

            default:
                logger.warn("Unknown channel:", channel);
        }
    } catch (e) {
        logger.error("Error parsing message:", e);
    }
});

// WebSocket connections
io.on("connection", (socket) => {
    logger.info("Client connected");

    const userId = socket.handshake.query.userId;
    if (userId) {
        joinUserRoom(socket, userId);
        logger.info(`User ${userId} joined user:${userId}`);
    }

    socket.on("disconnect", () => {
        logger.info("Client disconnected");
    });
});
