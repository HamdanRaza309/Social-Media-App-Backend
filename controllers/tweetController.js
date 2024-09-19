import Tweet from "../models/Tweet.js";

export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;

        if (!description || !id) {
            return res.status(400).json({
                message: 'All fields are required.',
                success: false
            });
        }

        // Create a new tweet
        const tweet = await Tweet.create({
            description,
            userId: id
        });

        // Respond with success
        return res.status(201).json({
            message: 'Tweet created successfully.',
            success: true,
            tweet
        });

    } catch (error) {
        console.error('Error creating tweet:', error);

        return res.status(500).json({
            message: 'An error occurred while creating the tweet. Please try again later.',
            success: false
        });
    }
};

export const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the tweet by ID and delete it
        const tweet = await Tweet.findByIdAndDelete(id);

        // If no tweet is found, return a 404 error
        if (!tweet) {
            return res.status(404).json({
                message: 'Tweet not found.',
                success: false
            });
        }

        // Return success response if tweet is deleted
        return res.status(200).json({
            message: 'Tweet deleted successfully.',
            success: true
        });

    } catch (error) {
        console.error('Error deleting tweet:', error);

        // Return error response
        return res.status(500).json({
            message: 'An error occurred while deleting the tweet.',
            success: false
        });
    }
};

