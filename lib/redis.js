const { createClient } = require('redis')
require('dotenv').config()

const redisClient = createClient({
  url: process.env.UPSTASH_REDIS_URL
})

redisClient.on('error', (err) => console.log('Redis Client Error', err))

module.exports = redisClient
