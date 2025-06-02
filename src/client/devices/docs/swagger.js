/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Device management and control endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DeviceData:
 *       type: object
 *       required:
 *         - deviceInfo
 *       properties:
 *         deviceInfo:
 *           type: string
 *           description: Raw device data string containing device information and state
 *           example: "name: \"Light Controller\", id: \"A1B2C3D4\", receivedBytes: [1,2,3,4,5]). Some other data. Hex Data: [1,255,128,64,0]"
 * 
 *     DeviceResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "Device data processed successfully"
 *             timestamp:
 *               type: integer
 *               format: int64
 *               example: 1622548800000
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error_message:
 *           type: string
 *           example: "Error processing device data"
 */

/**
 * @swagger
 * /process_device_data:
 *   post:
 *     summary: Process device data
 *     description: |
 *       Processes raw device data from connected lighting controllers.
 *       Supports both PWM and RGB lighting modes.
 *       Requires authentication.
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeviceData'
 *     responses:
 *       200:
 *         description: Device data processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       500:
 *         description: Server error while processing device data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /postmessage:
 *   post:
 *     summary: Send test message to MQTT broker
 *     description: |
 *       Sends a test message to the MQTT broker for device control.
 *       This is a test endpoint and should be used for development purposes only.
 *     tags: [Devices]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brightness:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 60
 *               color:
 *                 type: string
 *                 example: "red"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully"
 *       400:
 *         description: Error sending message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_message:
 *                   type: string
 *                   example: "Error details here"
 */
