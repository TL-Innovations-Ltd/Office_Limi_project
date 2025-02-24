const mongoose  = require('mongoose');

const Use_Schema = new  mongoose.Schema({
     username : {
         type  : String,
         require : true,
     },

     email :  {
         type  : String,
         require : true,
         unique : true,
     },
     roles : {
       type : String,
       enum : ['admin', 'user'],
       default : 'user',
     }
},{timestamps : true});

module.exports = mongoose.model('User', Use_Schema);