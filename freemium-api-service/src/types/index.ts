export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    stripeCustomerId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface Subscription {
    id: string;
    userId: string;
    stripeSubscriptionId?: string;
    tier: SubscriptionTier;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

export interface RateLimit {
    limit: number;
    duration: number; // in seconds
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}