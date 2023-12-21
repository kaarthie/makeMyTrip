const express = require('express');
const router = express.Router();
const {profileEdit , profileView} = require('../controllers/profileController.js');
router.post('/profileEdit', profileEdit);
router.post('/profileView', profileView);
module.exports = router;