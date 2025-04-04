// const MasterController_DB = require('../models/master-controller_device');
const Hub_DB = require('../models/hub-controller_device');

module.exports = {

    // add_master_controller_device_service: async (req) => {
    //     const { name } = req.body;
    //     if (!name) {
    //         throw new Error('Missing Master Controller  Device Name');
    //     }
    //     const masterController = new MasterController_DB({ name });
    //     await masterController.save();
    //     return masterController;
    // },

    add_master_controller_hub_device_service: async (req) => {
        const  userId = req.user._id;
        const { deviceInfo } = req.body;
        // console.log("bluetooth ");
        // console.log(req.body);
         // Extracting details from deviceInfo string
         const match = deviceInfo.match(/name: "(.*?)", id: "(.*?)", receivedBytes: \[(.*?)\]/);
         if (!match){
             throw new  Error('Fomrat invalid')
         }

         const name = match[1];
        const id = match[2];
        const receivedBytes = match[3].split(',').map(Number); // Convert to array of numbers

        if(receivedBytes.includes(90)){
            throw new  Error("developer mode ignore")
        }

        let existingDevice = await Hub_DB.findOne({ macAddress: id });
        if (existingDevice) {
            return { message: "Hub already registered" };
        }

        // Create the hub
        const hub = new Hub_DB({
            // masterControllerId,
            userId : userId, 
            macAddress : id,
            deviceName : name,
        });
        await hub.save();

        return hub;

    },

};