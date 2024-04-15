const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;



app.use(cors({
  origin: '*', // Allow requests from any origin, update this according to your requirements
  methods: ['POST'], // Allow only POST requests
  allowedHeaders: ['Content-Type'], // Allow only specified headers
}));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable
    pass: process.env.EMAIL_PASS, // Use environment variable
  },
});

app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, address, propertyType, bedrooms, bathrooms, sqFootage, offices, comment} = req.body;

  let message = `New Request!\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\nProperty Type: ${propertyType}\n`;

   if (propertyType === 'residential') {
    message += `Bedrooms: ${bedrooms}\nBathrooms: ${bathrooms}\nSquare Footage: ${sqFootage}\nAdditional Comment: ${comment}\n`;
  } else if (propertyType === 'office') {
    message += `Offices: ${offices}\nBathrooms: ${bathrooms}\nSquare Footage: ${sqFootage}\nAdditional Comment: ${comment}\n`;
  }

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'taylormclean0813@gmail.com', // Replace with the recipient's email
    subject: 'New Form Submission!',
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});