/* ***************************
 *  server.js
 * ************************** */ //
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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

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
