const mongoose = require('mongoose');

// Create a Mongoose schema for the Air Ticket
const airTicketSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  flightNo: {
    type: String,
    required: true,
  },
  seatNo: {
    type: String,
    required: true,
  },
  passengerName: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  paymentId: {
    type: String,
    required: true,
  }
});

// Create a Mongoose model for the Air Ticket using the schema
const AirTicket = mongoose.model('AirTicket', airTicketSchema);

module.exports = AirTicket;
