import { Request, Response } from 'express';
import { PaymentService } from '../../services/payment.service';
import { SubscriptionTier } from '../../types';

const paymentService = new PaymentService();

/**
 * Create a checkout session for a subscription
 */
export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, tier, successUrl, cancelUrl } = req.body;
    
    if (!customerId || !tier || !successUrl || !cancelUrl) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const session = await paymentService.createCheckoutSession(
      customerId,
      tier as SubscriptionTier,
      successUrl,
      cancelUrl
    );

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

/**
 * Create a customer in Stripe
 */
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const customer = await paymentService.createCustomer(email, name);
    res.status(201).json({ customerId: customer.id });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

/**
 * Create a subscription for a customer
 */
export const createSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, tier } = req.body;
    
    if (!customerId || !tier) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const subscription = await paymentService.createSubscription(customerId, tier as SubscriptionTier);
    
    // For subscriptions that require client-side confirmation
    const clientSecret = (subscription as any).latest_invoice?.payment_intent?.client_secret;
    
    res.status(201).json({ 
      subscriptionId: subscription.id,
      clientSecret,
      status: subscription.status
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriptionId } = req.params;
    
    if (!subscriptionId) {
      res.status(400).json({ error: 'Missing subscription ID' });
      return;
    }

    await paymentService.cancelSubscription(subscriptionId);
    res.status(200).json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

/**
 * Update a subscription to a new tier
 */
export const updateSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriptionId } = req.params;
    const { tier } = req.body;
    
    if (!subscriptionId || !tier) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const updatedSubscription = await paymentService.updateSubscription(
      subscriptionId,
      tier as SubscriptionTier
    );
    
    res.status(200).json({ 
      subscriptionId: updatedSubscription.id,
      status: updatedSubscription.status
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
};

/**
 * Create a billing portal session
 */
export const createBillingPortalSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, returnUrl } = req.body;
    
    if (!customerId || !returnUrl) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const session = await paymentService.createBillingPortalSession(customerId, returnUrl);
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    res.status(500).json({ error: 'Failed to create billing portal session' });
  }
};

/**
 * Handle Stripe webhook events
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      res.status(400).json({ error: 'Missing Stripe signature' });
      return;
    }

    const event = await paymentService.handleWebhookEvent(signature, req.body);
    res.status(200).json({ received: true, type: event.type });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
};
