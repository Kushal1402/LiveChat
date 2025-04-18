const express = require("express");
const router = express.Router();
const ConversationController = require("../../controllers/user/conversation");
const UserAuthMiddleware = require("../../middleware/user-auth");

/** 
 * @swagger
 * /api/conversation/:
 *   get:
 *     summary: Get User Conversations
 *     description: This endpoint allows user to get their conversations.
 *     tags:
 *       - Conversations
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
 *                message:
 *                  type: string
 *                  example: "Conversations fetched successfully."
 *                data:
 *                 type: array
 */
router.get('/', UserAuthMiddleware, ConversationController.getConversations);

module.exports = router;