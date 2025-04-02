const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/user/user");
const UserAuthMiddleware = require("../../middleware/user-auth");
const { upload } = require('../../helper/media_handler');

/** 
 * @swagger
 * /api/user/details:
 *   get:
 *     summary: Get User Profile Details
 *     description: This endpoint allows to user to get profile data
 *     tags:
 *       - User
 *     security:
 *       - BearerAdminAuth: []  # Requires authorization
 *     responses:
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred. Please try again."
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : ok
 *                 user:
 *                   type: object
 */
router.get('/details', UserAuthMiddleware, UserController.getUserDetails);

/** 
 * @swagger
 * /api/user/update-profile:
 *   put:
 *     summary: Update Profile
 *     description: This endpoint allows to update user data
 *     tags:
 *       - User
 *     security:
 *       - BearerAdminAuth: []  # Requires authorization
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "User name"
 *                 example: "JohnDoe"
 *               about:
 *                 type: string
 *                 description: "User status"
 *                 example: "I'm Available"
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *                 description: "User profile picture"
 *     responses:
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred. Please try again."
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : User profile updated successfully
 */
router.put('/update-profile', upload.single('profile_picture'), UserAuthMiddleware, UserController.updateProfile);

/** 
 * @swagger
 * /api/user/update-authentication:
 *   put:
 *     summary: Update user 2fa status
 *     description: This endpoint allows user to update their 2fa status.
 *     tags:
 *       - User
 *     security:
 *       - BearerAdminAuth: []  # Requires authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               two_factor_authentication:
 *                 type: boolean
 *                 description: The new status for the user (e.g., true or false).
 *     responses:
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred. Please try again."
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : Two factor authentication has been successfully changed
 */
router.put('update-authentication', UserAuthMiddleware, UserController.updateAuthentication);

/** 
 * @swagger
 * /api/user/update-password:
 *   put:
 *     summary: Update user password
 *     description: This endpoint allows user to update current password.
 *     tags:
 *       - User
 *     security:
 *       - BearerAdminAuth: []  # Requires authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               new_password:
 *                 type: string
 *                 description: User new password
 *                 example: "123456@ABC"
 *               old_password:
 *                 type: string
 *                 description: User current password
 *                 example: "ABC@123456"
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : Password has been updated successfully
 *                 token:
 *                   type: string
 *       409:
 *         description: Conflict.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : Invalid current password OR Password already in use
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred. Please try again."
 */
router.put('/update-password', UserAuthMiddleware, UserController.updatePassword);

/** 
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: User Logout
 *     description: This endpoint allows to logout the user
 *     tags:
 *       - User
 *     security:
 *       - BearerAdminAuth: []  # Requires authorization
 *     responses:
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred. Please try again."
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : User logged out successfully
 */
router.post('/logout', UserAuthMiddleware, UserController.logout);

/** 
 * @swagger
 * /api/user/send_mail:
 *   post:
 *     summary: Send email
 *     description: This endpoint allows user to send an email to a specified email (Change email, Reset password).
 *     tags:
 *       - User
 *     security:
 *       - BearerAdminAuth: []  # Requires authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address to send the email to.
 *                 example: "user@gmail.com"
 *               request_type:
 *                 type: integer
 *                 description: The type of mail request. 4 = change-email, 5 = reset-password
 *                 example: 4
 *               resend:
 *                 type: integer
 *                 description: Use 1 to send a new email, or 2 to resend the previous email.
 *                 example: 1
 *     responses:
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while sending the email. Please try again."
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : Verification code has been sent to your email address
 *                 token:
 *                    type: string
 *                    example: 9iwowGGsRqqMeUmQYx1pmEg5g3Y58cPqMAKVREnOr3HfhimlQEUrOlbr
 */
router.post("/send_mail", UserAuthMiddleware, UserController.send_mail);

/** 
 * @swagger
 * /api/user/verify_otp:
 *   post:
 *     summary: Verify Otp
 *     description: This endpoint will verify the otp send to user email.
 *     tags:
 *       - User
 *     security:
 *       - BearerAdminAuth: []  # Requires authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token to verify same user
 *               otp:
 *                 type: integer
 *                 description: otp shared on mail.
 *                 example: 123456
 *               email:
 *                 type: string
 *                 description: The email address to send the email to.
 *                 example: "user@gmail.com"
 *     responses:
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while sending the email. Please try again."
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : Verification code has been successfully verified
 */
router.post("/verify_otp", UserAuthMiddleware, UserController.verify_otp);

/** 
 * @swagger
 * /api/user/forget-password-reset:
 *   post:
 *     summary: Reset user password
 *     description: This endpoint allows user to reset password.
 *     tags:
 *       - User
 *     security:
 *       - BearerAdminAuth: []  # Requires authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               new_password:
 *                 type: string
 *                 description: User new password
 *                 example: "123456@ABC"
 *               email:
 *                 type: string
 *                 description: User account associated email
 *                 example: "user@gmail.com"
 *               token:
 *                 type: string
 *                 description: Token to verify same user
 *               otp:
 *                 type: integer
 *                 description: otp shared on mail.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : Password has been reset successfully
 *                 token:
 *                   type: string
 *       409:
 *         description: Conflict.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : Invalid verification code or issue occure while updating password
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred. Please try again."
 */
router.post('/forget-password-reset', UserAuthMiddleware, UserController.resetPassword);

/** 
 * @swagger
 * /api/user/update-email:
 *   post:
 *     summary: Change user email
 *     description: This endpoint allows user to change email.
 *     tags:
 *       - User
 *     security:
 *       - BearerAdminAuth: []  # Requires authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User account associated email
 *                 example: "user@gmail.com"
 *               token:
 *                 type: string
 *                 description: Token to verify same user
 *               otp:
 *                 type: integer
 *                 description: otp shared on mail.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : Email has been reset successfully
 *                 result:
 *                   type: object
 *       402:
 *         description: Conflict.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : Invalid verification code or issue occure while updating password
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred. Please try again."
 */
router.post('/update-email', UserAuthMiddleware, UserController.updateEmail);

module.exports = router;