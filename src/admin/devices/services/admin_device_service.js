const MasterController_DB = require('../models/master-controller_device');
const Hub_DB = require('../models/hub-controller_device');
const Channel_DB = require('../models/channel_controller_device');
const PWM_DB = require('../models/pwm_controller_device');
const RGB_DB = require('../models/rgb_controller_device');
const MiniController_DB = require('../models/mini_controller_device');

module.exports = {

    add_master_controller_device_service: async (req) => {
        const { name } = req.body;
        if (!name) {
            throw new Error('Missing Master Controller  Device Name');
        }
        const masterController = new MasterController_DB({ name });
        await masterController.save();
        return masterController;
    },

    add_master_controller_hub_device_service: async (req) => {
        // const { masterControllerId, hubType } = req.body;  // this  is  for  master controller  future use
        const { hubType , macAddress , firmwareVersion , hardwareVersion , deviceName } = req.body;

        // Validate hubType is one of the allowed values
        if (![1, 4, 8, 16].includes(hubType)) {
            throw new Error("hubType must be one of: 1, 4, 8, 16");
        }

        //Validate masterControllerId
        // if (!masterControllerId) {
        //     throw new Error("Missing Master Controller ID");
        // }

        // const masterExists = await MasterController_DB.findById(masterControllerId);
        // if (!masterExists) {
        //     throw new Error("Master Controller not found");
        // }

        // Create the hub
        const hub = new Hub_DB({
            // masterControllerId, 
            hubType,
            macAddress,
            firmwareVersion,
            hardwareVersion,
            deviceName,
            // channels: [] // Initialize empty channels array
        });
        await hub.save();

        return hub;

        // Create channels based on hubType
        // const channelPromises = [];
        // for (let i = 1; i <= hubType; i++) {
        //     const channel = new Channel_DB({
        //         hubId: hub._id,
        //         channelNumber: `channel${i}`,
        //     });

        //     // Save the channel
        //     await channel.save();

        //     // Add channel to hub's channels array
        //     hub.channels.push(channel._id);

        //     channelPromises.push(channel);
        // }

        // Save the updated hub with channel references
        // await hub.save();

        // // Update MasterController to include this Hub
        // await MasterController_DB.findByIdAndUpdate(masterControllerId, { $push: { hubs: hub._id } });

        // return {
        //     hub,
        //     channels: channelPromises
        // };
    },

    add_pwm_controller_device_service: async (req) => {
        const { channelId, deviceName } = req.body;
        if (!channelId) {
            throw new Error("Missing Channel ID");
        }

        if (!deviceName) {
            throw new Error("Missing PWM Light name");
        }

        // Find the channel
        const channel = await Channel_DB.findById(channelId);
        if (!channel) {
            throw new Error("Channel not found");
        }
   
        // Check if channel already has a PWM Light
        if (channel.pwmLight) {
            throw new Error("Channel already has a PWM Light registered");
        }

        // Create PWM Light
        const pwmLight = new PWM_DB({
            channelId: channel._id,
            deviceName,
        });

        await pwmLight.save();

        // Update channel with PWM Light reference
        channel.pwmLight = pwmLight._id;

        await channel.save();

        return {
            channel,
            pwmLight
        };
    },

    add_rgb_controller_device_service: async (req) => {

        const { channelId, deviceName } = req.body;

        if (!channelId) {
            throw new Error("Missing Channel ID");
        }

        if (!deviceName) {
            throw new Error("Missing RGB Light name");
        }

        // Find the channel
        const channel = await Channel_DB.findById(channelId);
        if (!channel) {
            throw new Error("Channel not found");
        }

        // Check if channel already has an RGB Light
        if (channel.rgbLight) {
            throw new Error("Channel already has an RGB Light registered");
        }

        // Create RGB Light
        const rgbLight = new RGB_DB({
            channelId: channel._id,
            deviceName,
        });

        await rgbLight.save();

        // Update channel with RGB Light reference
        channel.rgbLight = rgbLight._id;

        await channel.save();

        return {
            channel,
            rgbLight
        };

    },

    add_mini_controller_device_service: async (req) => {
        // const { channelId, deviceName } = req.body;
        const { deviceName } = req.body;

        // if (!channelId) {
        //     throw new Error("Missing Channel ID");
        // }

        if (!deviceName) {
            throw new Error("Missing Mini Controller name");
        }

        // Find the channel
        // const channel = await Channel_DB.findById(channelId);
        // if (!channel) {
        //     throw new Error("Channel not found");
        // }
     
        // Check if channel already has a Mini Controller
        // if (channel.miniController) {
        //     throw new Error("Channel already has a Mini Controller registered");
        // }

        // Create Mini Controller
        const miniController = new MiniController_DB({
            // channelId: channel._id,
            deviceName
        });

        await miniController.save();

        return miniController;

        // Update channel with Mini Controller reference
        // channel.miniController = miniController._id;

        // await channel.save();

        // return {
        //     channel,
        //     miniController
        // };
    },

    add_channel_mini_controller_pwm_device_service: async (req, res) => {
        const { miniControllerId } = req.body;

        if (!miniControllerId) {
            throw new Error("Missing Mini Controller ID");
        }

        // Find the mini controller
        const miniController = await MiniController_DB.findById(miniControllerId);
        if (!miniController) {
            throw new Error("Mini Controller not found");
        }

        // Check if mini controller already has 5 PWM outputs
        if (miniController.pwmOutputs.length >= 5) {
            throw new Error("Mini Controller already has maximum PWM outputs (5)");
        }

        // Check if mini controller already has 2 RGB outputs
        if (miniController.rgbOutputs.length >= 2) {
            throw new Error("Mini Controller already has maximum RGB outputs (2)");
        }

        const pwmLights = [];

        // Create PWM lights
        for (let i = 1; i <= 5; i++) {
            const pwmLight = new PWM_DB({
                channelId: miniController.channelId,
                deviceName: `Mini_PWM ${miniController.pwmOutputs.length + i}`,
            });

            await pwmLight.save();

            // Add PWM light to mini controller
            miniController.pwmOutputs.push(pwmLight._id);
            pwmLights.push(pwmLight);
        }

        const rgbLights = [];

        // Create RGB lights
        for (let i = 1; i <= 2; i++) {
            const rgbLight = new RGB_DB({
                channelId: miniController.channelId,
                deviceName: `Mini_RGB ${miniController.rgbOutputs.length + i}`,
            });

            await rgbLight.save();

            // Add RGB light to mini controller
            miniController.rgbOutputs.push(rgbLight._id);
            rgbLights.push(rgbLight);
        }

        await miniController.save();

        return {
            miniController,
            pwmLights,
            rgbLights
        };
    },

    // Set schedule for a PWM light
    set_pwm_light_schedule_service: async (req) => {
        const { pwm_light_id, enabled, turnOffTime, turnOnTime } = req.body;

        if (!pwm_light_id) {
            throw new Error("Missing PWM Light ID");
        }

        // Find the PWM light
        const pwmLight = await PWM_DB.findById(pwm_light_id);
        if (!pwmLight) {
            throw new Error("PWM Light not found");
        }

        // Update the schedule
        pwmLight.schedule = {
            enabled: true,
            turnOffTime: turnOffTime,
            turnOnTime: turnOnTime
        };

        await pwmLight.save();

        return pwmLight;
    },

    // Set schedule for an RGB light
    set_rgb_light_schedule_service: async (req) => {
        const { rgb_light_id, enabled, turnOffTime, turnOnTime } = req.body;

        if (!rgb_light_id) {
            throw new Error("Missing RGB Light ID");
        }

        // Find the RGB light
        const rgbLight = await RGB_DB.findById(rgb_light_id);
        if (!rgbLight) {
            throw new Error("RGB Light not found");
        }

        // Update the schedule
        rgbLight.schedule = {
            enabled: true,
            turnOffTime: turnOffTime,
            turnOnTime: turnOnTime
        };

        await rgbLight.save();

        return rgbLight;
    },

    // Get all scheduled lights
    get_scheduled_lights_service: async () => {
        // Get all PWM lights with enabled schedules
        const pwmLights = await PWM_DB.find({ 'schedule.enabled': true });

        // Get all RGB lights with enabled schedules
        const rgbLights = await RGB_DB.find({ 'schedule.enabled': true });

        return {
            pwmLights,
            rgbLights
        };
    },

    get_master_controller_device_service: async (req) => {
        const { hubId } = req.body;

        if (!hubId) {
            throw new Error("Missing Hub ID");
        }

        // Find Hub and populate all relationships
        const hub = await Hub_DB.findById(hubId)
            .populate({
                path: "channels",
                populate: [
                    {
                        path: "pwmLight",
                        model: "PWM", // Ensure correct model name
                    },
                    {
                        path: "rgbLight",
                        model: "RGB", // Ensure correct model name
                    },
                    {
                        path: "miniController",
                        model: "MiniController",
                        populate: [
                            {
                                path: "pwmOutputs",
                                model: "PWM", // MiniController ke andar PWM lights
                            },
                            {
                                path: "rgbOutputs",
                                model: "RGB", // MiniController ke andar RGB lights
                            },
                        ],
                    },
                ],
            });

        if (!hub) {
            throw new Error("Hub not found");
        }

        return hub;
    },


    get_master_controller_device_service: async (req) => {
        const { masterControllerId } = req.body;

        if (!masterControllerId) {
            throw new Error("Missing Master Controller ID");
        }

        // Find Master Controller and populate all relationships
        const masterController = await MasterController_DB.findById(masterControllerId)
            .populate({
                path: "hubs",
                populate: {
                    path: "channels",
                    populate: [
                        {
                            path: "pwmLight",
                            model: "PWM", // Ensure correct model name
                        },
                        {
                            path: "rgbLight",
                            model: "RGB", // Ensure correct model name
                        },
                        {
                            path: "miniController",
                            model: "MiniController",
                            populate: [
                                {
                                    path: "pwmOutputs",
                                    model: "PWM", // MiniController ke andar PWM lights
                                },
                                {
                                    path: "rgbOutputs",
                                    model: "RGB", // MiniController ke andar RGB lights
                                },
                            ],
                        },
                    ],
                },
            });

        if (!masterController) {
            throw new Error("Master Controller not found");
        }

        return masterController;
    }

};