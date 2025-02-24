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
              res.status(200).json({success  : true , message : 'User_creatde' , data : user_data});
          }
          catch(e){
             console.log(e);
             res.status(500).json({success  : false , error_message : e.message});
          }
    }

}