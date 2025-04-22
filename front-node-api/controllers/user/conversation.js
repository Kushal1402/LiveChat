const niv = require("node-input-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const JWTR = require('jwt-redis').default;

const UserModel = require("../../models/user");
const ConversationModel = require("../../models/conversations");
const Helper = require("../../helper/index");

exports.getConversations = async (req, res, next) => {

    const UserId = req?.userData?.id;
    const userObjectId = new mongoose.Types.ObjectId(UserId);

    try {
        if (!mongoose.Types.ObjectId.isValid(UserId)) {
            return res.status(400).json({ message: "Requested User Id is invalid!" });
        };

        const ConversationsRes = await ConversationModel.aggregate([
            { $match: { participants: userObjectId }, },
            { $sort: { updatedAt: -1 } },
            {
                $addFields: {
                    sender_id: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$participants",
                                    as: "p",
                                    cond: { $ne: ["$$p", userObjectId] }
                                }
                            },
                            0
                        ]
                    },
                    receiver_id: userObjectId
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender_id",
                    foreignField: "_id",
                    pipeline: [
                        { $project: { _id: 1, username: 1, profile_picture: 1, status: 1, lastActive: 1 } }
                    ],
                    as: "sender"
                }
            },
            {
                $unwind: { path: "$sender", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessage",
                    foreignField: "_id",
                    pipeline: [
                        { $project: { content: 1, createdAt: 1, sender: 1 } }
                    ],
                    as: "messageData",
                },
            },
            {
                $unwind: { path: "$messageData", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "messages",
                    let: { convId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$conversationId", "$$convId"] },
                                        { $not: { $in: [userObjectId, "$readBy.user"] } },
                                        { $ne: ["$sender", userObjectId] }
                                    ]
                                }
                            }
                        },
                        {
                            $count: "unread_count"
                        }
                    ],
                    as: "unreadInfo"
                }
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    sender_id: 1,
                    receiver_id: 1,
                    lastMessage: "$messageData.content",
                    lastMessageTime: "$messageData.createdAt",
                    lastMessageSentBy: "$messageData.sender",
                    unread_count: { $ifNull: [{ $arrayElemAt: ["$unreadInfo.unread_count", 0] }, 0] },
                    sender_profile: "$sender.profile_picture",
                    sender_status: "$sender.status",
                    sender_username: "$sender.username",
                    sender_lastActive: "$sender.lastActive",
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        return res.status(200).json({
            message: "Conversations fetched successfully.",
            data: ConversationsRes,
        });
    } catch (error) {
        next(error);
    }
};