const Redis = require("ioredis");

const redis = new Redis({
    port: process.env["REDIS_PORT"],
    host: process.env["REDIS_ENDPOINT"],
    family: process.env["REDIS_FAMILY"], // 4 (IPv4) or 6 (IPv6)
    username: process.env["REDIS_USERNAME"],
    password: process.env["REDIS_PASSWORD"],
    db: process.env["REDIS_DB"],
    tls: process.env["REDIS_TLS"].toLowerCase() == "true" ? true : false,
})

module.exports = { redis };
