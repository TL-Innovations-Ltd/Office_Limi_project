const user_service = require('../services/user_services');
module.exports = {
     
    send_otp :  async(req, res) => {
          try{
              const user_otp = await user_service.send_otp_service(req);
              res.status(200).json({success  : true , otp : user_otp});
          }
          catch(e){
             console.log(e);
             res.status(500).json({success  : false , error_message : e.message});
          }
    },

    check_otp : async(req, res) => {
          try{
              const user_data = await user_service.check_otp_service(req);
              console.log(user_data);
              res.status(200).json({success  : true , message : 'User_created' , data : user_data});
          }
          catch(e){
             console.log(e);
             res.status(500).json({success  : false , error_message : e.message});
          }
    },

    update_name : async(req , res) => {
         try{
            const update_user = await user_service.update_user_service(req);
            res.status(200).json({success  : true , message : "Username Updated" , data : update_user});
         }
         catch(e){
             console.log(e);
             res.status(500).json({success  : false , error_message : e.message});
         }
    }

}