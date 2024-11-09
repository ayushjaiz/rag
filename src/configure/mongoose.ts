import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI!, {
            bufferCommands: false,
            dbName: 'rag',
        });
        console.log("MongoDB connected successfully.");
    }
};

export { connectDB };
