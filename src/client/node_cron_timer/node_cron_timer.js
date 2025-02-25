const cron = require('node-cron');
const User_DB = require('../user/models/user_models'); 

// 🔥 Run every 5 minutes
cron.schedule('*/1 * * * *', async () => {
    console.log("Running device unlink cleanup for installers Roles...");

    const users = await User_DB.find({ roles: "installer" });

    for (let user of users) {
        const now = new Date();

        // 🔥 Sirf installer users ke purane devices remove karo
        user.devices = user.devices.filter(device => {
            const addedTime = new Date(device.addedAt); 
            return (now - addedTime) < (2 * 60 * 1000); // 15 minutes ke andar wale devices hi rakho
        });

        await user.save();
    }

    console.log("Cleanup completed.");
});
