import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    bookmarks: {
        // type: [mongoose.Schema.Types.ObjectId], // Array of user IDs who bookmarked the tweet
        type: Array,
        default: [],
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;