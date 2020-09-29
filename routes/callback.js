var express = require('express')
var router = express.Router()
var queue = require('../queue/queue')

router.post('/subscribe', async function(req, res) {
  const { API_key, url } = req.body

  const user = await req.context.models.User.findOne({
    API_key: API_key,
  })

  if(user) {
    if(!validateUrl(url)) {
      return res.status(403).send({
        message: 'URL is not valid.',
        success: false,
      })
    }
    const callbackUrl = await req.context.models.CallbackURL.create({
      user: user._id,
      URL: url,
      status: 'pending',
      test: true,
    })

    return res.send({
      message: 'Successfully subscribed URL',
      success: true,
      URL_id: callbackUrl._id,
      user: user._id,
      URL: url,
      status: 'pending',
      test: true,
    })
  }
  else {
    return res.status(400).send({message: 'User not found.', success: false})
  }
})

router.post('/activate', async function(req, res) {
  try {
    const { API_key, URL_id } = req.body

    const user = await req.context.models.User.findOne({
      API_key: API_key,
    })

    if(user) {
      const callbackUrl = await req.context.models.CallbackURL.findOneAndUpdate({
        _id: URL_id,
        user: user._id,
      }, {
        test: false
      }, {new: true}).lean()

      if(callbackUrl) {
        return res.send({
          message: 'Successfully activated URL',
          success: true,
          ...callbackUrl,
        })
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
    res.status(400).send({message: 'Invalid URL ID', success: false})
  }
})

function validateUrl(url){
    //eslint-disable-next-line
    let re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return re.test(String(url).toLowerCase())
  }

module.exports = router