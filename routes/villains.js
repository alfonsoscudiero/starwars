/* ***************************
 *  routes/villains.js
 * ************************** */

const express = require('express');
const router = express.Router();

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
      description: 'Villain ID',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[200] = {
      description: 'Villain found'
  } */

  /* #swagger.responses[404] = {
      description: 'Villain not found'
  } */

  /* #swagger.responses[400] = {
      description: 'Invalid ID format'
  } */

  /* #swagger.responses[500] = {
        description: 'Internal server error'
  } */
  villainsController.getVillainById
);

// POST /api/villains
router.post(
  '/',
  /* #swagger.summary = 'Create a new villain' */
  /* #swagger.description = 'Creates a new villain and returns the generated ID.' */

  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Contact data to create',
        required: true,
        schema: { $ref: '#/definitions/CharacterInput' }
  } */

  /* #swagger.responses[201] = {
      description: 'Villain created successfully'
  } */

  /* #swagger.responses[400] = {
      description: 'Validation failed'
  } */

  /* #swagger.responses[500] = {
      description: 'Internal server error'
  } */
  villainsController.createVillain
);

// PUT /api/villains/:id
router.put('/:id', villainsController.updateVillainById);

// DELETE /api/villains/:id
router.delete('/:id', villainsController.deleteVillainById);

module.exports = router;
