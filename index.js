import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './config/db.js';
import cookieParser from 'cookie-parser';
import userRoute from "./routes/userRoute.js";

dotenv.config({
    path: '.env'
})
const app = express();
const PORT = process.env.PORT;

connectToDatabase();

// middlewares
app.use(express.urlencoded({
    extends: true
}));
app.use(express.json());
app.use(cookieParser());

// APIs
app.use('/api/v1/user', userRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});