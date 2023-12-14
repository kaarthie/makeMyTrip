const nodemailer = require('nodemailer');

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
      to: '19epci015@skcet.ac.in',
      subject: 'MakeMyTrip Verification',
      text: `Your OTP for MakeMyTrip Verification: ${otp}`,
      html: `<p>Your OTP for MakeMyTrip Verification: <b>${otp}</b></p>`,
    };
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
