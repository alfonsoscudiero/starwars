/* ***************************
 *  src/swagger.ts
 * ************************** */
// swagger-autogen exports a factory function
import swaggerAutogenFactory from 'swagger-autogen';
// Invoke it to create the Swagger generator instance
const swaggerAutogen = swaggerAutogenFactory();

// Detect environment
const isRender = Boolean(process.env.RENDER_EXTERNAL_HOSTNAME);

const PUBLIC_HOST =
  process.env.RENDER_EXTERNAL_HOSTNAME ||
  process.env.PUBLIC_HOST ||
  'localhost:3000';

const PUBLIC_SCHEME = isRender ? 'https' : process.env.PUBLIC_SCHEME || 'http';

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
const endpointsFiles = ['./dist/server.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
