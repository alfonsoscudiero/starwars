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

  definitions: {
    // Request Body Schema (POST/PUT)
    CharacterInput: {
      type: 'object',
      required: [
        'firstName',
        'lastName',
        'species',
        'role',
        'homeWorld',
        'weapon',
        'powerLevel',
      ],
      properties: {
        firstName: { type: 'string', example: 'Luke' },
        lastName: { type: 'string', example: 'Skywalker', nullable: true },
        species: { type: 'string', example: 'Human' },
        role: { type: 'string', example: 'Jedi Knight' },
        homeWorld: { type: 'string', example: 'Tatooine', nullable: true },
        weapon: { type: 'string', example: 'Lightsaber' },
        powerLevel: { type: 'integer', example: 95 },
      },
    },
    // Response Schema (GET)
    Character: {
      allOf: [
        { $ref: '#/definitions/CharacterInput' },
        {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '69854e24a25464dcb361b656' },
          },
        },
      ],
    },
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
