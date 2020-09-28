const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  API_key: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User