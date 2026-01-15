const { emitToUser } = require("../utils/rooms");
const logger = require("../utils/logger");

module.exports = function handleAlertMessage(io, data) {
    logger.info("Send alert to user", data.userId, data);

    emitToUser(io, data.userId, "alert", {
        id: data.id,
        type: data.type,
        message: data.message,
        severity: data.severity,
    });
}
