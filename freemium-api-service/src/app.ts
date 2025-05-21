import express from 'express';
import { json } from 'body-parser';
import { connectToDatabase } from './config/index';
import routes from './api/routes';
import { freeTierLimiter } from './api/middlewares/rate-limit.middleware';
import { authenticate } from './api/middlewares/auth.middleware';
import { tierAccessMiddleware } from './api/middlewares/tier-access.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/openapi.yaml';

const app = express();
const PORT = process.env.PORT || 3000;

// For regular API routes
app.use(json());

// Special raw body parser for Stripe webhooks
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });