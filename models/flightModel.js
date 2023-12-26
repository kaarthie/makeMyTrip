const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  id : {
    type : String, required : true
  },
  airline: {
    name: { type: String, required: [true, 'Airline name is required'] },
    logo: { type: String, required: [true, 'Airline logo is required'] },
  },
  departure: {
    city: { type: String, required: [true, 'Departure city is required'] },
    cityCode: { type: String },
    airport: { type: String },
    time: { type: String, required: [true, 'Departure time is required'] },
  },
  arrival: {
    city: { type: String, required: [true, 'Arrival city is required'] },
    cityCode: { type: String},
    airport: { type: String },
    time: { type: String, required: [true, 'Arrival time is required'] },
  },
  duration: {
    hours: { type: Number, required: [true, 'Duration hours is required'] },
    minutes: { type: Number, required: [true, 'Duration minutes is required'] },
  },
  price: {
    basePrice: { type: Number, required: [true, 'Base price is required'] },
    tax: { type: Number, required: [true, 'Tax is required'] },
    total: { type: Number, required: [true, 'Total price is required'] },
  },
  logo: {
    type: String,
  },
  stop : {
    type : String,
  }
});

const Flight = mongoose.model('flights' , flightSchema);
module.exports = Flight;
  