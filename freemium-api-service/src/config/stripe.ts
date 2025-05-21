import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with your secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const PRODUCT_TIERS = {
  free: 'free', // Adding free tier (no Stripe product ID needed)
  basic: process.env.STRIPE_BASIC_PRICE_ID || '',
  premium: process.env.STRIPE_PREMIUM_PRICE_ID || ''
};

export default stripe;
