const nodemailer = require("nodemailer");
require("dotenv").config();

// Nodemailer Setup
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.GMAIL_SECRET_EMIAL, // Your Gmail
//         pass: process.env.GMAIL_SECRET_PASS // App Password
//     }
// });

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",  
    port: 587,  
    secure: false, 
    auth: {
        user: process.env.GMAIL_SECRET_EMIAL, 
        pass: process.env.GMAIL_SECRET_PASS
    },
     tls: {
        rejectUnauthorized: false 
    },
});


// Directly Exporting Transporter
module.exports = transporter;
