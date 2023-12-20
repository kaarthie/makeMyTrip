const express = require('express');
const router = express.Router();
// Importing controllers
const { userEdit, userView , otpEmail , otpPhone, verifyPhone, userCheck , verifyEmail, setPassword} = require('../controllers/userController.js');

router.post('/otpEmail' , otpEmail);

router.post('/otpPhone' , otpPhone);

router.post('/verifyPhone' , verifyPhone);

router.post('/verifyEmail',verifyEmail)

router.put('/editUser/:userId', userEdit);

router.get('/viewUser/:userId', userView);

router.post('/userCheck' , userCheck);

router.post('/setPassword' , setPassword);

module.exports = router;