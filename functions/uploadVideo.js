const fs = require('fs')
const path = require('path')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const s3Client = require('../lib/s3client')

async function uploadVideo(filePath, id) {
  try {
    const fileStream = fs.createReadStream(filePath)
    const uploadParams = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: `${id}.mp4`,
      Body: fileStream
    }

    const data = await s3Client.send(new PutObjectCommand(uploadParams))
    console.log('Upload complete:', data)

    fs.unlinkSync(filePath) // Delete the local file after upload

    return `https://videos.movimentohub.com.br/${id}.mp4`
  } catch (error) {
    console.error('Error uploading video:', error)
    throw error
  }
}

module.exports = uploadVideo
