export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    stripeCustomerId?: string;
    subscriptionTier: string;
    createdAt: Date;
    updatedAt: Date;
}

export class UserModel {
    constructor(public user: User) {}

    static create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): UserModel {
        const newUser: User = {
            id: generateUniqueId(),
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return new UserModel(newUser);
    }

    update(data: Partial<Omit<User, 'id' | 'createdAt'>>): void {
        this.user = { ...this.user, ...data, updatedAt: new Date() };
    }
}

function generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
}