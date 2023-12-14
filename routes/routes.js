const express = require('express');
const router = express.Router();
const City = require('../models/cityModel.js');
// Importing Controllers
const {searchFlights, allFlights, searchCity, searchCity2 } = require('../controllers/flightController.js');
const { userEdit, userView , createUserByEmail , createUserByPhone} = require('../controllers/userController.js');


// Flight Routes
router.get('/allFlights', allFlights)

router.get('/getCities', async (req, res) => {
    let arr = await City.find({});
    res.send(arr);
})

router.post('/searchCity', searchCity)

router.post('/searchCity2', searchCity2)

router.post("/searchFlights", searchFlights);

// User Routes

router.post('/createUserByEmail' , createUserByEmail);
router.post('/createUserByPhone' , createUserByPhone);
router.put('/editUser/:userId', userEdit);
router.get('/viewUser/:userId', userView);

module.exports = router;