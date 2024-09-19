import express from "express";
import { bookmarks, getProfile, Login, Logout, Register } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authenticateUser.js";

const router = express.Router();

router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/logout').get(Logout);
router.route('/bookmarks/:id').put(isAuthenticated, bookmarks);
router.route('/profile/:id').get(isAuthenticated, getProfile);

export default router;