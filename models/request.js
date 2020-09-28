const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const requestSchema = new Schema({
  callbackUrlId: {
    type: Schema.Types.ObjectId,
  },
  // pending, sent
  status: {
    type: String,
  },
  payload: {
    type: String,
  }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request