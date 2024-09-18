import express from 'express';
import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
})

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
