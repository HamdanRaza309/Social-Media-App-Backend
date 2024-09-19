import express from "express";
import { bookmarks, follow, getOtherUsers, getProfile, Login, Logout, Register, unfollow } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authenticateUser.js";

const router = express.Router();

router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/logout').get(Logout);
router.route('/bookmarks/:id').put(isAuthenticated, bookmarks);
router.route('/profile/:id').get(isAuthenticated, getProfile);
router.route('/otherusers').get(isAuthenticated, getOtherUsers);
router.route('/follow/:id').post(isAuthenticated, follow);
router.route('/unfollow/:id').post(isAuthenticated, unfollow);

export default router;