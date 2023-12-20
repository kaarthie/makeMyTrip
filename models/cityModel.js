const mongoose = require('mongoose');
const citySchema = new mongoose.Schema({
    city: String,
    airport: String,
    country: String
})
const City = mongoose.model('cities', citySchema);
module.exports = City;