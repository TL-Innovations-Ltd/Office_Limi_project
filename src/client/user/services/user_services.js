const transporter = require('../../../utils/gmail_transport');
const UserDB = require('../models/user_models');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const geoip = require("geoip-lite");
const { nanoid } = require('nanoid');
const Customer_DB = require('../models/customer_capture_model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "drwoekliw",
    api_key: "253749524177665",
    api_secret: "ua-T1KruwcdPtoJoUPX8hztSJkU",
});

// const { Resend } = require('resend');

// const resend = new Resend("re_8Qk5APrR_PCFiD93vLzBXJxhzs8oPsQbC");
// Generate Random Username Function


const generateUsername = () => {
    return "user_" + Math.random().toString(36).substring(2, 10);
};

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

async function getIPAndRegion(req) {
    try {
        let clientIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        // Remove extra formatting if any (useful in some cases)
        clientIP = clientIP.split(",")[0].trim();
        // First Try: Offline Lookup using `geoip-lite`
        // "39.41.235.12"
        const geo = geoip.lookup(clientIP);

        if (geo && (geo.city || geo.country)) {
            const city = geo.city || "Unknown City";
            const country = geo.country || "Unknown Country";
            return { ip: clientIP, region: `${city}, ${country}` };
        }

        // Second Try: Online Lookup using `ip-api.com`
        const response = await axios.get(`http://ip-api.com/json/${clientIP}`);
        const { query: ip, country, regionName } = response.data;
        return { ip, region: `${regionName}, ${country}` };
    } catch (error) {
        // console.log("GeoIP Lookup Error:", error);
        return { ip: "Unknown", region: "Unknown" };
    }
}



const uploadImage = async (imageBase64) => {

    // Ensure the base64 string includes the correct prefix (data URL)
    if (!imageBase64.startsWith('data:')) {
        throw new Error('Invalid base64 image format');
    }

    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: 'limi-business-cards',
    });
    return {
        url: uploadResponse.secure_url,
        id: uploadResponse.public_id,
    };
};

module.exports = {

    send_otp_service: async (req) => {
        const { email } = req.body;

        if (!isValidEmail(email) || !email) {
            throw new Error("Invalid email format");
        }

        const { ip, region } = await getIPAndRegion(req);
        //    console.log(ip , region);
        const findEmail = await UserDB.findOne({ email: email });

        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // <-- 15 min expiry
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        if (!findEmail) {
            await UserDB.create({ email: email, ip: ip, region: region, otp: otp, otp_expire_at: otpExpiresAt });
        } else {
            await UserDB.updateOne({ email: email }, { otp: otp, otp_expire_at: otpExpiresAt });
        }

        // **Generate Deep Link for Swift App**
        const mailOptions = {
            from: process.env.BREVO_SECRET_EMAIL,
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

        let s = await transporter.sendMail(mailOptions);
        return 'OTP Send  Succesfully & Expiry in 15 mint';
    },

    check_otp_service: async (req) => {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new Error('Missing email or otp');
        }
        const user = await UserDB.findOne({ email });
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
            { expiresIn: "7d" } // Token expires in 7 days
        );

        return { data: user_data, token: token };
    },

    installer_user_service: async () => {

        const guestUsername = generateUsername();
        // 🔥 Installer ka expiry 24 hours ke baad set karo
        const installerExpireTime = new Date();
        installerExpireTime.setHours(installerExpireTime.getHours() + 24);

        const newInstaller = new UserDB({
            username: guestUsername,
            email: `${guestUsername}@gmail.com`,
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

    add_production_user_service: async (req) => {
        const { username, email } = req.body;
        if (!username || !email) {
            throw new Error('Missing username or email');
        }

        // Check if a user already exists with the provided email
        const existingUser = await UserDB.findOne({ email: email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const newProductionUser = new UserDB({
            username: username,
            email: email,
            roles: "production",
            production_email_status: true
        });

        await newProductionUser.save();

        return newProductionUser;
    },

    verify_production_user_service: async (req) => {
        const { email } = req.body;
        const findEmail = await UserDB.findOne({ email: email });

        if (!findEmail) {
            throw new Error('invalid  production email')
        }

        // Check if the user exists and their role
        if (findEmail) {
            if (findEmail.roles === "production") {
                return true; // Return user data if role is production
            } else {
                throw new Error('User is not a production user'); // Throw error if role is not production
            }
        }
    },

    update_production_user_service: async (req) => {
        const { id } = req.params;
        const { user_name, production_email_status } = req.body;

        if (!id) {
            throw new Error('Missing user_id');
        }

        // Create an update object based on the provided fields
        const updateFields = {};
        if (user_name) {
            updateFields.username = user_name; // Update username if provided
        }
        if (production_email_status !== undefined) {
            updateFields.production_email_status = production_email_status; // Update status if provided
        }

        // If no fields are provided to update, throw an error
        if (Object.keys(updateFields).length === 0) {
            throw new Error('No fields to update');
        }

        const user = await UserDB.findByIdAndUpdate({ _id: id }, updateFields, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    add_family_member_service: async (req) => {
        const parent = req.user;
        const { email } = req.body;

        if (!email) {
            throw new Error('Missing email');
        }

        const user = await UserDB.findOne({ email });
        if (user) {
            throw new Error('Email already exist');
        }

        const username = generateUsername();

        const newFamilyMember = new UserDB({
            username: username,
            email: email,
            roles: 'member'
        });

        await newFamilyMember.save();

        parent.members.push(newFamilyMember._id);
        await parent.save();

        return newFamilyMember;
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
    },

    customer_capture_service: async (req) => {

        const {
            staffName,
            clientName,
            clientCompanyInfo,
            itemCodes,
            nfcData,
            notes,
            frontCardImage,
            backCardImage
        } = req.body;
       console.log(req.body);
        // if (!staffName || !clientName || !clientCompanyInfo || !itemCodes || !frontCardImage || !backCardImage) {
        //     throw new Error('Missing required fields');
        // }

        // Extract text from the front and back card images
        const frontCardImageUrl = await uploadImage(frontCardImage);
        const backCardImageUrl = await uploadImage(backCardImage);

        // Check if upload failed for front/back card images
        if (!frontCardImageUrl || !backCardImageUrl) {
            throw new Error('Front or back card image upload failed');
        }

        // 2. Generate profile ID and URL
        const profileId = nanoid(8);
        const profileUrl = `https://limilighting.co.uk/customer/${profileId}`;

        // Prepare images object
        const images = {
            frontCardImage: {
                url: frontCardImageUrl.url,
                id: frontCardImageUrl.id
            },
            backCardImage: {
                url: backCardImageUrl.url,
                id: backCardImageUrl.id
            }
        };

        // Save in MongoDB
        const newEntry = await Customer_DB.create({
            staffName,
            clientName,
            clientCompanyInfo,
            itemCodes,
            nfcData,
            notes,
            images,
            profileId,
            profileUrl,
        });

        await newEntry.save();
        return profileUrl;

    },

    get_customer_details_service: async (req) => {
        const { profileId } = req.params;
        const customer = await Customer_DB.findOne({ profileId });
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    },

    get_customer_all_details_service : async(req) => {
        const customer = await Customer_DB.find({});
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer; 
    }
};