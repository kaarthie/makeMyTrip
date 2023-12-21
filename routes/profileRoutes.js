const express = require('express');
const router = express.Router();
const {profileEdit} = require('../controllers/profileController.js');
router.post('/profileEdit', profileEdit);
module.exports = router;