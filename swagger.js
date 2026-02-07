// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Star Wars API',
    description: 'Heroes and Villains REST API',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local' },
    { url: 'https://starwars-p3bg.onrender.com', description: 'Render' },
  ],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
