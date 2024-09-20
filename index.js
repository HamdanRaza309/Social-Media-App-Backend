import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './config/db.js';
import cookieParser from 'cookie-parser';
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";
dotenv.config({
    path: '.env'
})
const app = express();
const PORT = process.env.PORT;

connectToDatabase();

// middlewares
const corsOPtions = {
    origin: `http://localhost:3000`,
    credentials: true
}
app.use(cors(corsOPtions));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cookieParser());

// APIs
app.use('/api/v1/user', userRoute);
app.use('/api/v1/tweet', tweetRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});