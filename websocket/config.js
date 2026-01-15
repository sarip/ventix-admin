module.exports = {
    websocketPort: process.env.WS_PORT || 3001,
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
    },
    channels: ["alerts", "tickets", "pm", "wo", "inventory", "vendor"]
};
