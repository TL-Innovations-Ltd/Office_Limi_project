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
     ip : {
        type  : String
     },
     region : {
         type  : String
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
         enum : ['installer', 'user' , 'member' , 'production'],
         default : 'user',
     },
     production_email_status : {  // 🔥 Production role ka expiry
        type: Boolean
     },
     members : [{
           type : mongoose.Schema.Types.ObjectId,
           ref : 'User'
     }],
},{timestamps : true});

module.exports = mongoose.model('User', Use_Schema);


  //   hubs : [{
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : 'Hub'
    //  }]
    //  masterControllers : [{
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : 'MasterController'
    //  }]