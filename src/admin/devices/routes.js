const express = require('express');
const router = express.Router();
const admin_device_controller = require('./controller/admin-device_controller');
const authClientmiddleware = require('../../client/middleware/user_middleware');

router.post('/add_master_controller_hub_device', authClientmiddleware, admin_device_controller.add_master_controller_hub_device);

module.exports = router;
