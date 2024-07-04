const downloadFile = require('./downloadFile')
const uploadVideo = require('./uploadVideo')
const notifyFrontend = require('./notifyFrontend')
const redisClient = require('../lib/redis')

let isUploading = false

async function handleUpload(url, id, output) {
  try {
    await downloadFile(url, output)
    const location = await uploadVideo(output, id)

    await notifyFrontend(location, id)

    if (!redisClient.isOpen) {
      await redisClient.connect()
    }
    const reply = await redisClient.scan(0, {
      MATCH: `*uploadQueue:*`,
      COUNT: 1
    })
    const keys = reply.keys

    if (keys.length > 0) {
      const nextVideo = await redisClient.get(keys[0])
      await handleUpload(nextVideo.url, nextVideo.id, nextVideo.output)
    }
  } catch (error) {
    console.error('Error handling upload:', error)
  } finally {
    isUploading = false
  }
}

async function enqueueUpload(url, id, output) {
  if (!isUploading) {
    isUploading = true
    handleUpload(url, id, output)
    return
  }

  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
  await redisClient.set(
    `uploadQueue:${id}`,
    JSON.stringify({ url, id, output }),
    {
      EX: 86000
    }
  )
  return
}

module.exports = { enqueueUpload, handleUpload }
