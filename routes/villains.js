/* ***************************
 *  routes/villains.js
 * ************************** */

const express = require('express');
const router = express.Router();

const {
  characterSchema,
  idParamSchema,
} = require('../validators/validator-schema');
const { validateBody, validateParams } = require('../middlewares/validator');

const villainsController = require('../controllers/villains');

// GET /api/villains
router.get(
  '/',
  /* #swagger.summary = 'Get all Star Wars villains' */
  /* #swagger.description = 'Returns an array of all villains stored in the database.' */

  /* #swagger.responses[200] = {
      description: 'List of villains'
    } */

  /* #swagger.responses[500] = {
      description: 'Internal server error'
    } */
  villainsController.getVillains
);

// GET /api/villains/:id
router.get(
  '/:id',
  /* #swagger.summary = 'Get Star Wars villain by ID' */
  /* #swagger.description = 'Returns a single villain by MongoDB ObjectId.' */

  /* #swagger.parameters['id'] = {
      in: 'path',
      description: 'Villain ID (MongoDB ObjectId)',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[200] = {
      description: 'Villain found'
  } */

  /* #swagger.responses[404] = {
      description: 'Villain not found'
  } */

  /* #swagger.responses[422] = {
      description: 'Invalid ID format (must be a 24-character hex string)'
  } */

  /* #swagger.responses[500] = {
      description: 'Internal server error'
  } */
  validateParams(idParamSchema),
  villainsController.getVillainById
);

// POST /api/villains
router.post(
  '/',
  /* #swagger.summary = 'Create a new villain' */
  /* #swagger.description = 'Creates a new villain and returns the generated ID.' */

  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Villain data to create',
        required: true,
        schema: { $ref: '#/definitions/CharacterInput' }
  } */

  /* #swagger.responses[201] = {
      description: 'Villain created successfully'
  } */

  /* #swagger.responses[422] = {
      description: 'Validation failed (request body did not match required schema)'
  } */

  /* #swagger.responses[500] = {
      description: 'Internal server error'
  } */
  validateBody(characterSchema),
  villainsController.createVillain
);

// PUT /api/villains/:id
router.put(
  '/:id',
  /* #swagger.summary = 'Update a villain by ID' */
  /* #swagger.description = 'Updates an existing villain by MongoDB ObjectId. Returns 204 No Content on success.' */

  /* #swagger.parameters['id'] = {
      in: 'path',
      description: 'Villain ID (MongoDB ObjectId)',
      required: true,
      type: 'string'
  } */

  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated villain data (must match CharacterInput schema)',
        required: true,
        schema: { $ref: '#/definitions/CharacterInput' }
  } */

  /* #swagger.responses[204] = {
      description: 'Villain updated successfully (No Content)'
  } */

  /* #swagger.responses[404] = {
      description: 'Villain not found'
  } */

  /* #swagger.responses[422] = {
      description: 'Invalid ID format or body validation failed'
  } */

  /* #swagger.responses[500] = {
      description: 'Internal server error'
  } */
  validateParams(idParamSchema),
  validateBody(characterSchema),
  villainsController.updateVillainById
);

// DELETE /api/villains/:id
router.delete(
  '/:id',
  /* #swagger.summary = 'Delete a villain by ID' */
  /* #swagger.description = 'Deletes an existing villain by MongoDB ObjectId. Returns 200 on success' */

  /* #swagger.parameters['id'] = {
      in: 'path',
      description: 'Villain ID (MongoDB ObjectId)',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[200] = {
      description: 'Villain deleted successfully'
  } */

  /* #swagger.responses[404] = {
      description: 'Villain not found'
  } */

  /* #swagger.responses[422] = {
      description: 'Invalid ID format (must be a 24-character hex string)'
  } */

  /* #swagger.responses[500] = {
      description: 'Internal server error'
  } */
  validateParams(idParamSchema),
  villainsController.deleteVillainById
);

module.exports = router;
