const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const MessageSchema = new Schema(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // receiver: {
        //     type: Schema.Types.ObjectId,
        //     ref: "User",
        //     required: function () {
        //         return this.conversationType === "one-on-one";
        //     }
        // },
        content: {
            type: String,
            required: true,
        },
        readBy: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" },
                readAt: { type: Date, default: Date.now },
            },
        ],
        // status: {
        //     type: String,
        //     enum: ["sent", "delivered", "read"],
        //     default: "sent",
        // },
        // deliveredTo: [
        //     {
        //         user: { type: Schema.Types.ObjectId, ref: "User" },
        //         deliveredAt: { type: Date, default: Date.now },
        //     },
        // ],
    },
    {
        timestamps: true,
    }
);

MessageSchema.plugin(aggregatePaginate);
MessageSchema.plugin(mongoosePaginate);

MessageSchema.index({ conversationId: 1, createdAt: -1, _id: -1 });

module.exports = mongoose.model("Message", MessageSchema);