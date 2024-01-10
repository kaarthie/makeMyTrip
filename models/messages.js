const mongoose = require('mongoose');

const sentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  messages: [
    {
      to: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
});

const Sent = mongoose.model('Sent', sentSchema);

module.exports = Sent;
