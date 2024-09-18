import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    like: {
        // type: [mongoose.Schema.Types.ObjectId], // Array of user IDs who liked the tweet
        type: Array,
        default: [],
    },
    bookmarks: {
        // type: [mongoose.Schema.Types.ObjectId], // Array of user IDs who bookmarked the tweet
        type: Array,
        default: [],
    }
}, { timestamps: true });

const Tweet = mongoose.model('Tweet', tweetSchema);
export default Tweet;