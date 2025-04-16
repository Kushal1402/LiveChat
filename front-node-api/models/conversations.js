const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const ConversationSchema = new Schema(
    {
        participants: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            required: true,
        },
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
        type: {
            type: String,
            enum: ["one-on-one", "group"],
            default: "one-on-one",
        },
    },
    {
        timestamps: true,
    }
);

ConversationSchema.plugin(aggregatePaginate);
ConversationSchema.plugin(mongoosePaginate);

ConversationSchema.index({ participants: 1 });
// ConversationSchema.index({ 'participants.0': 1, 'participants.1': 1 }); // Creates a compound index for two participants for scalability

// Can add
// group-name, group-image, group-admins, group-members

module.exports = mongoose.model("Conversation", ConversationSchema);