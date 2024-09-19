import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
    path: '../.env'
});

export const isAuthenticated = async (req, res, next) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies.token;

        // Check if the token exists
        if (!token) {
            return res.status(401).json({
                message: 'User is not authenticated. Please login.',
                success: false
            });
        }

        // Verify the token
        const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);

        // Attach user ID to the request object
        req.user = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Authentication error:', error);

        return res.status(403).json({
            message: 'Invalid or expired token. Please login again.',
            success: false
        });
    }
};
