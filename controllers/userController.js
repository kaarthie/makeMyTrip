const User = require('../models/userModel.js');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');

module.exports.userView = async (req, res) => {
  const email = req.body;

  try {
    // Find the user by ID
    const user = await User.findOne({email});

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
  const email = req.body;

  try {
    // Find the user by ID
    const user = await User.findOne({email});

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

// Email Verification

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports.otpEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karthikeyan.r@codingmart.com',
        pass: 'Karthi@09CM',
      },
    });
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const mailOptions = {
      from: 'karthikeyan.r@codingmart.com',
      to: email,
      subject: 'Email Verification',
      text: `Your OTP for Email Verification: ${otp}`,
      html: `<p>Your OTP for Email Verification: <b>${otp}</b></p>`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending OTP email' });
      } else {
        console.log('Email sent:', info.response);
        await EmailOTP.create({
          email,
          otp
        });
        res.status(200).json({ otp: otp })
      }
    });
  }
  catch (err) {
    console.error('Error in createUser:', err);
    res.status(401).json({ error: "Error in Sending OTP" });
  }

}

// Phone Verification - Twilio credentials

const accountSid = 'AC2f0732362152cc6d9ff824ebf8709bbe';
const authToken = 'dc51c8a8f631fe17f8af3e6f4ff6f028';
const client = twilio(accountSid, authToken);
const { EmailOTP, PhoneOTP } = require('../models/otpModel.js')

module.exports.otpPhone = async (req, res) => {
  const { phone } = req.body;

  try {
    // Generate a random OTP (you can use a library like `otp-generator`)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const message = await client.messages.create({
      body: `Your OTP for MakeMyTrip verification is : ${otp}`,
      from: '+15106191068',
      to: phone,
    });

    console.log(`OTP sent to ${phone}`);
    await PhoneOTP.create({
      phone,
      otp
    });
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.verifyPhone = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const num = await PhoneOTP.findOne({ phone, otp });

    if (num) {
      const createdAtDate = num.createdAt;
      const currentDateTime = new Date();
      const timeDifferenceInSeconds = Math.floor((currentDateTime - createdAtDate) / 1000);

      if (timeDifferenceInSeconds <= 90) {
        res.status(200).json({ message: 'OTP verified successfully' });
      } else {
        res.status(401).json({ error: 'OTP has expired' });
      }
    } else {
      res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const num = await EmailOTP.findOne({ email, otp });
    if (num) {
      const createdAtDate = num.createdAt;
      const currentDateTime = new Date();
      const timeDifferenceInSeconds = Math.floor((currentDateTime - createdAtDate) / 1000);

      if (timeDifferenceInSeconds <= 90) {
        res.status(200).json({ message: 'OTP verified successfully' });
      } else {
        res.status(401).json({ error: 'OTP has expired' });
      }
    } else {
      res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.userCheck = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({ name : existingUser.name, message: 'Exists' });
    }
    res.status(404).json({ email, message: "Do not Exists" });
  } catch (error) {
    // Handle any other errors that might occur during the process
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports.setPassword = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!name) {
      let user = await User.findOne({ email });
      if (user.password === password) {
        const token = jwt.sign({ username: user.name }, 'mmt-secret-key', { expiresIn: '1h' });
        res.status(200).json({ name : user.name , message: "Login Success", token });
      } else {
        res.status(401).json({ message: "Incorrect Password" })
      }
    }
    else {
      const newUser = new User({ email, name, password });
      await newUser.save();
      const token = jwt.sign({ username: name }, 'your-secret-key', { expiresIn: '1h' });
      res.status(200).json({ message: "User Created Successfully", token })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

const Sent = require('../models/messages.js');

module.exports.getEmails = async (req , res) => {
  try {
    const {email} = req.body;
    const data = await Sent.find({email});
    res.status(200).json({data});
  } catch (error) {
    res.status(500).json({message : "Error in sending mail"});
    console.log(err);
  }
}
module.exports.sendEmail = async (req, res) => {
  try {
    const { email, subject, text } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karthikeyan.r@codingmart.com',
        pass: 'Karthi@09CM',
      },
    });

    const mailOptions = {
      from: 'karthikeyan.r@codingmart.com',
      to: email,
      subject,
      text,
    };


    // Use async/await for sending emails
    const info = await transporter.sendMail(mailOptions);
    const sentMessage = new Sent({
      email: "sampleEmail",
      messages: [{ to: email, message: `${subject}: ${text}` }],
    });

    // Save the document to the database
    await sentMessage.save();
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error in sending mail:', err);
    res.status(500).json({ error: 'Error sending email' });
  }
};
