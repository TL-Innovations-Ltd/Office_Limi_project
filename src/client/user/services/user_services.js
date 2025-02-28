const transporter = require('../../../utils/gmail_transport');
const UserDB = require('../models/user_models');
const jwt = require('jsonwebtoken');
// Generate Random Username Function
const generateUsername = () => {
    return "user_" + Math.random().toString(36).substring(2, 10);
};

module.exports = {

    send_otp_service: async (req) => {
        const { email } = req.body;
        
        if (!email) {
            throw new Error('Missing email');
        }

        const findEmail = await UserDB.findOne({ email: email });
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // <-- 15 min expiry
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        if (!findEmail) {
            await UserDB.create({ email: email, otp: otp, otp_expire_at: otpExpiresAt });
        } else {
            await UserDB.updateOne({ email: email }, { otp: otp, otp_expire_at: otpExpiresAt });
        }

        const mailOptions = {
            from: process.env.GMAIL_SECRET_EMIAL,
            to: email,
            subject: "Limi App OTP",
            text: `This is your OTP ${otp}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error sending email:", err);
            } else {
                console.log("Email sent:", info.response);
            }
        });

        return 'OTP Send  Succesfully & Expiry in 15 mint';
    },

    check_otp_service: async (req) => {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new Error('Missing email or otp');
        }
        const user = await UserDB.findOne({ email });;
        if (!user) {
            throw new Error('User not found');
        }

        if (user.otp !== otp) {
            throw new Error("Invalid OTP");
        }

        if (new Date() > user.otp_expire_at) {
            throw new Error("OTP expired");
        }

        // Generate random username
        const username = generateUsername();

        // Update user (clear OTP, set username)
        const user_data = await UserDB.findOneAndUpdate(
            { email },
            { otp: null, otp_expire_at: null, username: username },
            { new: true } // Yeh updated document return karega
        );

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" } // Token expires in 7 days
        );

        return { data: user_data, token: token };
    },

    installer_user_service : async() =>{
           
        const guestUsername = generateUsername();
          // 🔥 Installer ka expiry 24 hours ke baad set karo
        const installerExpireTime = new Date();
        installerExpireTime.setHours(installerExpireTime.getHours() + 24);

          const newInstaller = new UserDB({
            username: guestUsername,
            email : `${guestUsername}@gmail.com`,
            roles: "installer",
            installer_expire_at: installerExpireTime
        });

        await newInstaller.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" } // Token expires in 7 days
        );

        return { data: newInstaller, token: token };
    },

    update_user_service: async (req) => {
        const { id } = req.params;
        const { user_name } = req.body;

        if (!id || !user_name) {
            throw new Error('Missing user_id or user_name');
        }

        const user = await UserDB.findByIdAndUpdate({ _id: id }, { username: user_name }, { new: true });

        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

}