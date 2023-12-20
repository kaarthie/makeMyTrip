const express = require('express');
const router = express.Router();
const City = require('../models/cityModel.js');
// Importing Controllers
const {searchFlights, allFlights, searchCity, searchCity2 } = require('../controllers/flightController.js');

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

module.exports = router
// User Routes

// router.post('/otpEmail' , otpEmail);
// router.post('/otpPhone' , otpPhone);
// router.post('/verifyPhone' , verifyPhone);
// router.post('/verifyEmail',verifyEmail)
// router.put('/editUser/:userId', userEdit);
// router.get('/viewUser/:userId', userView);
// router.post('/userCheck' , userCheck);
// router.post('/setPassword' , setPassword);
// module.exports = router;