import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
    path: '../.env'
})

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        // Optionally, terminate the process if the database connection fails
        process.exit(1);
    }
};

export default connectToDatabase;