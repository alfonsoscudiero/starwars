/* ***************************
 *  src/routes/heroes.ts
 * ************************** */
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';

import { validateBody, validateParams } from '../middlewares/validator.js';
import {
  characterSchema,
  idParamSchema,
} from '../validators/validator-schema.js';

import * as heroesController from '../controllers/heroes.js';

// AUTH PLACEHOLDER
const requireAuth = (_req: Request, _res: Response, next: NextFunction): void =>
  next();

const router = Router();

// GET /api/heroes
router.get(
  '/',
  /* #swagger.summary = 'Get all Star Wars heroes' */
  /* #swagger.description = 'Returns an array of all heroes stored in the database.' */

  /* #swagger.responses[200] = { description: 'List of heroes' } */
  /* #swagger.responses[500] = { description: 'Internal server error' } */

  heroesController.getHeroes
);

// GET /api/heroes/:id
router.get(
  '/:id',
  /* #swagger.summary = 'Get Star Wars hero by ID' */
  /* #swagger.description = 'Returns a single hero by MongoDB ObjectId.' */

  /* #swagger.parameters['id'] = {
      in: 'path',
      description: 'Hero ID (MongoDB ObjectId)',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[200] = { description: 'Hero found' } */
  /* #swagger.responses[404] = { description: 'Hero not found' } */
  /* #swagger.responses[422] = { description: 'Invalid ID format (must be a 24-character hex string)' } */
  /* #swagger.responses[500] = { description: 'Internal server error' } */

  validateParams(idParamSchema),
  heroesController.getHeroById
);

// POST /api/heroes
router.post(
  '/',
  /* #swagger.summary = 'Create a new hero' */
  /* #swagger.description = 'Creates a new hero and returns the generated ID.' */

  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Hero data to create',
      required: true,
      schema: { $ref: '#/definitions/CharacterInput' }
  } */

  /* #swagger.responses[201] = { description: 'Hero created successfully' } */
  /* #swagger.responses[401] = { description: 'Unauthorized' } */
  /* #swagger.responses[422] = { description: 'Validation failed (request body did not match required schema)' } */
  /* #swagger.responses[500] = { description: 'Internal server error' } */
  requireAuth,
  validateBody(characterSchema),
  heroesController.createHero
);

// PUT /api/heroes/:id
router.put(
  '/:id',
  /* #swagger.summary = 'Update a hero by ID' */
  /* #swagger.description = 'Updates an existing hero by MongoDB ObjectId. Returns 204 No Content on success.' */

  /* #swagger.parameters['id'] = {
      in: 'path',
      description: 'Hero ID (MongoDB ObjectId)',
      required: true,
      type: 'string'
  } */

  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated hero data (must match CharacterInput schema)',
      required: true,
      schema: { $ref: '#/definitions/CharacterInput' }
  } */

  /* #swagger.responses[204] = { description: 'Hero updated successfully' } */
  /* #swagger.responses[401] = { description: 'Unauthorized' } */
  /* #swagger.responses[404] = { description: 'Hero not found' } */
  /* #swagger.responses[422] = { description: 'Invalid ID format or body validation failed' } */
  /* #swagger.responses[500] = { description: 'Internal server error' } */
  requireAuth,
  validateParams(idParamSchema),
  validateBody(characterSchema),
  heroesController.updateHeroById
);

// DELETE /api/heroes/:id
router.delete(
  '/:id',
  /* #swagger.summary = 'Delete a hero by ID' */
  /* #swagger.description = 'Deletes an existing hero by MongoDB ObjectId. Returns 200 OK on success.' */

  /* #swagger.parameters['id'] = {
      in: 'path',
      description: 'Hero ID (MongoDB ObjectId)',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[200] = { description: 'Hero deleted successfully' } */
  /* #swagger.responses[401] = { description: 'Unauthorized' } */
  /* #swagger.responses[404] = { description: 'Hero not found' } */
  /* #swagger.responses[422] = { description: 'Invalid ID format (must be a 24-character hex string)' } */
  /* #swagger.responses[500] = { description: 'Internal server error' } */
  requireAuth,
  validateParams(idParamSchema),
  heroesController.deleteHeroById
);

export default router;
