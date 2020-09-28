var express = require('express')
var queue = require('../queue/queue')
var router = express.Router()

router.post('/', async function(req, res) {
  try {
    const { API_key, URL_id, payload } = req.body
    const user = await req.context.models.User.findOne({
      API_key: API_key,
    })

    if(user) {
      const url = await req.context.models.CallbackURL.findOne({
        _id: URL_id,
        user: user._id,
      })

      if(url) {
        const request = await req.context.models.Request.create({
          callbackUrlId: url._id,
          status: 'pending',
          payload: payload,
        })
        var message = {url: url.URL, API_key: API_key, payload: payload, test: url.test, request_id: request._id}
        queue.add(message, {
          // backoff: 1000,
          backoff: {
            type: 'exponential',
            delay: process.env.BACKOFF,
          },
          attempts: process.env.MAX_RETRIES // number of attempts before job finishes
        })
        return res.send({message: 'Message added to queue', success: true})
      }
      else {
        return res.status(403).send({message: 'The user does not have this URL.', success: false})
      }
    }
    else {
      return res.status(400).send({message: 'User not found.', success: false})
    }
  }
  catch(err) {
    console.log(err)
    return res.status(400).send({message: "There was an error processing your request", success: false})
  }
})

module.exports = router