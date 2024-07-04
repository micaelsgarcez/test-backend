const axios = require('axios')
const fs = require('fs')

async function downloadFile(url, filePath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath)
    response.data.pipe(writer)
    let error = null
    writer.on('error', (err) => {
      error = err
      writer.close()
      reject(err)
    })
    writer.on('close', () => {
      if (!error) {
        resolve(filePath)
      }
    })
  })
}

module.exports = downloadFile
