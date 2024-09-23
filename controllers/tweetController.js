import Tweet from "../models/Tweet.js";
import User from "../models/User.js";

// Create a tweet
export const createTweet = async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const { description } = req.body;

        if (!description || !loggedInUserId) {
            return res.status(400).json({
                message: 'Please write something.',
                success: false
            });
        }

        const user = await User.findById(loggedInUserId).select("-password");

        // Create a new tweet
        const tweet = await Tweet.create({
            description,
            userId: loggedInUserId,
            userDetails: user
        });

        return res.status(201).json({
            message: 'Tweet created successfully.',
            success: true,
            tweet
        });

    } catch (error) {
        console.error('Error creating tweet:', error);
        return res.status(500).json({
            message: 'Server error while creating the tweet.',
            success: false
        });
    }
};

// Delete a tweet
export const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedInUserId = req.user;

        const tweet = await Tweet.findById(id);

        // Check if tweet exists and the user is authorized to delete it
        if (!tweet || tweet.userId.toString() !== loggedInUserId) {
            return res.status(404).json({
                message: 'Tweet not found or unauthorized action.',
                success: false
            });
        }

        await tweet.deleteOne();

        return res.status(200).json({
            message: 'Tweet deleted successfully.',
            success: true
        });

    } catch (error) {
        console.error('Error deleting tweet:', error);
        return res.status(500).json({
            message: 'Server error while deleting the tweet.',
            success: false
        });
    }
};

// Like or dislike a tweet
export const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const tweetId = req.params.id;

        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            return res.status(404).json({
                message: 'Tweet not found.',
                success: false
            });
        }

        // Check if the user has already liked the tweet
        if (tweet.like.includes(loggedInUserId)) {
            // Dislike the tweet
            await tweet.updateOne({ $pull: { like: loggedInUserId } });
            return res.status(200).json({
                message: 'Tweet disliked.',
                success: true
            });
        } else {
            // Like the tweet
            await tweet.updateOne({ $push: { like: loggedInUserId } });
            return res.status(200).json({
                message: 'Tweet liked.',
                success: true
            });
        }
    } catch (error) {
        console.error('Error liking/disliking tweet:', error);
        return res.status(500).json({
            message: 'Server error while processing the request.',
            success: false
        });
    }
};

// Get all tweets (of logged-in user)
export const getTweets = async (req, res) => {
    try {
        const loggedInUserId = req.user;

        // Fetch logged-in user
        const loggedInUser = await User.findById(loggedInUserId);

        if (!loggedInUser) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        // Fetch logged-in user's tweets
        const loggedInUserTweets = await Tweet.find({ userId: loggedInUserId });

        return res.status(200).json({
            tweets: loggedInUserTweets,
            success: true
        });
    } catch (error) {
        console.error('Error fetching all tweets:', error);
        return res.status(500).json({
            message: 'Server error while fetching tweets.',
            success: false
        });
    }
};

// Get all tweets (of logged-in user + following users)
export const getAllTweets = async (req, res) => {
    try {
        const loggedInUserId = req.params.id;

        // Fetch logged-in user
        const loggedInUser = await User.findById(loggedInUserId);

        if (!loggedInUser) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        // Fetch logged-in user's tweets
        const loggedInUserTweets = await Tweet.find({ userId: loggedInUserId });

        // Fetch tweets of users the logged-in user follows
        const followingUsersTweets = await Tweet.find({
            userId: { $in: loggedInUser.following }
        });

        return res.status(200).json({
            tweets: loggedInUserTweets.concat(followingUsersTweets),
            success: true
        });
    } catch (error) {
        console.error('Error fetching all tweets:', error);
        return res.status(500).json({
            message: 'Server error while fetching tweets.',
            success: false
        });
    }
};

// Get tweets from users the logged-in user is following
export const getFollowingTweets = async (req, res) => {
    try {
        const loggedInUserId = req.user;

        // Fetch logged-in user
        const loggedInUser = await User.findById(loggedInUserId);

        if (!loggedInUser) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        // Fetch tweets of users the logged-in user follows
        const followingUsersTweets = await Tweet.find({
            userId: { $in: loggedInUser.following }
        });

        return res.status(200).json({
            tweets: followingUsersTweets,
            success: true
        });
    } catch (error) {
        console.error('Error fetching following tweets:', error);
        return res.status(500).json({
            message: 'Server error while fetching tweets.',
            success: false
        });
    }
};
