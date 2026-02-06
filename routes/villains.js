/* ***************************
 *  routes/villains.js
 * ************************** */

const express = require('express');
const router = express.Router();

const villainsController = require('../controllers/villains');

// GET /api/villains
router.get('/', villainsController.getVillains);

// GET /api/villains/:id
router.get('/:id', villainsController.getVillainById);

// POST /api/villains
router.post('/', villainsController.createVillain);

// PUT /api/villains/:id
router.put('/:id', villainsController.updateVillainById);

module.exports = router;
