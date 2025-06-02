/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: 'Enter JWT token in the format: Bearer <token>'
 *
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the user
 *         username:
 *           type: string
 *           description: Auto-generated username
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         ip:
 *           type: string
 *           description: IP address of the user
 *         region:
 *           type: string
 *           description: Geographic region of the user
 *         otp:
 *           type: string
 *           description: One-time password for verification
 *         otp_expire_at:
 *           type: string
 *           format: date-time
 *           description: Expiration time for OTP
 *         roles:
 *           type: string
 *           enum: [installer, user, member, production]
 *           default: user
 *         installer_expire_at:
 *           type: string
 *           format: date-time
 *           description: Expiration time for installer role
 *         production_email_status:
 *           type: boolean
 *           description: Status of production email verification
 *         members:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *             description: Array of family member user IDs
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     OTPRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "user@example.com"
 *
 *     OTPVerification:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "user@example.com"
 *         otp:
 *           type: string
 *           description: 6-digit OTP received via email
 *           example: "123456"
 *
 *     CustomerCapture:
 *       type: object
 *       properties:
 *         staffName:
 *           type: string
 *           description: Name of the staff member
 *         clientName:
 *           type: string
 *           description: Name of the client
 *         clientCompanyInfo:
 *           type: string
 *           description: Company information
 *         itemCodes:
 *           type: array
 *           items:
 *             type: object
 *             description: Array of item codes
 *         nfcData:
 *           type: string
 *           description: NFC data if available
 *         notes:
 *           type: string
 *           description: Additional notes
 *         images:
 *           type: object
 *           properties:
 *             frontCardImage:
 *               type: object
 *               properties:
 *                 url: { type: string }
 *                 id: { type: string }
 *             backCardImage:
 *               type: object
 *               properties:
 *                 url: { type: string }
 *                 id: { type: string }
 *         profileId:
 *           type: string
 *           description: Unique profile identifier
 *         profileUrl:
 *           type: string
 *           description: URL to the profile
 *
 *     UserTracking:
 *       type: object
 *       properties:
 *         sessionId:
 *           type: string
 *           required: true
 *           description: Unique session ID
 *         customerId:
 *           type: string
 *           description: ID of the customer
 *         ipAddress:
 *           type: string
 *           description: User's IP address
 *         country:
 *           type: string
 *           description: Country from IP
 *         city:
 *           type: string
 *           description: City from IP
 *         region:
 *           type: string
 *           description: Region/State
 *         org:
 *           type: string
 *           description: Organization/ISP
 *         postal:
 *           type: string
 *           description: Postal code
 *         timezone:
 *           type: string
 *           description: Timezone
 *         referrer:
 *           type: string
 *           description: HTTP referrer
 *         userAgent:
 *           type: string
 *           description: Browser user agent
 *         sessionDuration:
 *           type: number
 *           description: Session duration in seconds
 *         pagesVisited:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of visited pages
 *         consent:
 *           type: boolean
 *           default: false
 *           description: User consent status
 *         isUpdate:
 *           type: boolean
 *           default: false
 *         browser:
 *           type: string
 *           description: Browser name
 *         device:
 *           type: string
 *           description: Device type
 *         _method:
 *           type: string
 *           description: HTTP method override
 *
 * tags:
 *   - name: Authentication
 *     description: User authentication and verification
 *   - name: User Management
 *     description: User profile and family member management
 *   - name: Production Users
 *     description: Production user management
 *   - name: Customer Data
 *     description: Customer information capture and retrieval
 *   - name: Tracking
 *     description: User activity tracking
 */

// Authentication Routes
/**
 * @swagger
 * /send_otp:
 *   post:
 *     summary: Send OTP to user's email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 otp:
 *                   type: string
 *                   description: Success message with OTP expiry
 *                   example: "OTP Send Successfully & Expiry in 15 min"
 *       400:
 *         description: Invalid email format
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /verify_otp:
 *   post:
 *     summary: Verify OTP and login/register user
 *     description: |
 *       Verifies the OTP sent to user's email and logs them in.
 *       If successful, returns user data and JWT token.
 *       Also clears the used OTP and assigns a random username if new user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address that received the OTP
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP received via email
 *                 example: "123456"
 *                 minLength: 6
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User_created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT token for authentication (valid for 7 days)
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request - Missing required fields or invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   oneOf:
 *                     - example: "Missing email or otp"
 *                     - example: "Invalid OTP"
 *                     - example: "OTP expired"
 *       404:
 *         description: Not Found - User with the provided email does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /installer_user:
 *   post:
 *     summary: Create a new installer user account
 *     description: |
 *       Creates a temporary installer user account with a 24-hour expiry.
 *       Automatically generates a unique username and email for the installer.
 *       Returns the installer details along with an authentication token.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Installer user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   example: "Installer User created"
 *                   description: Success message
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticating the installer (valid for 1 hour)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   description: Error message describing what went wrong
 */

/**
 * @swagger
 * /verify_production:
 *   post:
 *     summary: Verify if a user is a production user
 *     description: |
 *       Verifies if the provided email belongs to a user with 'production' role.
 *       
 *       **Important:** The request body must be a plain text email (not JSON).
 *       
 *       **Request Format:**
 *       ```
 *       Content-Type: text/plain
 *       
 *       user@example.com
 *       ```
 *       
 *       **Error Cases:**
 *       - 400: If the email is invalid or user is not a production user
 *       - 500: For any server-side errors
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             format: email
 *             example: "user@example.com"
 *           examples:
 *             validEmail:
 *               summary: A valid email
 *               value: "user@example.com"
 *     responses:
 *       200:
 *         description: Successfully verified production user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Always true when verification is successful
 *                 message:
 *                   type: string
 *                   example: "production user verified"
 *       400:
 *         description: Bad Request - Invalid email format or user is not a production user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   oneOf:
 *                     - example: "Invalid production email"
 *                     - example: "User is not a production user"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   description: Error message describing what went wrong
 */

// User Management Routes
/**
 * @swagger
 * /update_name/{id}:
 *   patch:
 *     summary: Update user's username
 *     description: Updates the username for a specific user. This endpoint allows users to change their display name.
 *     tags: [User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *             properties:
 *               user_name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: New username (3-30 characters)
 *                 example: "john_doe_updated"
 *     responses:
 *       200:
 *         description: Username updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Username Updated"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - Missing user_id or user_name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Missing user_id or user_name"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /add_family_member:
 *   post:
 *     summary: Add a family member
 *     description: |
 *       Adds a new family member to the current user's family account.
 *       Requires authentication and the authenticated user must be a parent account.
 *     tags: [User Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the family member to add
 *                 example: "family.member@example.com"
 *     responses:
 *       200:
 *         description: Family member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Family member added successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - Missing email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Missing email"
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Only parent accounts can add family members
 *       409:
 *         description: Conflict - Email already exists in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Email already exists"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Internal server error"
 */

// Production User Routes
/**
 * @swagger
 * /add_production_user:
 *   post:
 *     summary: Add a new production user
 *     description: |
 *       Creates a new production user with the specified email and name.
 *       Production users have elevated permissions in the system.
 *     tags: [Production Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address for the production user
 *                 example: "production.user@example.com"
 *               name:
 *                 type: string
 *                 description: Full name of the production user
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: Production user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - Missing required fields or invalid email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Email and name are required"
 *       409:
 *         description: Conflict - Production user with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Production user with this email already exists"
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /verify_production:
 *   post:
 *     summary: Verify if a user is a production user
 *     description: |
 *       Verifies if the provided email belongs to a user with 'production' role.
 *       The request body should be a plain text email address (not JSON).
 *     tags: [Production Users]
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             format: email
 *             example: "user@example.com"
 *     responses:
 *       200:
 *         description: Successfully verified production user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User is a production user"
 *       400:
 *         description: Bad Request - Invalid production email or user is not a production user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   oneOf:
 *                     - example: "Invalid production email"
 *                     - example: "User is not a production user"
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /update_production_user/{id}:
 *   patch:
 *     summary: Update production user information
 *     description: |
 *       Updates an existing production user's information.
 *       Only the provided fields will be updated.
 *     tags: [Production Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the production user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Production user updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   description: URL to access the customer profile
 *                   example: "https://limilighting.com/customer/abc123xyz"
 *       400:
 *         description: Bad Request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Staff name and client name are required"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Failed to process customer data"
 */

/**
 * @swagger
 * /customer_capture/{profileId}:
 *   delete:
 *     summary: Delete customer capture
 *     description: |
 *       Permanently deletes a customer capture record and any associated images.
 *       This action cannot be undone.
 *     tags: [Customer Data]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the customer profile to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Customer capture deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Customer capture deleted successfully"
 *       400:
 *         description: Bad Request - Missing profile ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Profile ID is required"
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Customer not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Failed to delete customer data"
 */

/**
 * @swagger
 * /customer_capture:
 *   post:
 *     summary: Capture customer information
 *     description: |
 *       Captures detailed customer information including optional business card images.
 *       Images should be provided as base64 encoded strings.
 *       Returns a unique profile URL for the captured customer data.
 *     tags: [Customer Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - staffName
 *               - clientName
 *             properties:
 *               staffName:
 *                 type: string
 *                 description: Name of the staff member capturing the information
 *                 example: "John Smith"
 *               clientName:
 *                 type: string
 *                 description: Name of the client/customer
 *                 example: "Acme Corp"
 *               clientCompanyInfo:
 *                 type: object
 *                 description: Additional company information
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Acme Corporation"
 *                   position:
 *                     type: string
 *                     example: "Purchasing Manager"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "contact@acme.com"
 *               itemCodes:
 *                 type: array
 *                 description: Array of item codes related to the customer
 *                 items:
 *                   type: string
 *                 example: ["ITEM-001", "ITEM-002"]
 *               nfcData:
 *                 type: string
 *                 description: NFC data if captured
 *                 example: "NFC:1234567890"
 *               notes:
 *                 type: string
 *                 description: Additional notes about the customer
 *                 example: "Interested in LED lighting solutions"
 *               frontCardImage:
 *                 type: string
 *                 format: byte
 *                 description: Base64 encoded front side of business card image (optional)
 *               backCardImage:
 *                 type: string
 *                 format: byte
 *                 description: Base64 encoded back side of business card image (optional)
 *     responses:
 *       200:
 *         description: Customer information captured successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   description: URL to access the customer profile
 *                   example: "https://limilighting.com/customer/abc123xyz"
 *       400:
 *         description: Bad Request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Staff name and client name are required"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Failed to process customer data"
 */

/**
 * @swagger
 * /customer_capture/{profileId}:
 *   delete:
 *     summary: Delete customer capture
 *     description: |
 *       Permanently deletes a customer capture record and any associated images.
 *       This action cannot be undone.
 *     tags: [Customer Data]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the customer profile to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Customer capture deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Customer capture deleted successfully"
 *       400:
 *         description: Bad Request - Missing profile ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Profile ID is required"
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Customer not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Failed to delete customer data"
 */

/**
 * @swagger
 * /client/get_customer_details/{profileId}:
 *   get:
 *     summary: Get customer details by profile ID
 *     tags: [Customer Data]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the customer profile
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CustomerCapture'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /client/get_customer_details:
 *   get:
 *     summary: Get all customer details
 *     tags: [Customer Data]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all customer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CustomerCapture'
 *       500:
 *         description: Internal server error
 */

// Tracking Routes
/**
 * @swagger
 * /tracking_capture:
 *   post:
 *     summary: Create or update user tracking data
 *     description: |
 *       Captures or updates user tracking information based on session ID.
 *       If a session ID exists, it updates the existing record; otherwise, it creates a new one.
 *     tags: [Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: Unique session identifier
 *                 example: "session_1234567890"
 *               customerId:
 *                 type: string
 *                 description: ID of the customer (if known)
 *                 example: "60d0fe4f5311236168a109ca"
 *               pageViews:
 *                 type: array
 *                 description: Array of visited pages with timestamps
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *               deviceInfo:
 *                 type: object
 *                 description: Information about the user's device
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [mobile, tablet, desktop]
 *                   os:
 *                     type: string
 *                   browser:
 *                     type: string
 *               location:
 *                 type: object
 *                 description: Geographical location data
 *                 properties:
 *                   ip:
 *                     type: string
 *                   country:
 *                     type: string
 *                   region:
 *                     type: string
 *                   city:
 *                     type: string
 *     responses:
 *       200:
 *         description: Tracking data captured/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserTracking'
 *       400:
 *         description: Bad Request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Session ID is required"
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /get_tracking_capture:
 *   get:
 *     summary: Get all tracking data
 *     description: |
 *       Retrieves all tracking data records from the system.
 *       Responses are cached for 5 minutes.
 *     tags: [Tracking]
 *     responses:
 *       200:
 *         description: Tracking data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserTracking'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user_tracking/{customerId}:
 *   get:
 *     summary: Get tracking data by customer ID
 *     description: |
 *       Retrieves all tracking records associated with a specific customer.
 *       Responses are cached for 5 minutes.
 *     tags: [Tracking]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer's unique identifier
 *         example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: Tracking data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserTracking'
 *       400:
 *         description: Bad Request - Missing customer ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   example: "Missing customerId"
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /get_user_capture:
 *   get:
 *     summary: Get all user captures
 *     description: |
 *       Retrieves all user capture records from the system.
 *       Responses are cached for 5 minutes.
 *     tags: [User Data]
 *     responses:
 *       200:
 *         description: User captures retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /client/tracking_capture:
 *   post:
 *     summary: Capture user tracking data
 *     tags: [Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserTracking'
 *     responses:
 *       200:
 *         description: Tracking data captured successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserTracking'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /client/get_tracking_capture:
 *   get:
 *     summary: Get all tracking data
 *     tags: [Tracking]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tracking data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserTracking'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /client/find_user_tracking/{customerId}:
 *   get:
 *     summary: Get tracking data by customer ID
 *     tags: [Tracking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: Tracking data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserTracking'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /client/get_user_capture/{userId}:
 *   get:
 *     summary: Get user capture data by user ID
 *     tags: [User Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User capture data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */