const fastify = require('fastify')({ logger: true })
const dotenv = require('dotenv')
const routes = require('./routes')

dotenv.config()

// Register routes
routes(fastify)

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 8080, host: '0.0.0.0' })
    console.log(`Server is running on port ${process.env.PORT || 8080}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
