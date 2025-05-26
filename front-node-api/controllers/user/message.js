const mongoose = require('mongoose');

const MessageModel = require('../../models/messages');
const ConversationModel = require('../../models/conversations');
const { isValidObjectId } = require('../../helper');

exports.getMessages = async (req, res, next) => {

    const userId = req.userData.id;
    const { conversationId } = req.params;

    const { limit, cursor } = req.query;

    const ActualLimit = (isNaN(limit) || limit <= 0) ? 20 : parseInt(limit) > 75 ? Number(50) : parseInt(limit);
    const ActualCursor = !!cursor;

    if (!isValidObjectId(conversationId)) {
        return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    if (ActualCursor && !isValidObjectId(ActualCursor)) {
        return res.status(400).json({ message: 'Invalid cursor format.' });
    }

    try {
        const conversation = await ConversationModel.findById(conversationId, { participants: 1 }).lean();
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        const isParticipant = conversation.participants.some(pId => pId.toString() === userId);
        if (!isParticipant) return res.status(403).json({ message: 'User not authorized for this conversation' });

        const query = { conversationId };

        if (ActualCursor) query._id = { $lt: ActualCursor };

        const AllMessages = await MessageModel.find(query, {
                conversationId: 1, 
                content: 1, 
                createdAt: 1, 
                sender: 1, 
                readBy: 1 
            })
            .sort({ _id: -1 })
            .limit(ActualLimit)
            .populate("sender", "username profile_picture")
            .lean();

        if (!AllMessages || AllMessages.length === 0) {
            return res.status(200).json({
                AllMessages: [],
                nextCursor: null,
                hasMore: false,
                message: 'No messages found',
            });
        }

        const nextCursor = AllMessages.length > 0 && AllMessages.length === ActualLimit ? AllMessages[AllMessages.length - 1]._id.toString() : null;

        return res.status(200).json({
            AllMessages,
            nextCursor,
            hasMore: !!nextCursor,
            message: 'Ok',
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        next(error)
    }
};