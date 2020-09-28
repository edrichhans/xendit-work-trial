const User = require('./user')
const CallbackURL = require('./callbackURL')
const Request = require('./request')
const mongoose = require('mongoose')

const truncate = async function(){
  if (mongoose.connection.readyState !== 0) {
    const { collections } = mongoose.connection;

    const promises = Object.keys(collections).map(collection => {
      return mongoose.connection.collection(collection).deleteMany({})
    });

    await Promise.all(promises);
  }
};

const disconnect = async function(){
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    await mongoose.connection.close()
  }
};


const models = {
  User,
  CallbackURL,
  Request,
}

module.exports = models
module.exports.truncate = truncate
module.exports.disconnect = disconnect