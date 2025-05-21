import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'database',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/freemium-api',
  },
  api: {
    prefix: '/api',
    version: 'v1',
  },
  openApi: {
    docsUrl: '/docs',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    basicPriceId: process.env.STRIPE_BASIC_PRICE_ID || '',
    premiumPriceId: process.env.STRIPE_PREMIUM_PRICE_ID || '',
  }
};

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.db.mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default config;