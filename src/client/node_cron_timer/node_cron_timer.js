const cron = require('node-cron');
const User_DB = require('../user/models/user_models'); 

// 🔥 Run every 24 hours (Midnight)
cron.schedule('0 0 * * *', async () => {
    console.log("Running cleanup for installer roles...");

    const now = new Date();

    // 🔥 Purane installer accounts delete karna jo expire ho chuke hain
    await User_DB.deleteMany({
        roles: "installer",
        installer_expire_at: { $lt: now } // Jo expire ho chuka hai usko delete karo
    });

    console.log("Expired installer accounts deleted.");
});
