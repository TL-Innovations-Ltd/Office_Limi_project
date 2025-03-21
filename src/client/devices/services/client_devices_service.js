const PWM_DB = require('../../../admin/devices/models/pwm_controller_device');
const RGB_DB = require('../../../admin/devices/models/rgb_controller_device');
const Mini_Controller_DB = require('../../../admin/devices/models/mini_controller_device');
// const Master_Controller_DB = require('../../../admin/devices/models/master-controller_device');
const Hub_DB = require('../../../admin/devices/models/hub-controller_device');
const Channel_DB = require('../../../admin/devices/models/channel_controller_device');
const User_DB = require('../../user/models/user_models');

module.exports = {

    link_user_master_controller_service: async (req) => {
        // const users = req.user; // Get user ID from authenticated request
        // const { masterControllerId } = req.body;

        // if (!masterControllerId) {
        //     throw new Error('Missing Master Controller ID');
        // }

        // const masterController = await MasterController_DB.findById(masterControllerId);
        // if (!masterController) {
        //     throw new Error('Master Controller not found');
        // }

        // // Check if master controller is already linked to this user
        // if (users.masterControllers && users.masterControllers.includes(masterControllerId)) {
        //     throw new Error('Master Controller already linked to this user');
        // }

        // // Add master controller to user's list
        // users.masterControllers.push(masterControllerId);
        // await users.save();

        const { hubId , hubType ,  macAddress , firmwareVersion , hardwareVersion , deviceName , connectionStatus , status } = req.body;
        const users = req.user;

        if (!hubId) {
            throw new Error("Hub ID is required");
        }

        // Check if the hub exists
        const hub = await Hub_DB.findById(hubId);
        if (!hub) {
             // Create a new hub with the provided hubData
        hub = await Hub_DB.create({
            hubType: hubType,
            macAddress: macAddress,
            firmwareVersion: firmwareVersion,
            hardwareVersion: hardwareVersion,
            deviceName: deviceName
        });
        }

        if (users.hubs && users.hubs.includes(hubId)) {
            throw new Error("Hub is already linked to this user");
        }

        // Link the hub to the user
        await User_DB.findByIdAndUpdate(
            users._id,
            { $push: { hubs: hubId } },
            { new: true }
        );

        return users;
    },

    get_user_master_controllers_service: async (req) => {
        const userId = req.user._id; // Get user ID from authenticated request

        // const user = await User_DB.findById(userId).populate('masterControllers');
        const user = await User_DB.findById(userId).populate('hubs');
        if (!user) {
            throw new Error('User not found');
        }

        // return user.masterControllers;
        return user.hubs;
    },

    pwm_light_control_service: async (req) => {

        const { pwm_light_id, status, brightness, color } = req.body;

        if (!pwm_light_id) {
            throw new Error("Missing PWM Light ID");
        }

        // Check if user has access to this device
        //  We  can  add  extra  security by calling  a  device_validator folder function         

        // Find the PWM light
        const pwmLight = await PWM_DB.findById(pwm_light_id);

        // Update the light properties if provided
        if (status) {
            pwmLight.status = status;
        }

        if (brightness !== undefined) {
            pwmLight.brightness = brightness;
        }

        if (color) {
            pwmLight.color = color;
        }

        await pwmLight.save();

        return pwmLight;
    },

    rgb_light_control_service: async (req) => {
        const { rgb_light_id, status, color, length } = req.body;

        if (!rgb_light_id) {
            throw new Error("Missing RGB Light ID");
        }

        // Check if user has access to this device
        //  We  can  add  extra  security by calling  a  device_validator folder function      


        // Find the RGB light
        const rgbLight = await RGB_DB.findById(rgb_light_id);

        // Update the light properties if provided
        if (status) {
            rgbLight.status = status;
        }

        if (color) {
            rgbLight.color = color;
        }

        if (length) {
            rgbLight.length = length;
        }

        await rgbLight.save();

        return rgbLight;
    },

    // Control Mini Controller's PWM and RGB outputs
    mini_controller_output_control_service: async (req) => {
        // const { mini_controller_id, output_type, output_id, status, brightness, color, length } = req.body;
        
        const { mini_controller_id, deviceName} = req.body;

        if (!mini_controller_id) {
            throw new Error("Missing Mini Controller ID");
        }

        // if (!output_type || !['PWM', 'RGB'].includes(output_type)) {
        //     throw new Error("Invalid or missing output type. Must be 'PWM' or 'RGB'");
        // }

        // if (!output_id) {
        //     throw new Error("Missing output ID");
        // }

        // const users = req.user;
        // if (!users || !users.masterControllers || users.masterControllers.length === 0) {
        //     throw new Error("User has no linked master controllers");
        // }

        const users = req.user;
        // if (!users || !users.hubs || users.hubs.length === 0) {
        //     throw new Error("User has no linked hubs");
        // }

        // Find the Mini Controller
        const miniController = await Mini_Controller_DB.findById(mini_controller_id);
        if (!miniController) {
            throw new Error("Mini Controller not found");
        }

        // Find the channel to verify user access
        // const channel = await Channel_DB.findById(miniController.channelId);
        // if (!channel) {
        //     throw new Error("Channel not found");
        // }

        // Find the hub to get the master controller ID
        // const hub = await Hub_DB.findById(channel.hubId);
        // if (!hub) {
        //     throw new Error("Hub not found");
        // }

        // // Check if user has access to this device's master controller
        // if (!users.masterControllers.includes(hub.masterControllerId.toString())) {
        //     throw new Error("User does not have access to this device");
        // }

        // Check if user has access to this device's master controller
        // if (!users.hubs.includes(hub._id.toString())) {
        //     throw new Error("User does not have access to this device");
        // }

        // Control the appropriate output based on type
        // let updatedOutput;

        // if (output_type === 'PWM') {
        //     // Verify the output belongs to this mini controller
        //     if (!miniController.pwmOutputs.includes(output_id)) {
        //         throw new Error("This PWM output does not belong to the specified Mini Controller");
        //     }

        //     // Find and update the PWM light
        //     const pwmLight = await PWM_DB.findById(output_id);
        //     if (!pwmLight) {
        //         throw new Error("PWM output not found");
        //     }

        //     // Update properties if provided
        //     if (status !== undefined) {
        //         pwmLight.status = status;
        //     }

        //     if (brightness !== undefined) {
        //         pwmLight.brightness = brightness;
        //     }

        //     if (color !== undefined) {
        //         pwmLight.color = color;
        //     }

        //     await pwmLight.save();
        //     updatedOutput = pwmLight;
        // }
        // else if (output_type === 'RGB') {
        //     // Verify the output belongs to this mini controller
        //     if (!miniController.rgbOutputs.includes(output_id)) {
        //         throw new Error("This RGB output does not belong to the specified Mini Controller");
        //     }

        //     // Find and update the RGB light
        //     const rgbLight = await RGB_DB.findById(output_id);
        //     if (!rgbLight) {
        //         throw new Error("RGB output not found");
        //     }

        //     // Update properties if provided
        //     if (status !== undefined) {
        //         rgbLight.status = status;
        //     }

        //     if (color !== undefined) {
        //         rgbLight.color = color;
        //     }

        //     if (length !== undefined) {
        //         rgbLight.length = length;
        //     }

        //     await rgbLight.save();
        //     updatedOutput = rgbLight;
        // }

        return {
            miniControllerId: miniController._id,
            outputType: output_type,
            output: updatedOutput
        };
    },

    // Get all channels from user's master controllers
    get_user_channels_service: async (req) => {
        
        // if (!users || !users.masterControllers || users.masterControllers.length === 0) {
        //     throw new Error("User has no linked master controllers");
        // }

    

        // // Get all master controllers linked to the user
        // const masterControllers = await Master_Controller_DB.find({
        //     _id: { $in: users.masterControllers }
        // }).populate({
        //     path: 'hubs',
        //     populate: {
        //         path: 'channels'
        //     }
        // });



        // Extract all channels with their hierarchy information
        // const channels = [];

        // masterControllers.forEach(mc => {
        //     mc.hubs.forEach(hub => {
        //         hub.channels.forEach(channel => {
        //             channels.push({
        //                 _id: channel._id,
        //                 channelNumber: channel.channelNumber,
        //                 mode: channel.mode,
        //                 hubId: hub._id,
        //                 hubType: hub.hubType,
        //                 masterControllerId: mc._id,
        //                 masterControllerName: mc.name
        //             });
        //         });
        //     });
        // });

        // return channels;
        
        const users = req.user;

        if (!users || !users.hubs || users.hubs.length === 0) {
            throw new Error("User has no linked hubs");
        }
      
        // Get all hubs linked to the user
        const hubs = await Hub_DB.find({
            _id: { $in: users.hubs }
        }).populate({
            path: 'channels'
        });
    
        // Extract all channels with their hierarchy information
        const channels = [];

        hubs.forEach(hub => {
            hub.channels.forEach(channel => {
                channels.push({
                    _id: channel._id,
                    channelNumber: channel.channelNumber,
                    mode: channel.mode,
                    hubId: hub._id,
                    hubType: hub.hubType
                });
            });
        });

        return channels;
    },

    // Get devices of a specific mode from a channel
    get_user_channels_mode_lights_service: async (req) => {
        const users = req.user;
        const { channelId, mode } = req.body;

        if (!channelId) {
            throw new Error("Missing Channel ID");
        }

        if (!mode || !['PWM', 'RGB', 'MiniController'].includes(mode)) {
            throw new Error("Invalid or missing mode. Must be 'PWM', 'RGB', or 'MiniController'");
        }

        // Find the channel
        const channel = await Channel_DB.findById(channelId);
        if (!channel) {
            throw new Error("Channel not found");
        }
       
        // Get the hub to find the master controller
        const hub = await Hub_DB.findById(channel.hubId);
        if (!hub) {
            throw new Error("Hub not found");
        }

        // // Check if the user has access to this channel's master controller
        // if (!users.masterControllers || !users.masterControllers.includes(hub.masterControllerId.toString())) {
        //     throw new Error("User does not have access to this channel");
        // }

        // Check if the user has access to this channel's master controller
        if (!users.hubs || !users.hubs.includes(hub._id.toString())) {
            throw new Error("User does not have access to this channel");
        }

        // Get the devices based on the selected mode
        let devices = [];

        if (mode === 'PWM') {
            // Populate the PWM light
            await channel.populate({
                path: 'pwmLight',
                model: 'PWM'
            });
            if (!channel.pwmLight) {
                throw new Error("No PWM light found in this channel");
            }
            devices = [channel.pwmLight];
        }
        else if (mode === 'RGB') {
            // Populate the RGB light
            await channel.populate({
                path: 'rgbLight',
                model: 'RGB'
            });
            if (!channel.rgbLight) {
                throw new Error("No RGB light found in this channel");
            }
            devices = [channel.rgbLight];
        }
        else if (mode === 'MiniController') {
            // Populate the mini controller with its outputs
            await channel.populate({
                path: 'miniController',
                model: 'MiniController',
                populate: [
                    { path: 'pwmOutputs', model: 'PWM' },
                    { path: 'rgbOutputs', model: 'RGB' }
                ]
            });

            if (!channel.miniController) {
                throw new Error("No Mini Controller found in this channel");
            }

            devices = {
                miniController: channel.miniController,
            };
        }

        // Return devices with hierarchy information
        return {
            channelId: channel._id,
            channelNumber: channel.channelNumber,
            mode: mode,
            hubId: hub._id,
            hubType: hub.hubType,
            devices: devices
        };
    },

    get_all_devices_service: async (req) => {

        // const users = req.user;
        // if (!users || !users.masterControllers || users.masterControllers.length === 0) {
        //     return { pwmLights: [], rgbLights: [] };
        // }

        // // Get all master controllers linked to the user
        // const masterControllers = await Master_Controller_DB.find({
        //     _id: { $in: users.masterControllers }
        // }).populate({
        //     path: 'hubs',
        //     populate: {
        //         path: 'channels',
        //         populate: [
        //             { path: 'pwmLight' },
        //             { path: 'rgbLight' },
        //             {
        //                 path: 'miniController',
        //                 populate: [
        //                     { path: 'pwmOutputs' },
        //                     { path: 'rgbOutputs' }
        //                 ]
        //             }
        //         ]
        //     }
        // });

        // // Extract all PWM and RGB lights from the user's master controllers
        // const pwmLights = [];
        // const rgbLights = [];

        // masterControllers.forEach(mc => {
        //     mc.hubs.forEach(hub => {
        //         hub.channels.forEach(channel => {
        //             if (channel.pwmLight) {
        //                 pwmLights.push({
        //                     ...channel.pwmLight._doc,
        //                     hubId: hub._id,
        //                     hubType: hub.hubType,
        //                     channelNumber: channel.channelNumber,
        //                     masterControllerId: mc._id,
        //                     masterControllerName: mc.name
        //                 });
        //             }
        //             if (channel.rgbLight) {
        //                 rgbLights.push({
        //                     ...channel.rgbLight._doc,
        //                     hubId: hub._id,
        //                     hubType: hub.hubType,
        //                     channelNumber: channel.channelNumber,
        //                     masterControllerId: mc._id,
        //                     masterControllerName: mc.name
        //                 });
        //             }
        //             if (channel.miniController) {
        //                 // Add PWM outputs from mini controller
        //                 channel.miniController.pwmOutputs.forEach(pwm => {
        //                     pwmLights.push({
        //                         ...pwm._doc,
        //                         hubId: hub._id,
        //                         hubType: hub.hubType,
        //                         channelNumber: channel.channelNumber,
        //                         masterControllerId: mc._id,
        //                         masterControllerName: mc.name,
        //                         miniControllerId: channel.miniController._id,
        //                         miniControllerName: channel.miniController.name
        //                     });
        //                 });

        //                 // Add RGB outputs from mini controller
        //                 channel.miniController.rgbOutputs.forEach(rgb => {
        //                     rgbLights.push({
        //                         ...rgb._doc,
        //                         hubId: hub._id,
        //                         hubType: hub.hubType,
        //                         channelNumber: channel.channelNumber,
        //                         masterControllerId: mc._id,
        //                         masterControllerName: mc.name,
        //                         miniControllerId: channel.miniController._id,
        //                         miniControllerName: channel.miniController.name
        //                     });
        //                 });
        //             }
        //         });
        //     });
        // });

        // return {
        //     pwmLights,
        //     rgbLights
        // };
       
        const users = req.user;
        if (!users || !users.hubs || users.hubs.length === 0) {
            return { pwmLights: [], rgbLights: [] };
        }

        // Get all hubs linked to the user
        const hubs = await Hub_DB.find({
            _id: { $in: users.hubs || [] } // Ensure users.hubs is an array
        }).populate({
            path: 'channels',
            populate: [
                { path: 'pwmLight', model: 'PWM' },  // Ensure model name is correct
                { path: 'rgbLight', model: 'RGB' },
                {
                    path: 'miniController',
                    model: 'MiniController', // Ensure correct model name
                    populate: [
                        { path: 'pwmOutputs', model: 'PWM' }, 
                        { path: 'rgbOutputs', model: 'RGB' }
                    ]
                }   
            ]
        });

        // Extract all PWM and RGB lights from the user's hubs
        const pwmLights = [];
        const rgbLights = [];

        hubs.forEach(hub => {
            hub.channels.forEach(channel => {
                if (channel.pwmLight) {
                    pwmLights.push({
                        ...channel.pwmLight._doc,
                        hubId: hub._id,
                        hubType: hub.hubType,
                        channelNumber: channel.channelNumber
                    });
                }
                if (channel.rgbLight) {
                    rgbLights.push({
                        ...channel.rgbLight._doc,
                        hubId: hub._id,
                        hubType: hub.hubType,
                        channelNumber: channel.channelNumber
                    });
                }
                if (channel.miniController) {
                    // Add PWM outputs from mini controller
                    channel.miniController.pwmOutputs.forEach(pwm => {
                        pwmLights.push({
                            ...pwm._doc,
                            hubId: hub._id,
                            hubType: hub.hubType,
                            channelNumber: channel.channelNumber,
                            miniControllerId: channel.miniController._id,
                            miniControllerName: channel.miniController.name
                        });
                    });

                    // Add RGB outputs from mini controller
                    channel.miniController.rgbOutputs.forEach(rgb => {
                        rgbLights.push({
                            ...rgb._doc,
                            hubId: hub._id,
                            hubType: hub.hubType,
                            channelNumber: channel.channelNumber,
                            miniControllerId: channel.miniController._id,
                            miniControllerName: channel.miniController.name
                        });
                    });
                }
            });
        });

        return {
            pwmLights,
            rgbLights
        };

    },

}