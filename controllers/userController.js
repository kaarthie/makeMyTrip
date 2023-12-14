const User = require('../models/userModel.js');
const nodemailer = require('nodemailer');
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

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
module.exports.createUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karthikeyan.r@codingmart.com',
        pass: 'Karthi@09CM'
      }
    });
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const mailOptions = {
      from: 'karthikeyan.r@codingmart.com',
      to: email,
      subject: 'MakeMyTrip Verification',
      text: `Your OTP for MakeMyTrip Verification: ${otp}`,
      html: `<p>Your OTP for MakeMyTrip Verification: <b>${otp}</b></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending OTP email' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ otp: otp })
      }
    });
  }
  catch (err) {
    console.error('Error in createUser:', err);
    res.status(401).json({ error: "Error in Sending OTP" });
  }

}

module.exports.createUserByPhone = async (req , res) => {
  const {phone} = req.body;
  
}