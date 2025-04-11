const express = require('express');
const router = express.Router();
const user_controller = require('./controllers/user_controllers');
const authClientmiddleware = require('../middleware/user_middleware');
const userDocs = require('./docs');

router.get('/test', userDocs.test, (req, res) => {
    res.status(200).json({ message: 'Test', port: process.env.PORT })
});

router.post('/send_otp', userDocs.sendOtp, user_controller.send_otp);

router.post('/verify_production', userDocs.verifyProduction, user_controller.verify_production_user);

router.post('/verify_otp', userDocs.verifyOtp, user_controller.check_otp);

router.post('/installer_user', userDocs.installerUser, user_controller.installer_user);

router.patch('/update_name/:id', userDocs.updateName, user_controller.update_name);

router.post('/add_family_member', userDocs.addFamilyMember, authClientmiddleware, user_controller.add_family_member);

router.post('/add_production_user', userDocs.addProductionUser, user_controller.add_production_user);

router.patch('/update_production_user/:id', userDocs.updateProductionUser, user_controller.update_production_user);

router.post('/customer_capture', userDocs.customerCapture, user_controller.customer_capture);

router.get('/get_customer_details/:profileId', userDocs.getCustomerDetails, user_controller.get_customer_details);

router.get('/get_customer_details', userDocs.getAllCustomerDetails, user_controller.get_customer_all_details);

router.post('/tracking_capture', userDocs.trackingCapture, user_controller.tracking_capture);

router.get('/get_tracking_capture', userDocs.getTrackingCapture, user_controller.get_tracking_capture);

router.get('/user_tracking/:customerId', userDocs.getUserTracking, user_controller.find_user_tracking);

router.get('/get_user_capture', userDocs.getUserCapture, user_controller.get_user_capture);

module.exports = router;
