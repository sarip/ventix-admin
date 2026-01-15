const logger = require("../utils/logger.js");

/**
 * Handle Inventory channel messages
 * Emit low stock alerts to relevant users
 */
module.exports = function handleInventoryEvent(io, data) {
    const { event, inventoryItem } = data;

    logger.info("Inventory event received:", event);

    switch (event) {
        case "inventory:low_stock":
            // Broadcast to all procurement staff / admin
            // TODO: Filter by role when role-based rooms are implemented
            io.emit("inventory:low_stock", {
                type: "inventory_low_stock",
                item: inventoryItem,
                message: `Stock rendah: ${inventoryItem.name} (${inventoryItem.stock} ${inventoryItem.unit})`,
                timestamp: new Date().toISOString()
            });
            logger.info(`Low stock alert sent for item ID: ${inventoryItem.id}`);
            break;

        default:
            logger.warn("Unknown inventory event:", event);
    }
};
