const express = require('express');
const router = express.Router();
const City = require('../models/cityModel.js');
const {searchFlights, allFlights, searchCity, searchCity2, storePassengerDetails ,getPassengerDetails, airTicket} = require('../controllers/flightController.js');

router.get('/' , (req , res) => {
    res.json({home : "page"})
})
router.get('/allFlights', allFlights)

router.get('/getCities', async (req, res) => {
    let arr = await City.find({});
    console.log("hai")
    res.send(arr);
})

router.post('/searchCity', searchCity)

router.post('/searchCity2', searchCity2)

router.post("/searchFlights", searchFlights);

router.post('/storePassengerDetails' , storePassengerDetails)

router.post('/getPassengerDetails' , getPassengerDetails)

router.post('/airTicket', airTicket)

module.exports = router