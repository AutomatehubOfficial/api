import stripe, { PRODUCT_TIERS } from '../config/stripe';
import { User } from '../models/user.model';
import { SubscriptionTier } from '../types';

export class PaymentService {
  
  /**
   * Creates a customer in Stripe
   */
  async createCustomer(email: string, name: string) {
    try {
      const customer = await stripe.customers.create({
        email,
        name
      });
      
      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Creates a subscription for a customer
   */
  async createSubscription(customerId: string, tier: SubscriptionTier) {
    try {
      // Handle free tier separately
      if (tier === 'free') {
        throw new Error('Free tier does not require a Stripe subscription');
      }
      
      // Get the price ID for the selected tier
      const priceId = PRODUCT_TIERS[tier];
      
      if (!priceId) {
        throw new Error(`Invalid tier: ${tier}`);
      }

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Cancels a subscription
   */
  async cancelSubscription(subscriptionId: string) {
    try {
      const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
      return canceledSubscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Updates a subscription to a new tier
   */
  async updateSubscription(subscriptionId: string, tier: SubscriptionTier) {
    try {
      // Handle free tier separately
      if (tier === 'free') {
        // Cancel the subscription if downgrading to free tier
        return await this.cancelSubscription(subscriptionId);
      }
      
      const priceId = PRODUCT_TIERS[tier];
      
      if (!priceId) {
        throw new Error(`Invalid tier: ${tier}`);
      }

      // Get the subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Get the subscription item to update
      const [subscriptionItem] = subscription.items.data;

      // Update the subscription with the new price
      const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              id: subscriptionItem.id,
              price: priceId,
            },
          ],
        }
      );

      return updatedSubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Creates a Stripe Checkout session for subscription checkout
   */
  async createCheckoutSession(customerId: string, tier: SubscriptionTier, successUrl: string, cancelUrl: string) {
    try {
      // Handle free tier separately
      if (tier === 'free') {
        throw new Error('Free tier does not require a checkout session');
      }
      
      const priceId = PRODUCT_TIERS[tier];
      
      if (!priceId) {
        throw new Error(`Invalid tier: ${tier}`);
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Creates a billing portal session for managing subscriptions
   */
  async createBillingPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session;
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw error;
    }
  }

  /**
   * Handles Stripe webhook events
   */
  async handleWebhookEvent(signature: string, payload: any) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      // Handle different types of events
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          // Update your database based on the event
          const subscription = event.data.object;
          // Call your subscription service to update the database
          break;
        
        case 'invoice.payment_succeeded':
          // Handle successful payments
          const invoice = event.data.object;
          // Call your subscription service to update the database
          break;

        case 'invoice.payment_failed':
          // Handle failed payments
          // Notify the customer or take appropriate action
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return event;
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }
}
