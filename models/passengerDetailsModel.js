const mongoose = require('mongoose');

const passengerDetailsSchema = new mongoose.Schema({
    flightId: { type: String, required: true },
    adult: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        countryCode: { type: String },
        mobile: { type: String },
        email: { type: String },
    },
    children: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: String },
    },
    infant: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: String },
    },
});

const PassengerDetails = mongoose.model('PassengerDetails', passengerDetailsSchema);

module.exports = PassengerDetails;
