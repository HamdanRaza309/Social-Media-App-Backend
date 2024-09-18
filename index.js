import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './config/db.js';

dotenv.config({
    path: '.env'
})

connectToDatabase();
const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});