const express = require('express');
const router = express.Router();
const user_controller = require('./controllers/user_controllers');
const model3d_controller = require('./controllers/model3d_controller');
const authClientmiddleware = require('../middleware/user_middleware');
const { cache } = require('../../utils/redisCache');
const { upload, uploadToCloudinary, profilePictureUpload, uploadProfilePicture } = require('../../config/cloudinary');

// Cache duration in seconds
const FIVE_MINUTES = 5 * 60; // 5 minutes cache

// Public routes
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test', port: process.env.PORT })
});

// Authentication routes (no caching for security)
router.post('/send_otp', user_controller.send_otp);
router.post('/verify_otp', user_controller.check_otp);
router.post('/verify_production', user_controller.verify_production_user);
router.post('/installer_user', user_controller.installer_user);
router.get('/send_user_data' , authClientmiddleware ,  user_controller.send_user_controller)

// User management routes
router.patch('/update_profile', 
    authClientmiddleware, 
    profilePictureUpload.single('profilePicture'), 
    user_controller.update_profile
);

router.post('/add_family_member', authClientmiddleware, user_controller.add_family_member);
router.post('/add_production_user', user_controller.add_production_user);
router.patch('/update_production_user/:id', user_controller.update_production_user);

// Customer capture routes
router.post('/customer_capture', user_controller.customer_capture);
router.delete('/customer_capture/:profileId', user_controller.delete_customer_capture);

// Cached routes (read-heavy endpoints)
router.get('/get_customer_details/:profileId', cache(FIVE_MINUTES), user_controller.get_customer_details);
router.get('/get_customer_details', cache(FIVE_MINUTES), user_controller.get_customer_all_details);

// Tracking routes
router.post('/tracking_capture', user_controller.tracking_capture);
router.get('/get_tracking_capture', cache(FIVE_MINUTES), user_controller.get_tracking_capture);
router.get('/user_tracking/:customerId', cache(FIVE_MINUTES), user_controller.find_user_tracking);
router.get('/get_user_capture', cache(FIVE_MINUTES), user_controller.get_user_capture);

// 3D Model routes
router.post(
  '/3d-models',
  authClientmiddleware,
  upload.single('file'),
  model3d_controller.uploadModel
);  // checked

router.get(
  '/3d-models',
  authClientmiddleware,
  model3d_controller.getUserModels
);

// Add a new route for downloading 3D models
router.get(
  '/3d-models/download/:id',
  model3d_controller.downloadModel
);

router.delete(
  '/3d-models/:id',
  model3d_controller.deleteModel
);

module.exports = router;
