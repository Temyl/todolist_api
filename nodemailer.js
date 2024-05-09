const nodemailer = require('nodemailer');
require('dotenv').config();

// console.log(process.env.passkey);
const username = process.env.mail_username;
const password = process.env.passkey;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: username,
        pass: password
    }
});

transporter.verify(function(error, success) {
    if (error) {
        console.error('Transporter configuration error:', error);
    } else {
        console.log('Server is ready to take our messages:', success);
    }
});


module.exports = { transporter }; 