const mongoose = require('mongoose');
const trainSchema = new mongoose.Schema({
    railway: { 
      name : {type : String , required : true},
    },
    departure: {
      city: { type: String, required: true },
      cityCode: { type: String, required: true },
      station: { type: String },
      time: { type: Date, required: true },
    },
    arrival: {
      city: { type: String, required: true },
      cityCode: { type: String, required: true },
      station: { type: String},
      time: { type: Date, required: true },
    },
    duration: {
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
    },
    price: {
      basePrice: { type: Number, required: true },
      tax: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    logo : {
      type : String
    }
  });