const mongoose  = require('mongoose');

const device_Schema = new  mongoose.Schema({
     device_id : {
         type  : String,
         require : true,
         unique : true,
     },
     device_type : {
         type  : String,
         require : true,  
         default : "light"
     },
     connection_type : {
         type  : String,
         enum : ['wifi', 'bluetooth'],
         default : 'wifi',  
     },
     status : {
        type : String,
        enum : ['on', 'off'],
        default : 'off',
     },
     brightness : {
         type : Number,
         default : 100,
         min : 0,
         max : 100,
     },
     color : {
         type : String,
         default : '#ffffff',
     },
     blinking : {
         type  : Boolean,
         default : false,
     }
},{timestamps : true});

module.exports = mongoose.model('Device', device_Schema);