/* ***************************
 *  src/server.ts
 * ************************** */
// Load Environment variables
import 'dotenv/config';

import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

// CORS imports
import cors from 'cors';

// http-errors factory
import createError from 'http-errors';

// Swagger UI
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('../swagger.json') as object;

// Database Connection
import { connectToDatabase } from './db/connection';

// App creation
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Server Configuration
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Routes
import heroesRoutes from './routes/heroes';
import villainsRoutes from './routes/villains';

// Endpoints
app.get(
  '/',
  /* #swagger.summary = 'API welcome and available endpoints' */
  /* #swagger.description = 'Returns a welcome message and a list of available Star Wars API endpoints.' */

  /* #swagger.responses[200] = {
      description: 'API is running and available endpoints are listed',
      content: {
        'application/json': {
          example: {
            message: 'Welcome to the Star Wars API',
            description: 'This API provides access to Star Wars heroes and villains data.',
            endpoints: {
              heroes: '/api/heroes',
              villains: '/api/villains'
            },
            docs: '/api-docs',
            status: 'OK'
          }
        }
      }
  } */
  (_req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to the Star Wars API',
      description:
        'This API provides access to Star Wars heroes and villains data.',
      endpoints: {
        heroes: '/api/heroes',
        villains: '/api/villains',
      },
      docs: '/api-docs',
      status: 'OK',
    });
  }
);
app.use('/api/heroes', heroesRoutes);
app.use('/api/villains', villainsRoutes);

// 404 Not Found Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404, 'Not found'));
});

// Centralized error-handling
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || err.status || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  // Standardized JSON error contract
  const responseBody: Record<string, unknown> = {
    statusCode,
    message: err.message || (isClientError ? 'Request failed' : 'Server error'),

    error: isClientError
      ? err.publicMessage || err.message || 'Request could not be processed'
      : 'Unexpected error',

    // Tells the client where to look next
    help: err.help || 'See /api-docs for usage requirements',

    // Helpful debugging metadata
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Include Joi validation details when provided
  if (Array.isArray(err.details) && err.details.length > 0) {
    responseBody.details = err.details;
  }

  // Log server-side details for unexpected errors (5xx)
  if (!isClientError) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json(responseBody);
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    // Verify DB connection
    await connectToDatabase();
    // eslint-disable-next-line no-console
    console.log('[server] MongoDB connection verified');

    // Start listening only after DB is ready
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`[server] Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      '[server] Failed to start server because MongoDB connection failed:'
    );
    // eslint-disable-next-line no-console
    console.error(error);

    // Exit with failure
    process.exit(1);
  }
}

startServer();
