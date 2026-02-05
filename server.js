/* ***************************
 *  server.js
 * ************************** */
// Load Environment variables
require('dotenv').config();
// Express imports
const express = require('express');

// Database Connection
const { connectToDatabase } = require('./db/connection');

// App creation
const app = express();

// Server Configuration
const PORT = process.env.PORT || 3000;

// Route modules
const heroesRoutes = require('./routes/heroes');

// Endpoints
app.get('/', (req, res) => {
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
});
app.use('/api/heroes', heroesRoutes);

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
