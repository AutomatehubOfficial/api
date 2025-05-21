import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { rateLimits } from '../../config/rate-limits';

const createRateLimiter = (limit: number, windowMs: number) => {
    return rateLimit({
        windowMs,
        max: limit,
        message: 'Too many requests, please try again later.',
    });
};

export const freeTierLimiter = createRateLimiter(rateLimits.free.limit, rateLimits.free.windowMs);
export const premiumTierLimiter = createRateLimiter(rateLimits.premium.limit, rateLimits.premium.windowMs);
export const enterpriseTierLimiter = createRateLimiter(rateLimits.enterprise.limit, rateLimits.enterprise.windowMs);