const nodemailer = require("nodemailer");
require("dotenv").config();

// Nodemailer Setup

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_SECRET_EMIAL, // Your Gmail
        pass: process.env.GMAIL_SECRET_PASS // App Password
    }
});

// Directly Exporting Transporter
module.exports = transporter;
