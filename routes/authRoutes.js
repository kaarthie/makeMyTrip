const express = require('express');
const router = express.Router();
const { userEdit, userView , otpEmail , otpPhone, verifyPhone, userCheck , verifyEmail, setPassword, sendEmail, getEmails} = require('../controllers/userController.js');

router.post('/otpEmail' , otpEmail);

router.post('/otpPhone' , otpPhone);

router.post('/verifyPhone' , verifyPhone);

router.post('/verifyEmail',verifyEmail)

router.put('/editUser/:userId', userEdit);

router.get('/viewUser/:userId', userView);

router.post('/userCheck' , userCheck);

router.post('/setPassword' , setPassword);

router.post('/sendEmail', sendEmail)

router.post('/getEmails', getEmails)

router.post('/sendEmail', sendEmail);

module.exports = router;