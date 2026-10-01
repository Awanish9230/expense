import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONOGO_URI || 'mongodb://localhost:27017/expense';
        await mongoose.connect(uri);
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed', error);
        process.exit(1);
    }
};

export default connectDB;