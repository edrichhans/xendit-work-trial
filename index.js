//set up dependencies
require('dotenv').config()
const express = require("express");
const redis = require("redis");
const axios = require("axios");
const bodyParser = require("body-parser");
const routes = require("./routes")
const mongoose = require('mongoose')
const models = require("./models")

//setup port constants
// const port_redis = process.env.PORT || 6379;
const port = process.env.PORT || 5000;

function main() {
  //configure express server
  const app = express();

  //Body Parser middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(async (req, res, next) => {
    req.context = {
      models,
    };
    next();
  });

  app.use('/callback', routes.callback);
  app.use('/signup', routes.signup);
  app.use('/send', routes.send);


  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);

  mongoose.connect(
    process.env.NODE_ENV === 'test' ? global.__DB_URL__ : process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  //listen on port 5000;
  var server = app.listen(port, () => console.log(`Server running on Port ${port}`));

  return {app, server}
}

module.exports = main()