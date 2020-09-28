const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const callbackURLSchema = new Schema({
  URL: {
    type: String,
  },
  test: {
    type: Boolean,
  },
  user: {
    type: Schema.Types.ObjectId
  },
});

const CallbackURL = mongoose.model('CallbackURL', callbackURLSchema);

module.exports = CallbackURL