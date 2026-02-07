/* ***************************
 *  server.js
 * ************************** */
// Load Environment variables
require('dotenv').config();
// Express imports
const express = require('express');
// Swagger imports
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// CORS imports
const cors = require('cors');

// Database Connection
const { connectToDatabase } = require('./db/connection');

// App creation
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Server Configuration
const PORT = process.env.PORT || 3000;

// Route modules
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

// Connect to MongoDB and start the server
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
