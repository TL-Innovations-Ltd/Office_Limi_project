/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *     Model3D:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the model
 *         userId:
 *           type: string
 *           description: ID of the user who uploaded the model
 *         model3D:
 *           type: object
 *           properties:
 *             publicId:
 *               type: string
 *               description: Cloudinary public ID for the model
 *             url:
 *               type: string
 *               description: URL to access the 3D model
 *         metadata:
 *           type: object
 *           description: Additional metadata for the 3D model
 *           additionalProperties: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: 3D Models
 *   description: API endpoints for managing 3D models
 */

/**
 * @swagger
 * /3d-models:
 *   post:
 *     summary: Upload a new 3D model
 *     tags: [3D Models]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 3D model file (max 10MB for free accounts)
 *               metadata:
 *                 type: object
 *                 description: Additional metadata for the 3D model
 *                 example: { "version": "1.0", "units": "meters", "scale": 1.0 }
 *     responses:
 *       200:
 *         description: 3D model uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Model3D'
 *       400:
 *         description: No file uploaded or invalid file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Server error during file upload
 */

/**
 * @swagger
 * /3d-models:
 *   get:
 *     summary: Get all 3D models for the authenticated user
 *     tags: [3D Models]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's 3D models
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Model3D'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 */

/**
 * @swagger
 * /3d-models/{id}:
 *   delete:
 *     summary: Delete a 3D model
 *     tags: [3D Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the 3D model to delete
 *     responses:
 *       200:
 *         description: 3D model deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - User doesn't have permission to delete this model
 *       404:
 *         description: 3D model not found
 */
