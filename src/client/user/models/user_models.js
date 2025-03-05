const mongoose  = require('mongoose');

const Use_Schema = new  mongoose.Schema({
     username : {
         type  : String,
         require : true,
     },

     email :  {
         type  : String,
         unique : true,
         require : true,
     },
     
     otp : {
         type : String
     },

     otp_expire_at : {
       type  : Date
     },

     installer_expire_at: {  // 🔥 Installer role ka expiry
        type: Date,
        default: null
    },

     roles :  {
         type : String,
         enum : ['installer', 'user'],
         default : 'user',
     },
    devices: [
        {
          device_id: { type: String, ref: "BluetoothDevice" }, // 🔥 Updated field
          addedAt: { type: Date, default: Date.now },
        },
      ],
},{timestamps : true});

Use_Schema.virtual('device_details', {
    ref: 'BluetoothDevice',
    localField: 'devices.device_id',  // 🔥 Correct field path
    foreignField: 'device_id', // 🔥 Device model ka field
    justOne: false, 
});

// 🔥 Virtuals enable karo takay JSON aur Objects me aayein
Use_Schema.set('toObject', { virtuals: true });
Use_Schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', Use_Schema);

 //  devices: [
    //     { 
    //         device_id: { type: String, ref: "Device" }, 
    //         addedAt: { type: Date, default: Date.now } // 🔥 Track device added time
    //     }
    //  ], // Devices array

// 🔥 Virtual Populate (device_id ko `Device` model se connect karne ke liye)
// Use_Schema.virtual('device_details', {
//     ref: 'Device',
//     localField: 'devices.device_id',  // 🔥 Correct field path
//     foreignField: 'device_id', // 🔥 Device model ka field
//     justOne: false, 
// });

// // 🔥 Virtuals enable karo takay JSON aur Objects me aayein
// Use_Schema.set('toObject', { virtuals: true });
// Use_Schema.set('toJSON', { virtuals: true });