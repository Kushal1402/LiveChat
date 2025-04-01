const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");
const cloudName = process.env.CLOUDINARY_CLOUD_NAME

// Global variable for Image
global.defaultUrl = `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`;
global.profileImageUrl = {
    $concat: [
        `https://res.cloudinary.com/${cloudName}/image/upload/v`,
        "$image_version",
        `/uploads/user/`,
        "$profile_picture",
    ],
};

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        about: {
            type: String,
            default: "Available"
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profile_picture: {
            type: String,
            default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
        },
        image_version: {
            type: String,
        },
        two_factor_authentication: {
            type: Boolean, // true - enabled, false - disabled
            default: false,
        },
    },
    {
        timestamps: true,
        virtuals: {
            profile_image_url: {
                get() {
                    if (this.profile_picture && this.image_version) {
                        return `https://res.cloudinary.com/${cloudName}/image/upload/v${this.image_version}/uploads/user/${this.profile_picture}`;
                    } else if (this.profile_picture) {
                        return this.profile_picture;
                    } else {
                        return defaultUrl;
                    }
                },
            },
        },
    }
);

UserSchema.plugin(aggregatePaginate);
UserSchema.plugin(mongoosePaginate);

UserSchema.index({ username: 1, email: 1 });

// Can add 
// contacts field → Stores user relationships (similar to a friend list, useful for suggestions) - Array of Users
// status & lastActive updates → Managed via Socket.io for real-time updates - Status boolean (online/offline) and lastActive timestamp

module.exports = mongoose.model("User", UserSchema);