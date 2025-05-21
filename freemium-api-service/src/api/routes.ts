import { Router } from 'express';
import { getUser, createUser, createCheckoutSession, createCustomer, createSubscription, cancelSubscription, updateSubscription, createBillingPortalSession, handleWebhook } from './controllers/index';
import { authenticate } from './middlewares/auth.middleware';
import { freeTierLimiter } from './middlewares/rate-limit.middleware';
import { tierAccessMiddleware } from './middlewares/tier-access.middleware';

const router = Router();

// Public route to create a user
router.post('/users', createUser);

// Protected route to get user information
router.get('/users/:id', authenticate, freeTierLimiter, getUser);

// Payment routes
router.post('/payments/customers', authenticate, createCustomer);
router.post('/payments/checkout-sessions', authenticate, createCheckoutSession);
router.post('/payments/subscriptions', authenticate, createSubscription);
router.delete('/payments/subscriptions/:subscriptionId', authenticate, cancelSubscription);
router.put('/payments/subscriptions/:subscriptionId', authenticate, updateSubscription);
router.post('/payments/billing-portal', authenticate, createBillingPortalSession);

// Stripe webhook endpoint (no auth required as it's called by Stripe)
router.post('/webhooks/stripe', handleWebhook);

export default router;
