require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
    socket: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOSTNAME
    },
    password: process.env.REDIS_PASSWORD
});

if (!client.isOpen) {
    client.connect();
    console.log("Connected Redis");
}

client.on('error', (error)=>console.log(""));


module.exports = client;