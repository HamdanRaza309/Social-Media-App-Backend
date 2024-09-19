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
        const loggedInUserId = req.user;  // from authenticateUser middleware
        const tweetId = req.params.id;

        const user = await User.findById(loggedInUserId);
        if (user.bookmarks.includes(tweetId)) {
            // remove from bookmarks
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Removed from bookmarks."
            })
        } else {
            // add to bookmarks
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "bookmarked."
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
        const user = await User.findById(id);

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
