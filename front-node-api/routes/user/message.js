const express = require("express");
const router = express.Router();
const MessageController = require("../../controllers/user/message");
const UserAuthMiddleware = require("../../middleware/user-auth");

/**
 * @swagger
 * /api/message/{conversationId}:
 *   get:
 *     summary: Get Messages by Conversation ID
 *     description: This endpoint allows user to get messages by conversation ID.
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the conversation to fetch messages for.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *          type: integer
 *         description: The maximum number of messages to return (default is 20).
 *       - in: query
 *         name: cursor
 *         required: false
 *         schema:
 *          type: string
 *         description: The cursor for pagination, used to fetch the next set of messages.
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
 *                  example: "Messages fetched successfully."
 */
router.get("/:conversationId", UserAuthMiddleware, MessageController.getMessages);

module.exports = router;