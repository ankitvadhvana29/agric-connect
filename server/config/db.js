import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connect to MongoDB database
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agriconnect';
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000, // Quick fail if local MongoDB is not running
    });
    isConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    // Disable Mongoose command buffering so queries don't hang for 10000ms!
    mongoose.set('bufferCommands', false);
    console.warn(` MongoDB Offline (${error.code || error.message})`);
    console.log(` Active: Seamless In-Memory Mock Store (Fast & Zero Timeout for SIH Demo)`);
    return null;
  }
};

export const isDatabaseConnected = () => isConnected;

export default connectDB;
