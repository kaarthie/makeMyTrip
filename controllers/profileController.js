const User = require('../models/userModel.js')

module.exports.profileEdit = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email using findOne
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields based on values from req.body
    Object.assign(user, req.body);

    // Update the user using updateOne
    await User.updateOne({ email: user.email }, user);

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
