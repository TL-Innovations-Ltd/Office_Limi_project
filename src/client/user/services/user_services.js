const transporter = require('../../../utils/gmail_transport');
const UserDB = require('../models/user_models');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');

const resend = new Resend("re_8Qk5APrR_PCFiD93vLzBXJxhzs8oPsQbC");
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

        // **Generate Deep Link for Swift App**
        const appDeepLink = `http:/limiapp/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`

        const mailOptions = {
       from: process.env.GMAIL_SECRET_EMIAL,
       to: email,
       subject: "Limi App OTP",
       html: `
       <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        text-align: center;
       ">
        <h2 style="color: #333;">Limi App OTP Verification</h2>
        <p style="font-size: 16px;">This is your OTP:</p>
        <p style="
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin: 10px 0;
        ">${otp}</p>
        <p style="font-size: 14px; color: #666;">This OTP will expire in 15 minutes.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 16px;">Or click the button below to verify:</p>

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
                <td align="center" bgcolor="#007bff" style="
                    border-radius: 5px;
                    padding: 12px 24px;
                    display: block;
                ">
                    <a href="limiapp://verify-otp?email=${encodeURIComponent(email)}&otp=${otp}"
                        style="
                            font-size: 16px;
                            color: #ffffff;
                            text-decoration: none;
                            font-weight: bold;
                            display: block;
                        ">
                        Verify OTP
                    </a>
                </td>
            </tr>
        </table>

        <p style="margin-top: 20px; font-size: 12px; color: #999;">
            If you didn't request this, please ignore this email.
        </p>
       </div>
       `
        }
        
    
            let  s =  await transporter.sendMail(mailOptions);
            console.log(s);
             if(!s){
                 throw new Error("Failed to send OTP email");
             }
        // transporter.sendMail(mailOptions, (err, info) => {
        //     if (err) {
        //         console.error("Error sending email:", err);
        //     } else {
        //         console.log("Email sent:", info.response);
        //     }
        // });
      
    // const response = await resend.emails.send({
    //     from: 'Limi@onresend.com',  // Free plan par yehi use hoga
    //     to: email,
    //     subject: 'LIMI OTP',
    //     html: `<p>${otp}</p>`
    // });
    // console.log('✅ Email Sent:', response);
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
            { id: newInstaller._id },
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