/* ***************************
 *  routes/heroes.js
 * ************************** */
const express = require('express');
const router = express.Router();

const { characterSchema, idParamSchema } = require('../validators/validator-schema');
const { validateBody, validateParams } = require('../middlewares/validator');

const heroesController = require('../controllers/heroes');

// GET /api/heroes
router.get(
  '/',
  /* #swagger.summary = 'Get all Star Wars heroes' */
  /* #swagger.description = 'Returns an array of all heroes stored in the database.' */

  /* #swagger.responses[200] = {
        description: 'List of heroes'
    } */

  /* #swagger.responses[500] = {
        description: 'Internal server error'
    } */
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

  /* #swagger.responses[200] = {
      description: 'Hero found'
  } */

  /* #swagger.responses[404] = {
      description: 'Hero not found'
  } */

  /* #swagger.responses[422] = {
      description: 'Invalid ID format (must be a 24-character hex string)'
  } */

  /* #swagger.responses[500] = {
      description: 'Internal server error'
  } */
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

  /* #swagger.responses[201] = {
      description: 'Hero created successfully'
  } */

  /* #swagger.responses[422] = {
      description: 'Validation failed (request body did not match required schema)'
  } */

  /* #swagger.responses[500] = {
      description: 'Internal server error'
  } */
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

  /* #swagger.responses[204] = {
      description: 'Hero updated successfully (No Content)'
  } */

  /* #swagger.responses[404] = {
      description: 'Hero not found'
  } */

  /* #swagger.responses[422] = {
      description: 'Invalid ID format or body validation failed'
  } */

  /* #swagger.responses[500] = {
      description: 'Internal server error'
  } */
  validateParams(idParamSchema),
  validateBody(characterSchema),
  heroesController.updateHeroById
);

// DELETE /api/heroes/:id
router.delete(
  '/:id',
  /* #swagger.summary = 'Delete a hero by ID' */
  /* #swagger.description = 'Deletes an existing hero by MongoDB ObjectId. Returns 204 No Content on success.' */

  /* #swagger.parameters['id'] = {
      in: 'path',
      description: 'Hero ID (MongoDB ObjectId)',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[204] = {
      description: 'Hero deleted successfully (No Content)'
  } */

  /* #swagger.responses[404] = {
      description: 'Hero not found'
  } */

  /* #swagger.responses[422] = {
      description: 'Invalid ID format (must be a 24-character hex string)'
  } */

  /* #swagger.responses[500] = {
      description: 'Internal server error'
  } */
  validateParams(idParamSchema),
  heroesController.deleteHeroById
);

module.exports = router;
