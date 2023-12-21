const User = require('../models/userModel.js')

module.exports.profileEdit = async (req, res) => {
    const {email} = req.body;
  console.log("jeu")
    try {
      // Find the user by ID
      const user = await User.findOne({email});
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update only non-empty and non-space values in the request body
      for (const key in req.body) {
        if (key in user._doc && req.body[key].trim() !== '') {
          user[key] = req.body[key].trim();
        }
      }
  
      // Save the updated user
      await user.save();
  
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }