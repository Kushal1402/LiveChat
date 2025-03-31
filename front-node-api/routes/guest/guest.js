const express = require("express");
const router = express.Router();
const GuestController = require("../../controllers/guest/guest");

/** 
 * @swagger
 * /api/guest/register:
 *   post:
 *     summary: Register User
 *     description: This endpoint allows user register.
 *     tags:
 *       - Guest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "User name"
 *                 example: "JohnDoe"
 *               email:
 *                 type: string
 *                 description: The email address to send the email to.
 *                 example: "user@gmail.com"
 *               password:
 *                 type: string
 *                 description: "Password"
 *                 example: "John@123"
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
 *                   example : Your profile has been registered successfully
 *                 token:
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OGUzNjJmNjExMzliZjNjYmE1NmYzMSIsInJvbGUiOiI2Njk2MGNmMGRlMTNmOTFhM2NhMmJlN2MiLCJ2ZXJzaW9uIjoxMCwiaWF0IjoxNzQyMjkzMDc0LCJleHAiOjE3NDMxNTcwNzR9.MbzTFmepgsaC5yL2LxCcYTq4e8IMiTXL3hyuX-XsnfY
 *                 result:
 *                    type: object
 */
router.post("/register", GuestController.register);

/** 
 * @swagger
 * /api/guest/login:
 *   post:
 *     summary: User login
 *     description: Endpoint for user to login and receive a token.
 *     tags:
 *       - Guest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email field for login
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 description: Password field for login
 *                 example: "securePassword123"
 *     responses:
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred. Please try again"
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : User logged in successfully
 *                 token:
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OGUzNjJmNjExMzliZjNjYmE1NmYzMSIsInJvbGUiOiI2Njk2MGNmMGRlMTNmOTFhM2NhMmJlN2MiLCJ2ZXJzaW9uIjoxMCwiaWF0IjoxNzQyMjkzMDc0LCJleHAiOjE3NDMxNTcwNzR9.MbzTFmepgsaC5yL2LxCcYTq4e8IMiTXL3hyuX-XsnfY
 *                 result:
 *                    type: object
 *       307:
 *         description: Temporary Redirect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example : 2FA authentication is on!
 */
router.post("/login", GuestController.login);

/** 
 * @swagger
 * /api/guest/send_mail:
 *   post:
 *     summary: Send email
 *     description: This endpoint allows user to send an email to a specified email (Verification, 2FA & Change-pass).
 *     tags:
 *       - Guest
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
 *                 description: The type of mail request.
 *                 example: 1
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
router.post("/send_mail", GuestController.send_mail);

/** 
 * @swagger
 * /api/guest/verify_otp:
 *   post:
 *     summary: Verify Otp
 *     description: This endpoint will verify the otp send to user email.
 *     tags:
 *       - Guest
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
 *               request_type:
 *                 type: integer
 *                 description: The type of mail request.
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
 *                   example : Verification code has been successfully verified
 */
router.post("/verify_otp", GuestController.verify_otp);

module.exports = router;