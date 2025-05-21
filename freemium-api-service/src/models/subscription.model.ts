export interface Subscription {
    id: string;
    userId: string;
    stripeSubscriptionId?: string;
    tier: string;
    status: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class SubscriptionModel {
    constructor(public subscription: Subscription) {}

    static create(subscriptionData: Omit<Subscription, 'id'>): SubscriptionModel {
        const id = generateUniqueId(); // Assume this function generates a unique ID
        const newSubscription = { ...subscriptionData, id };
        return new SubscriptionModel(newSubscription);
    }

    static update(subscription: Subscription, updates: Partial<Subscription>): SubscriptionModel {
        const updatedSubscription = { ...subscription, ...updates };
        return new SubscriptionModel(updatedSubscription);
    }

    static deactivate(subscription: Subscription): SubscriptionModel {
        const updatedSubscription = { ...subscription, isActive: false };
        return new SubscriptionModel(updatedSubscription);
    }
}