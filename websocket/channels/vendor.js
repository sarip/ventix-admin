const logger = require("../utils/logger.js");

/**
 * Handle Vendor channel messages
 * Emit contract expiry and invoice overdue alerts
 */
module.exports = function handleVendorEvent(io, data) {
    const { event, vendorContract, invoice, daysRemaining } = data;

    logger.info("Vendor event received:", event);

    switch (event) {
        case "vendor:contract_expiry":
            // Broadcast to all managers / admin
            // TODO: Filter by role when role-based rooms are implemented
            const urgency = daysRemaining <= 7 ? "URGENT" : "normal";
            io.emit("vendor:contract_expiry", {
                type: "vendor_contract_expiry",
                contract: vendorContract,
                daysRemaining,
                urgency,
                message: `Kontrak ${vendorContract.title} akan berakhir dalam ${daysRemaining} hari`,
                timestamp: new Date().toISOString()
            });
            logger.info(`Contract expiry alert sent for contract ID: ${vendorContract.id}`);
            break;

        case "invoice:overdue":
            io.emit("invoice:overdue", {
                type: "invoice_overdue",
                invoice,
                message: `Invoice ${invoice.invoice_number} sudah melewati jatuh tempo`,
                timestamp: new Date().toISOString()
            });
            logger.info(`Invoice overdue alert sent for invoice ID: ${invoice.id}`);
            break;

        default:
            logger.warn("Unknown vendor event:", event);
    }
};
