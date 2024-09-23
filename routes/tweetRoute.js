import express from "express";
import { createTweet, deleteTweet, getAllTweets, getFollowingTweets, getTweets, likeOrDislike } from "../controllers/tweetController.js";
import { isAuthenticated } from "../middlewares/authenticateUser.js";

const router = express.Router();

router.route('/create').post(isAuthenticated, createTweet);
router.route('/delete/:id').delete(isAuthenticated, deleteTweet);
router.route('/like/:id').put(isAuthenticated, likeOrDislike);
router.route('/tweets').get(isAuthenticated, getTweets);
router.route('/alltweets/:id').get(isAuthenticated, getAllTweets);
router.route('/followingtweets').get(isAuthenticated, getFollowingTweets);

export default router;