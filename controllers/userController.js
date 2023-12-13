const User = require('../models/userModel.js')
module.exports.userView = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports.userEdit = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user details
      user.name = req.body.name || user.name;
      user.birthday = req.body.birthday || user.birthday;
      user.gender = req.body.gender || user.gender;
      user.maritalStatus = req.body.maritalStatus || user.maritalStatus;
      user.address = req.body.address || user.address;
      user.pincode = req.body.pincode || user.pincode;
      user.state = req.body.state || user.state;
  
      // Save the updated user
      const updatedUser = await user.save();
  
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
