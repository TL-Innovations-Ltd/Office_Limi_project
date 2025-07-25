const user_service = require('../services/user_services');
const { uploadProfilePicture, deleteFromCloudinary } = require('../../../config/cloudinary');
const { clearCache } = require('../../../utils/redisCache');

// Clear cache for user-related data
const clearUserCache = async (userId) => {
    await clearCache('*customer_details*');
    await clearCache('*user_tracking*');
    await clearCache('*get_user_capture*');
};

module.exports = {
    
    // Forgot password: Step 1 - Send OTP
    forgot_password_send_otp: async (req, res) => {
        try {
            const result = await user_service.forgot_password_send_otp_service(req);
            res.status(200).json({ success: true, message: result});
        } catch (e) {
            res.status(500).json({ success: false, error_message: JSON.stringify(e)});
        }
    },

    // Forgot password: Step 2 - Verify OTP
    forgot_password_verify_otp: async (req, res) => {
        try {
            const result = await user_service.forgot_password_verify_otp_service(req);
            res.status(200).json({ success: true, message: result });
        } catch (e) {
            res.status(400).json({ success: false, error_message: JSON.stringify(e) });
        }
    },

    // Forgot password: Step 3 - Reset password
    forgot_password_reset: async (req, res) => {
        try {
            const result = await user_service.forgot_password_reset_service(req);
            res.status(200).json({ success: true, message: result });
        } catch (e) {
            res.status(400).json({ success: false, error_message: JSON.stringify(e) });
        }
    },
     
    send_otp :  async(req, res) => {
          try{
              const user_otp = await user_service.send_otp_service(req);
              res.status(200).json({success  : true , otp : user_otp});
          }
          catch(e){
            //  console.log(e);
             res.status(500).json({success  : false , error_message : e.message});
          }
    },

    check_otp : async(req, res) => {
          try{
              const user_data = await user_service.check_otp_service(req);
            //   console.log(user_data);
              res.status(200).json({success  : true , message : 'User_created' , data : user_data});
          }
          catch(e){
            //  console.log(e);
             res.status(500).json({success  : false , error_message : e.message});
          }
    },

    installer_user : async(req, res) => {
          try{
              const installer_user = await user_service.installer_user_service();
              res.status(200).json({success  : true , message : 'Installer User created' , data : installer_user});
          }
          catch(e){
            //  console.log(e);
             res.status(500).json({ error_message : e.message});
          }
    },

    add_production_user : async(req , res) => {
         try {
            const production_user = await user_service.add_production_user_service(req);
            res.status(200).json({success  : true  , data : production_user});
         } catch (e) {
            //  console.log(e);
             res.status(500).json({success  : false , error_message : e.message});
         }   
    },

    verify_production_user : async(req , res) => {
        
        try{
            const production_user = await user_service.verify_production_user_service(req);
            res.status(200).json({success : production_user , message : 'production user verified'})
        }catch(e){
            // console.log(e);
            res.status(500).json({success  : false , error_message : e.message});
        }
    }, 

    update_production_user : async(req, res) => {
           try{
              const production_user = await user_service.update_production_user_service(req);
              res.status(200).json({success  : true  , data : production_user});    
           }
           catch(e){
            //  console.log(e);
             res.status(500).json({success  : false , error_message : e.message});
               }
    },

    add_family_member : async(req, res) => {
        try {
            const familyMember = await user_service.add_family_member_service(req);
            res.status(200).json({success  : true , message : 'Family member added' , data : familyMember});
        } catch (e) {
            // console.log(e);
            res.status(500).json({success  : false , error_message : e.message});
        }
    },

    update_profile: async (req, res) => {
        try {
            const userId = req.user._id; // Get user ID from the authenticated token
            const { username } = req.body;
            const file = req.file;

            let updateData = {};
            let oldPublicId = null;
            
            // Get the current user to check for existing profile picture
            const currentUser = await user_service.getUserById(userId);
            
            // If user has an existing profile picture, store the public_id for deletion
            if (currentUser.profilePicture?.public_id) {
                oldPublicId = currentUser.profilePicture.public_id;
            }
            
            // Handle profile picture upload if file exists
            if (file) {
                try {

                     // Delete old profile picture if it exists
                     if (oldPublicId) {
                        try {
                            await deleteFromCloudinary(oldPublicId);
                        } catch (deleteError) {
                            console.error('Error deleting old profile picture:', deleteError);
                            // Continue even if deletion fails
                        }
                    }

                    // Upload new profile picture
                    const result = await uploadProfilePicture(file.buffer);
                    updateData.profilePicture = {
                        url: result.secure_url,
                        public_id: result.public_id
                    };
                    
                } catch (uploadError) {
                    console.error('Error uploading to Cloudinary:', uploadError);
                    return res.status(500).json({
                        success: false,
                        error_message: 'Failed to upload profile picture'
                    });
                }
            }
            
            // Add username to update if provided
            if (username) {
                updateData.username = username;
            }
            
            // If there's nothing to update, return error
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    error_message: 'No data provided for update' 
                });
            }
            
            // Update the user
            const updatedUser = await user_service.updateUserService(userId, updateData);
            
            res.status(200).json({ 
                success: true, 
                message: updatedUser,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ 
                success: false, 
                error_message: error.message 
            });
        }
    },

    customer_capture : async(req ,res) => {
        try {    
            const staff_details = await user_service.customer_capture_service(req);
    
            res.status(200).json({success  : true  , data : staff_details});
        } catch (e) {
             res.status(500).json({success  : false , error_message : e.message});
        }   
    },

    delete_customer_capture : async(req, res) => {
        try {
            const result = await user_service.delete_customer_capture_service(req);
            res.status(200).json({success: true, message: 'Customer capture deleted successfully'});
        } catch (e) {
            res.status(500).json({success: false, error_message: e.message});
        }
    },

    get_customer_details : async(req, res) => {
         try{
            const customer_details = await user_service.get_customer_details_service(req);
            res.status(200).json({success  : true  , data : customer_details});
         }
         catch(e)   {
             res.status(500).json({success  : false , error_message : e.message});
         }
    },

    get_customer_all_details : async(req , res) => {
         try{
             const get_all_data = await user_service.get_customer_all_details_service(req);
             res.status(200).json({success  : true  , data : get_all_data});
         }
         catch(e){
             res.status(500).json({success : false , error_message : e.message})
         }
    },

    tracking_capture : async(req ,res) => {
         try{
            const tracking_data = await user_service.tracking_capture_service(req);
            // Clear relevant caches
            await clearUserCache();
            res.status(200).json({success : true , data  : tracking_data});
         }
         catch(e){
             res.status(500).json({success : false , error_message : e.message})
         }
    },

    get_tracking_capture : async(req , res) => {
         try{
            const tracking_data = await user_service.get_tracking_capture_service(req);
            res.status(200).json({success : true , data  : tracking_data});
         }
         catch(e){
             res.status(500).json({success : false , error_message : e.message})
         }
    },

    find_user_tracking : async(req ,res) => {
         try{
            const user_tracking = await user_service.find_user_tracking_service(req);
            res.status(200).json({success : true , data  : user_tracking});
         }
         catch(e){
             res.status(500).json({success : false , error_message : e.message});
         }
    },

    get_user_capture : async (req, res) => {
          try{
            const user_capture = await user_service.get_user_capture_service(req);
            res.status(200).json({success : true , data  : user_capture});
         }
         catch(e){
             res.status(500).json({success : false , error_message : e.message});
         }
    },

    send_user_controller: async (req, res) => {
        try {
            const userData = await user_service.send_user_data_service(req);
            // Extract only the required fields
            const responseData = {
                username: userData.username,
                profilePicture: userData.profilePicture || null
            };
            res.status(200).json({ 
                success: true, 
                data: responseData 
            });
        } catch (e) {
            res.status(500).json({ 
                success: false, 
                error_message: e.message 
            });
        }
    }
}