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
    port: 587,  // ✅ Change port from 465 to 587
    secure: false,  // ❌ 465 ke liye `true`, lekin 587 ke liye `false`
    auth: {
        user: process.env.GMAIL_SECRET_EMIAL, // Your Gmail
        pass: process.env.GMAIL_SECRET_PASS // App Password
    },
    tls: {
        rejectUnauthorized: false // ✅ Ignore self-signed cert errors
    },
    connectionTimeout: 10000, // Increase connection timeout
    socketTimeout: 10000 // Increase socket timeout
});

// Directly Exporting Transporter
module.exports = transporter;
