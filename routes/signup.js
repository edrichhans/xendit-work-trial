var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt')
const BCRYPT_SALT_ROUNDS = 12;
const { v4: uuidv4 } = require('uuid');

router.post('/', async function(req, res) {
  try {
    const username = req.body.username
    const password = req.body.password

    const checkUser = await req.context.models.User.findOne({
      username: username
    })

    if(checkUser && checkUser.username) {
      return res.status(403).send({message: 'USER_EXISTS'})
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const apiKey = uuidv4()

    const user = await req.context.models.User.create({
      username: username,
      password: hashedPassword,
      API_key: apiKey,
    })

    return res.send({username: user.username, API_key: apiKey})
  }
  catch(err) {
    return res.status(500)
  }
})

module.exports = router