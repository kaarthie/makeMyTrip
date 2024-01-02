const express = require('express');
const router = express.Router();
const {profileEdit , profileView} = require('../controllers/profileController.js');
const jwt = require('jsonwebtoken')

const authenticateJWT = (req, res, next) => {
    // const token = req.header('Authorization');
    const token = req.body.token
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, 'mmt-secret-key', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      req.user = user;
      next();
    });
  };

router.post('/profileEdit', authenticateJWT, profileEdit);
router.post('/profileView', authenticateJWT, profileView);
module.exports = router;