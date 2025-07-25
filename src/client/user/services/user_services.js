const transporter = require('../../../utils/gmail_transport');
const UserDB = require('../models/user_models');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const geoip = require("geoip-lite");
const { nanoid } = require('nanoid');
const Customer_DB = require('../models/customer_capture_model');
const UserTracking = require('../models/user_tracking_capture');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { clearCache } = require('../../../utils/redisCache');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "drwoekliw",
    api_key: process.env.CLOUDINARY_API_KEY || "253749524177665",
    api_secret: process.env.CLOUDINARY_API_SECRET || "ua-T1KruwcdPtoJoUPX8hztSJkU",
});

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
    // if (!imageBase64.startsWith('data:')) {
    //     throw new Error('Invalid base64 image format');
    // }

    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: 'limi-business-cards',
    });
    return {
        url: uploadResponse.secure_url,
        id: uploadResponse.public_id,
    };
};

const getUserById = async (userId) => {
    try {
        return await UserDB.findById(userId).select('-password -otp -otp_expire_at');
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

module.exports = {
    
    // Forgot password: Step 1 - Send OTP
    forgot_password_send_otp_service: async (req) => {

        const { email } = req.body;
        if (!email || !isValidEmail(email)) {
            throw new Error('Valid email is required');
        }

        const user = await UserDB.findOne({ email });
        if (!user) {
            throw new Error('User with this email does not exist');
        }
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otp_expire_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Save OTP and expiry
        user.otp = otp;
        user.otp_expire_at = otp_expire_at;
        await user.save();
        // Send OTP email
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 32px 24px; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); background: #fff;">
            <div style="text-align: center; margin-bottom: 24px;">
                <img src='https://limilighting.com/assets/logo.png' alt='Limi Lighting' style='height: 48px; margin-bottom: 12px;'>
                <h2 style="color: #1a237e; margin: 0 0 8px 0;">Limi Lighting</h2>
            </div>
            <h3 style="color: #333; text-align:center; margin: 0 0 16px 0;">Password Reset OTP</h3>
            <p style="font-size: 16px; color: #444; text-align:center; margin-bottom: 20px;">We received a request to reset your password. Use the OTP below to proceed:</p>
            <div style="text-align: center; margin: 32px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1976d2; background: #f5faff; padding: 16px 32px; border-radius: 8px; border: 1px solid #1976d2;">${otp}</span>
            </div>
            <p style="text-align: center; color: #666; font-size: 14px; margin-bottom: 8px;">This OTP is valid for 10 minutes.</p>
            <p style="text-align: center; color: #999; font-size: 13px;">If you did not request a password reset, please ignore this email.<br>For security, do not share this OTP with anyone.</p>
            <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;">
            <div style="text-align: center;">
                <a href="https://limilighting.com" style="color: #1976d2; text-decoration: none; font-size: 14px;">Visit Limi Lighting</a>
            </div>
        </div>`;
        await transporter.sendMail({
            from: '"Limi Lighting" <' + process.env.GMAIL_SECRET_EMAIL + '>',
            to: user.email,
            subject: 'Password Reset OTP',
            html : html
        });
        return `OTP sent to ${user.email}`;
    },  

    // Forgot password: Step 2 - Verify OTP
    forgot_password_verify_otp_service: async (req) => {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new Error('Email and OTP are required');
        }
        const user = await UserDB.findOne({ email });
        if (!user || !user.otp || !user.otp_expire_at) {
            throw new Error('OTP not requested or expired');
        }
        if (user.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        if (user.otp_expire_at < new Date()) {
            throw new Error('OTP expired');
        }
    
        return `OTP verified for ${user.email}`;
    },
    // Forgot password: Step 3 - Reset password
    forgot_password_reset_service: async (req) => {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            throw new Error('Email and new password are required');
        }
        const user = await UserDB.findOne({ email });
        if (!user) {
            throw new Error('User with this email does not exist');
        }
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otp_expire_at = undefined;
        await user.save();
        return `Password reset successful for ${user.email}`;
    },

    send_otp_service: async (req) => {
        const { email, isWebsiteSignup = false, username, password } = req.body;

        if (!isValidEmail(email) || !email) {
            throw new Error("Invalid email format");
        }

        const { ip, region } = await getIPAndRegion(req);
        const findEmail = await UserDB.findOne({ email: email });

        // If it's a website signup
        if (isWebsiteSignup) {
            if (findEmail) {
                throw new Error("User already exists");
            }
            if (!username || !password) {
                throw new Error("Name and password are required for website signup");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await UserDB.create({
                email,
                username: username,
                password: hashedPassword,
                ip,
                region,
            });
            return "User created successfully"
        }

        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // <-- 15 min expiry
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        if (!findEmail) {
            await UserDB.create({ email: email, ip: ip, region: region, otp: otp, otp_expire_at: otpExpiresAt });
        } else {
            await UserDB.updateOne({ email: email }, { otp: otp, otp_expire_at: otpExpiresAt });
        }

        // **Generate Deep Link for Swift App**
        const mailOptions = {
            from: '"Limi Lighting" <' + process.env.GMAIL_SECRET_EMAIL + '>',
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

        await transporter.sendMail(mailOptions);
        return 'OTP Send  Succesfully & Expiry in 15 mint';
    },

    check_otp_service: async (req) => {
        const { email, otp, password, isWebsiteLogin = false } = req.body;

        if (!email) {
            throw new Error('Email is required');
        }

        const user = await UserDB.findOne({ email });
        if (!user) {
            throw new Error('Incorrect Email Please Try Again');
        }

        // Website login flow
        if (isWebsiteLogin) {
            if (!password) {
                throw new Error('Password is required for website login');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Incorrect Password Please Try Again');
            }
        }
        // App OTP flow
        else {
            if (!otp) {
                throw new Error('OTP is required for app login');
            }
            if (user.otp !== otp) {
                throw new Error("Invalid OTP");
            }
            if (new Date() > user.otp_expire_at) {
                throw new Error("OTP expired");
            }

            // Common updates for both flows
            const updateData = {
                otp: null,
                otp_expire_at: null
            };

            // Only set username if it doesn't exist
            if (!user.username || user.username.startsWith('user_')) {
                updateData.username = generateUsername();
            }

            // Update user
            await UserDB.findOneAndUpdate(
                { email },
                updateData,
                { new: true }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        return { token };
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

    updateUserService: async (userId, updateData) => {
        try {
            // Find the user first to handle profile picture cleanup if needed
            const user = await UserDB.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // If there's a new profile picture and an old one exists, delete the old one from Cloudinary
            if (updateData.profilePicture && user.profilePicture?.public_id) {
                try {
                    await cloudinary.uploader.destroy(user.profilePicture.public_id);
                } catch (error) {
                    console.error('Error deleting old profile picture:', error);
                    // Continue even if deletion fails
                }
            }

            // Update the user with new data
            await UserDB.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            clearCache( 'profile' , userId);

            return 'Profile updated successfully';
        } catch (error) {
            console.error('Error in updateUserService:', error);
            throw error;
        }
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

        // Validate required fields
        if (!staffName || !clientName) {
            throw new Error('Staff name and client name are required');
        }

        let images = {};

        // Only attempt image upload if images are provided
        if (frontCardImage) {
            const frontCardImageUrl = await uploadImage(frontCardImage);
            if (frontCardImageUrl) {
                images.frontCardImage = {
                    url: frontCardImageUrl.url,
                    id: frontCardImageUrl.id
                };
            }
        }

        if (backCardImage) {
            const backCardImageUrl = await uploadImage(backCardImage);
            if (backCardImageUrl) {
                images.backCardImage = {
                    url: backCardImageUrl.url,
                    id: backCardImageUrl.id
                };
            }
        }

        // Generate profile ID and URL
        const profileId = nanoid(8);
        const profileUrl = `https://limilighting.com/customer/${profileId}`;

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

    delete_customer_capture_service: async (req) => {
        const { profileId } = req.params;

        if (!profileId) {
            throw new Error('Profile ID is required');
        }

        // Use findOneAndDelete directly which returns the deleted document
        const customer = await Customer_DB.findOneAndDelete({ _id: profileId });

        if (!customer) {
            throw new Error('Customer not found');
        }

        // If there are images associated with the customer, delete them from Cloudinary
        if (customer.images) {
            if (customer.images.frontCardImage && customer.images.frontCardImage.id) {
                await cloudinary.uploader.destroy(customer.images.frontCardImage.id);
            }

            if (customer.images.backCardImage && customer.images.backCardImage.id) {
                await cloudinary.uploader.destroy(customer.images.backCardImage.id);
            }
        }

        return true;
    },

    get_customer_details_service: async (req) => {
        const { profileId } = req.params;
        const customer = await Customer_DB.findOne({ profileId });
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    },

    get_customer_all_details_service: async (req) => {
        const customer = await Customer_DB.find({});
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    },

    tracking_capture_service: async (req) => {
        if (!req.body) {
            throw new Error('No data provided');
        }

        // Ensure sessionId is present in the request body
        if (!req.body.sessionId) {
            throw new Error('Session ID is required');
        }
        // Find the existing tracking record
        const existingTrackingData = await UserTracking.findOne({ sessionId: req.body.sessionId });
        if (!existingTrackingData) {
            const userTrackingData = new UserTracking(req.body);
            await userTrackingData.save();
            return userTrackingData;
        }

        // Update the existing record
        Object.keys(req.body).forEach(key => {
            if (key !== 'sessionId') {
                existingTrackingData[key] = req.body[key];
            }
        });

        await existingTrackingData.save();
        return existingTrackingData;
    },

    get_tracking_capture_service: async (req) => {
        const trackingData = await UserTracking.find({});
        return trackingData;
    },

    find_user_tracking_service: async (req) => {
        const { customerId } = req.params;
        if (!customerId) {
            throw new Error("Missing customerId");
        }
        const userTrackingData = await UserTracking.find({ customerId });
        return userTrackingData;
    },

    get_user_capture_service: async (req) => {
        const userCaptureData = await UserDB.find({});
        return userCaptureData;
    },

    send_user_data_service: async (req) => {
        return req.user;
    },

    uploadToCloudinary: async (filePath) => {
        try {
            // Upload the file to Cloudinary
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'profile_pictures',
                resource_type: 'auto',
                quality: 'auto:good',
                fetch_format: 'auto'
            });

            // Delete the temporary file
            fs.unlinkSync(filePath);

            return result;
        } catch (error) {
            // Make sure to clean up the temp file if upload fails
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        }
    },

    updateUserProfilePicture: async (userId, pictureData) => {
        try {
            // First get the user to check if they have an existing profile picture
            const user = await UserDB.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // If there's an existing profile picture, delete it from Cloudinary
            if (user.profilePicture && user.profilePicture.public_id) {
                try {
                    await cloudinary.uploader.destroy(user.profilePicture.public_id);
                } catch (error) {
                    console.error('Error deleting old profile picture:', error);
                    // Continue even if deletion fails
                }
            }

            // Update the user's profile picture
            user.profilePicture = {
                url: pictureData.url,
                public_id: pictureData.public_id
            };

            await user.save();

            // Return the updated user without sensitive data
            user.password = undefined;
            user.otp = undefined;
            user.otp_expire_at = undefined;

            return 'Profile picture updated successfully';
        } catch (error) {
            console.error('Error updating profile picture:', error);
            throw error;
        }
    },

    getUserById: async (userId) => {
        try {
            return await UserDB.findById(userId).select('-password -otp -otp_expire_at');
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    }
};
