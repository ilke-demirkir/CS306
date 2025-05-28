// src/db.ts FOR MONGODB
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // loads MONGODB_URI from .env

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define MONGODB_URI in your .env');
}

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(uri);
  console.log('🔗 MongoDB connected');
};
