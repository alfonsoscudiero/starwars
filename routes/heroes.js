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
      description: 'Hero ID',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[200] = {
      description: 'Hero found'
  } */

  /* #swagger.responses[404] = {
      description: 'Hero not found'
  } */

  /* #swagger.responses[400] = {
      description: 'Invalid ID format'
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
        description: 'Contact data to create',
        required: true,
        schema: { $ref: '#/definitions/CharacterInput' }
  } */

  /* #swagger.responses[201] = {
      description: 'Hero created successfully'
  } */

  /* #swagger.responses[400] = {
      description: 'Validation failed'
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
  validateParams(idParamSchema),
  validateBody(characterSchema),
  heroesController.updateHeroById
);

// DELETE /api/heroes/:id
router.delete(
  '/:id',
  validateParams(idParamSchema),
  heroesController.deleteHeroById
);

module.exports = router;
