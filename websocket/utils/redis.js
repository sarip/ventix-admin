const Redis = require("ioredis");
const config = require("../config.js");

const redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
});

module.exports = redis;
