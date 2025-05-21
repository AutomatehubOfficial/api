import stripe from '../config/stripe';
import { PRODUCT_TIERS } from '../config/stripe';
import { Subscription, SubscriptionModel } from '../models/subscription.model';
import { User } from '../models/user.model';

export class SubscriptionService {
    private subscriptions: Subscription[] = [];

    createSubscription(userId: string, tier: string): Subscription {
        const newSubscriptionModel = SubscriptionModel.create({
            userId,
            tier,
            startDate: new Date(),
            endDate: new Date(), // Set appropriately
            isActive: true
        });
        const newSubscription = newSubscriptionModel.subscription;
        this.subscriptions.push(newSubscription);
        return newSubscription;
    }

    getSubscription(userId: string): Subscription | undefined {
        return this.subscriptions.find(subscription => subscription.userId === userId);
    }

    updateSubscription(userId: string, tier: string): Subscription | undefined {
        const subscription = this.getSubscription(userId);
        if (subscription) {
            subscription.tier = tier;
            return subscription;
        }
        return undefined;
    }

    deleteSubscription(userId: string): boolean {
        const index = this.subscriptions.findIndex(subscription => subscription.userId === userId);
        if (index !== -1) {
            this.subscriptions.splice(index, 1);
            return true;
        }
        return false;
    }
}

/**
 * Subscription plan interface
 */
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price?: number;
  currency?: string;
  features: string[];
  tier: string;
}

/**
 * Get all available subscription plans
 * @returns {Promise<SubscriptionPlan[]>} Array of subscription plans
 */
export const getAllSubscriptions = async (): Promise<SubscriptionPlan[]> => {
  try {
    // Define the free tier which isn't in Stripe
    const freeTier: SubscriptionPlan = {
      id: 'free_tier',
      name: 'Free',
      description: 'Basic functionality with limited API calls',
      tier: PRODUCT_TIERS.free,
      features: [
        '100 API calls per day',
        'Basic endpoints access',
        'Standard response time'
      ]
    };

    // Fetch paid tiers from Stripe
    const subscriptionPlans: SubscriptionPlan[] = [freeTier];
    
    // Fetch the basic tier details
    if (PRODUCT_TIERS.basic) {
      const basicPrice = await stripe.prices.retrieve(PRODUCT_TIERS.basic, {
        expand: ['product']
      });
      
      const basicProduct = basicPrice.product as any;
      subscriptionPlans.push({
        id: PRODUCT_TIERS.basic,
        name: basicProduct.name,
        description: basicProduct.description || 'Enhanced functionality with more API calls',
        price: basicPrice.unit_amount ? basicPrice.unit_amount / 100 : 0,
        currency: basicPrice.currency,
        tier: 'basic',
        features: basicProduct.metadata?.features?.split(',') || [
          '1000 API calls per day',
          'Access to all standard endpoints',
          'Faster response time'
        ]
      });
    }
    
    // Fetch the premium tier details
    if (PRODUCT_TIERS.premium) {
      const premiumPrice = await stripe.prices.retrieve(PRODUCT_TIERS.premium, {
        expand: ['product']
      });
      
      const premiumProduct = premiumPrice.product as any;
      subscriptionPlans.push({
        id: PRODUCT_TIERS.premium,
        name: premiumProduct.name,
        description: premiumProduct.description || 'Full access to all features and API endpoints',
        price: premiumPrice.unit_amount ? premiumPrice.unit_amount / 100 : 0,
        currency: premiumPrice.currency,
        tier: 'premium',
        features: premiumProduct.metadata?.features?.split(',') || [
          'Unlimited API calls',
          'Access to all endpoints including premium features',
          'Priority support',
          'Custom integrations'
        ]
      });
    }

    return subscriptionPlans;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw new Error('Failed to retrieve subscription plans');
  }
};

/**
 * Get subscription by ID
 * @param {string} subscriptionId - Subscription ID
 * @returns {Promise<any>} Subscription details
 */
export const getSubscriptionById = async (subscriptionId: string): Promise<any> => {
  try {
    if (subscriptionId === 'free_tier') {
      // Return the free tier details
      return {
        id: 'free_tier',
        name: 'Free',
        description: 'Basic functionality with limited API calls',
        tier: PRODUCT_TIERS.free,
        features: [
          '100 API calls per day',
          'Basic endpoints access',
          'Standard response time'
        ]
      };
    }
    
    // For paid subscriptions, get the details from Stripe
    const subscription = await stripe.prices.retrieve(subscriptionId, {
      expand: ['product']
    });
    
    return subscription;
  } catch (error) {
    console.error(`Error fetching subscription ${subscriptionId}:`, error);
    throw new Error('Failed to retrieve subscription details');
  }
};
