const express = require('express');
const router = express.Router();
const City = require('../models/cityModel.js');
// Importing Controllers
const { searchFlights, allFlights, searchCity, searchCity2 } = require('../controllers/flightController.js');
const { userEdit, userView } = require('../controllers/userController.js');



router.get('/allFlights', allFlights)

router.get('/getCities', async (req, res) => {
    let arr = await City.find({});
    res.send(arr);
})

router.post('/searchCity', searchCity)

router.post('/searchCity2', searchCity2)
router.post("/searchFlights", searchFlights);

router.post('/createUser' , (req , res) => {
    const {displayName , email , photoURL } = req.body;
    
})

router.put('/editUser/:userId', userEdit);

router.get('/viewUser/:userId', userView);


module.exports = router;