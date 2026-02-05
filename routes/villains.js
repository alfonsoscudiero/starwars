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

module.exports = router;
