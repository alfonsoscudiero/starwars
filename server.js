/* ***************************
 *  server.js
 * ************************** */
// Load Environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// http-errors factory
const createError = require('http-errors');

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Database Connection
const { connectToDatabase } = require('./db/connection');

// App creation
const app = express();
// Server Configuration
const PORT = process.env.PORT || 3000;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const heroesRoutes = require('./routes/heroes');
const villainsRoutes = require('./routes/villains');

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
  (req, res) => {
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

// 404 Not Found Handler (CATCH-ALL)
app.use((req, res, next) => {
  next(createError(404, 'Not found'));
});

// Centralized error-handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  // Standardized JSON error contract
  const responseBody = {
    statusCode,
    message: err.message || (isClientError ? 'Request failed' : 'Server error'),

    error: isClientError
      ? err.publicMessage || err.message || 'Request could not be processed'
      : 'Unexpected error',

    help: err.help || 'See /api-docs for usage requirements',

    // Helpful debugging metadata
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Attach validation details
  if (Array.isArray(err.details) && err.details.length > 0) {
    responseBody.details = err.details;
  }

  // Log stack/details only for 5xx
  if (!isClientError) {
    console.error(err);
  }

  res.status(statusCode).json(responseBody);
});

// Start the server after DB check
async function startServer() {
  try {
    // Verify DB connection
    await connectToDatabase();
    console.log('[server] MongoDB connection verified');

    // Start listening only after DB is ready
    app.listen(PORT, () => {
      console.log(`[server] Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      '[server] Failed to start server because MongoDB connection failed:'
    );
    console.error(error);

    // Exit with failure
    process.exit(1);
  }
}

startServer();
