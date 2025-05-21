# Freemium API Service

## Overview
The Freemium API Service provides a set of endpoints for managing user subscriptions and access based on different tiers. It implements a freemium model, allowing users to access basic features for free while offering premium features through paid subscriptions.

## Features
- User management: Create, update, and retrieve user data.
- Subscription management: Handle user subscriptions and tier access.
- Rate limiting: Enforce limits on API requests based on user tiers.
- OpenAPI documentation: Comprehensive API documentation for easy integration.
- Payment processing: Integrated with Stripe for handling subscription payments.

## Getting Started

### Prerequisites
- Node.js (version X.X.X)
- npm (version X.X.X)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd freemium-api-service
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the application, run:
```
npm start
```
The server will listen on the specified port (default: 3000).

### API Documentation
The API is documented using OpenAPI. You can find the specification in the `src/docs/openapi.yaml` file. This documentation provides details on available endpoints, request/response formats, and authentication methods.

### Stripe Integration
The API integrates with Stripe for payment processing. To set up Stripe:

1. Create a Stripe account at [stripe.com](https://stripe.com) if you don't have one.
2. Get your API keys from the Stripe Dashboard.
3. Create products and price plans for your subscription tiers:
   - Basic tier
   - Premium tier
4. Set up a webhook endpoint in the Stripe Dashboard pointing to `/api/webhooks/stripe`.
5. Add your Stripe configuration to the `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
   STRIPE_BASIC_PRICE_ID=price_basic_tier_id
   STRIPE_PREMIUM_PRICE_ID=price_premium_tier_id
   ```

## Rate Limits
The API enforces rate limits based on user tiers. Refer to the `src/config/rate-limits.ts` file for specific configurations.

## Testing
To run the tests, use:
```
npm test
```
This will execute both unit and integration tests to ensure the functionality of the application.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.