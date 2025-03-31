const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/user/user");
const UserAuthMiddleware = require("../../middleware/user-auth");

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
router.post('/logout', UserAuthMiddleware, UserController.logout)

module.exports = router;