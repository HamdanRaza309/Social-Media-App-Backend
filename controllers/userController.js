import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
    path: '../.env'
})

export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Basic validation
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required.',
                success: false
            });
        }

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({
                message: 'User already exists.',
                success: false
            });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 12);

        // Create a new user
        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        // Respond with success message
        return res.status(201).json({
            message: 'Account created successfully.',
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            message: 'Server error. Please try again later.',
            success: false
        });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'All fields are required.',
                success: false
            });
        }

        // Check if 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(409).json({
                message: 'PLease enter correct credentials.',
                success: false
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(409).json({
                message: 'Please enter correct credentials.',
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

        return res.status(201).cookie('token', token, { expiresIn: "1d", httpOnly: true }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        })

    } catch (error) {
        console.error('Error during Login:', error);
        return res.status(500).json({
            message: 'Server error. Please try again later.',
            success: false
        });
    }
};

export const Logout = (req, res) => {
    return res.cookie('token', '', { expiresIn: new Date(Date.now()) }).json({
        message: 'User logged out successfully.',
        success: true
    });
}

export const bookmarks = async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const tweetId = req.params.id;

        const user = await User.findById(loggedInUserId);
        if (user.bookmarks.includes(tweetId)) {
            // remove from bookmarks
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Removed from bookmarks.",
                success: true
            })
        } else {
            // add to bookmarks
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "bookmarked.",
                success: true
            })
        }
    } catch (error) {
        console.error('Error in bookmarks:', error);

        return res.status(500).json({
            message: 'An error occurred while processing the request.',
            success: false
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const id = req.params.id;

        // Find the user by ID
        const user = await User.findById(id).select("-password");

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        // Return user profile if found
        return res.status(200).json({
            user,
            success: true
        });

    } catch (error) {
        console.error('Error fetching profile:', error);

        return res.status(500).json({
            message: 'An error occurred while fetching the user profile.',
            success: false
        });
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.params.id;

        // Find all users except the logged-in user, and exclude password field
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        if (otherUsers.length === 0) {
            return res.status(404).json({
                message: 'No other users found.',
                success: false
            });
        }

        return res.status(200).json({
            otherUsers,
            success: true
        });

    } catch (error) {
        console.error('Error fetching other users:', error);

        return res.status(500).json({
            message: 'An error occurred while fetching users.',
            success: false
        });
    }
};

export const follow = async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const userId = req.params.id;

        // Find the logged-in user and the user to be followed
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);

        if (!user || !loggedInUser) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        // Check if the logged-in user is already following the other user
        if (!user.followers.includes(loggedInUserId)) {
            // Add the logged-in user to the user's followers and update following
            await user.updateOne({ $push: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $push: { following: userId } });

            return res.status(200).json({
                message: `You just followed ${user.name}`,
                success: true
            });
        } else {
            // If the user is already being followed, return an error message
            return res.status(400).json({
                message: `You are already following ${user.name}`,
                success: false
            });
        }

    } catch (error) {
        console.error('Error in follow function:', error);

        return res.status(500).json({
            message: 'An error occurred while trying to follow the user.',
            success: false
        });
    }
};

export const unfollow = async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const userId = req.params.id;

        // Find the logged-in user and the user to be unfollowed
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);

        // Check if both users exist
        if (!user || !loggedInUser) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        // Check if the logged-in user is following the other user
        if (loggedInUser.following.includes(userId)) {
            // Remove the logged-in user from the user's followers and update following
            await user.updateOne({ $pull: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $pull: { following: userId } });

            return res.status(200).json({
                message: `You have unfollowed ${user.name}.`,
                success: true
            });
        } else {
            // If the user is not being followed, return an error message
            return res.status(400).json({
                message: `You are not following ${user.name}.`,
                success: false
            });
        }

    } catch (error) {
        console.error('Error in unfollow function:', error);

        return res.status(500).json({
            message: 'An error occurred while trying to unfollow the user.',
            success: false
        });
    }
};
