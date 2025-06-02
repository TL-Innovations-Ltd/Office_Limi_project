/**
 * @swagger
 * tags:
 *   name: Admin Devices
 *   description: Admin endpoints for device management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HubDeviceInfo:
 *       type: object
 *       required:
 *         - deviceInfo
 *       properties:
 *         deviceInfo:
 *           type: string
 *           description: |
 *             Raw device information string containing:
 *             - Device name
 *             - Device ID (MAC address)
 *             - Received bytes array
 *           example: "name: \"Hub-Controller-01\", id: \"A1B2C3D4E5F6\", receivedBytes: [1,2,3,4,5]"
 * 
 *     HubDeviceResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "60d0fe4f5311236168a109ca"
 *             userId:
 *               type: string
 *               example: "60d0fe4f5311236168a109cb"
 *             macAddress:
 *               type: string
 *               example: "A1B2C3D4E5F6"
 *             deviceName:
 *               type: string
 *               example: "Hub-Controller-01"
 *             thingsboard:
 *               type: object
 *               properties:
 *                 deviceId:
 *                   type: string
 *                   example: "6f8d7a6c-5b4c-3d2e-1f0a-9e8d7c6b5a4f"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2025-06-02T10:00:00.000Z"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: "2025-06-02T10:00:00.000Z"
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error_message:
 *           type: string
 *           example: "Device information is required"
 */

/**
 * @swagger
 * /add_master_controller_hub_device:
 *   post:
 *     summary: Register a new hub controller device
 *     description: |
 *       Registers a new hub controller device in the system and creates a corresponding
 *       device in the ThingsBoard IoT platform. This endpoint requires admin authentication.
 *       
 *       The device information should be provided in a specific string format that includes
 *       the device name, ID (MAC address), and received bytes.
 *     tags: [Admin Devices]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HubDeviceInfo'
 *     responses:
 *       200:
 *         description: Hub device registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/HubDeviceResponse'
 *       400:
 *         description: Bad Request - Invalid or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       403:
 *         description: Forbidden - User does not have admin privileges
 *       409:
 *         description: Conflict - Device already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Hub already registered"
 *                     cached:
 *                       type: string
 *                       example: "true"
 *       500:
 *         description: Internal Server Error - Error processing the request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
