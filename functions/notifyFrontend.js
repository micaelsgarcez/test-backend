const axios = require('axios')

async function notifyFrontend(location, id) {
  try {
    await axios.post('https://memberclass.com.br/api/webhook/video', {
      message: 'Upload complete',
      location,
      id
    })
  } catch (error) {
    console.error('Error notifying frontend:', error)
  }
}

module.exports = notifyFrontend
