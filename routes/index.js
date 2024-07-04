const path = require('path')
const { enqueueUpload } = require('../functions/handleUpload')

module.exports = (fastify) => {
  fastify.post('/upload', async (request, reply) => {
    const { url, id } = request.body
    const output = path.resolve(__dirname, `${id}.mp4`)

    enqueueUpload(url, id, output)

    reply.status(200).send({ message: 'Upload started' })
  })
}
