import { Request, Response, NextFunction } from 'express';
import { getUserSubscriptionTier } from '../../services/user.service';

export const tierAccessMiddleware = (requiredTier: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const userTier = getUserSubscriptionTier(userId);

        if (userTier === requiredTier) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: insufficient subscription tier' });
        }
    };
};