const mongoose  = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // UUID library for unique ID

const device_Schema = new  mongoose.Schema({
     device_id : {
         type  : String,
         require : true,
         unique : true,
         default : uuidv4,  // Generate unique ID on creation
     },
     device_name : {
         type : String,
         require : true,
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