/* ***************************
 *  Express Web Server
 * ************************** */ //
// Load Environment variables
require('dotenv').config();
// Express imports
const express = require('express');

// App creation
const app = express();

// Server Configuration
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Server Start
app.listen(PORT, () => {
  console.log(`[server] Server is running on http://localhost:${PORT}`);
});
