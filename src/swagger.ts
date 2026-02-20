/* ***************************
 *  src/swagger.ts
 * ************************** */
// swagger-autogen exports a factory function
import swaggerAutogenFactory from 'swagger-autogen';
// Invoke it to create the Swagger generator instance
const swaggerAutogen = swaggerAutogenFactory();

const isProd = process.env.NODE_ENV === 'production';
// LOCAL http://localhost:3000
// RENDER https://starwars-p3bg.onrender.com

const PUBLIC_HOST =
  process.env.PUBLIC_HOST ||
  (isProd ? 'starwars-p3bg.onrender.com' : 'localhost:3000');

const PUBLIC_SCHEME = process.env.PUBLIC_SCHEME || (isProd ? 'https' : 'http');

const doc = {
  info: {
    title: 'Star Wars API',
    description: 'Heroes and Villains REST API',
  },
  host: PUBLIC_HOST,
  schemes: [PUBLIC_SCHEME],
  // Reusable data model
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
const endpointsFiles = ['./dist/server.ts'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
