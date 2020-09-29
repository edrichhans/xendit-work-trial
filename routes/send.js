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
        return res.send({request_id: request._id, message: 'Message added to queue', success: true})
      }
      else {
        return res.status(403).send({message: 'The user does not have this URL.', success: false})
      }
    }
    else {
      return res.status(403).send({message: 'User not found.', success: false})
    }
  }
  catch(err) {
    console.log(err)
    return res.status(400).send({message: "There was an error processing your request", success: false})
  }
})

router.get('/status/:request_id', async (req, res) => {
  try {
    const {request_id} = req.params
    const { API_key } = req.query

    const user = await req.context.models.User.findOne({
      API_key: API_key,
    })

    if(user) {
      if (!request_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({message: 'Invalid request ID', success: false})
      }
      const request = await req.context.models.Request.findById(request_id).lean()
      if(request) {
        return res.send({...request, success: true})
      }
      else {
        return res.status(400).send({message: 'Request not found', success: false})
      }
    }
    else {
      return res.status(403).send({message: 'User not found.', success: false})
    }
  }
  catch(err) {
    console.log(err)
    return res.status(400).send({message: "There was an error processing your request", success: false})
  }
})

router.get('/status', async (req, res) => {
  try {
    const { API_key } = req.query

    const user = await req.context.models.User.findOne({
      API_key: API_key,
    })

    if(user) {
      const urls = await req.context.models.CallbackURL.find({
        user: user._id
      })

      const requests = await req.context.models.Request.find({
        callbackUrlId: {
          $in: urls.map(u => u._id)
        }
      }).lean()

      return res.send(requests)
    }
    else {
      return res.status(403).send({message: 'User not found.', success: false})
    }
  }
  catch(err) {
    console.log(err)
    return res.status(400).send({message: "There was an error processing your request", success: false})
  }
})

module.exports = router