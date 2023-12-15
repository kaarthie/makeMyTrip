const mongoose = require('mongoose');
const phoneSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

const EmailOTP = mongoose.model('emailOTP' , emailSchema);
const PhoneOTP = mongoose.model('phoneOTP' , phoneSchema);
module.exports = {EmailOTP , PhoneOTP};