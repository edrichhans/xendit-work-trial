var axios = require('axios')
var Queue = require('bull');
const models = require("../models")

var messageQueue = new Queue('messages', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD
  }
}); // Specify Redis connection using object

messageQueue.process(async function(job){
  await sendCallback(job.data)
  if(job.attemptsMade >= process.env.MAX_RETRIES - 1) {
    try {
      console.log('Request Failed.')
      await models.Request.updateOne({_id: job.data.request_id}, {status: 'failed'})
    }
    catch(err) {
      console.log('unable to update DB')
    }
  }
});

async function sendCallback(params) {
  return new Promise(async function(resolve, reject) {
    const { url, API_key, payload, test, request_id } = params
    try {
      const data = {API_key, test: test?true:false, payload: payload}
      axios.post(url, data).then(async ack => {
        console.log('Notification successfully sent to: ' + url)
        try {
          await models.Request.updateOne({_id: request_id}, {status: 'sent'})
        }
        catch(err) {
          console.log('unable to update DB')
        }
        if(ack) return resolve(ack)//done()
        // return resolve(ack)
      }).catch(err => {
        console.log('Notification sending failed. Retrying.')
        reject(err)
      })
    }
    catch(err) {
      console.log(err)
      // return reject(err)
    }
  })
}

module.exports = messageQueue
module.exports.sendCallback = sendCallback