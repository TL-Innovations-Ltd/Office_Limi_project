const transporter = require('../../../utils/gmail_transport');
const UserDB = require('../models/user_models');

// Generate Random Username Function
const generateUsername = () => {
    return "user_" + Math.random().toString(36).substring(2, 10);
  };

//  Store User temprary otp to check
const  user_OTP = {};
module.exports = {
     
    send_otp_service : (req) => { 
        const {email} = req.body;
        if(!email){
            throw new Error('Missing email');
        }
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        user_OTP[email] = otp;  // save OTP to Temprary otp object

        const mailOptions = {
            from: process.env.GMAIL_SECRET_EMIAL,
            to: email,
            subject: "OTP",
            text: `This is your OTP ${otp}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error sending email:", err);
            } else {
                console.log("Email sent:", info.response);
            }
        });
        
        return 'HOgya';
    },

    check_otp_service : async(req) => {
         const {otp} = req.body;
         if(!otp){
             throw new Error('Missing  OTP');
         }
        // OTP ki key (email) extract karne ke liye object ko iterate karna hoga
        let findEmail = null;
        for (let key in user_OTP) {
            console.log(`key : ${key} and otp ; ${user_OTP}`);
            if (user_OTP[key] === otp) {
                findEmail = key;
                break;
            }
        }

        if (!findEmail) {
            throw new Error("Invalid OTP");
        }
        
        // Remove OTP from Temprary otp object after successful verification
        delete user_OTP[findEmail];

        // Generate random username
        const username = generateUsername();

        const newUser = new UserDB({ email : findEmail, username : username });
            await newUser.save();

        return newUser;
    }
    
}