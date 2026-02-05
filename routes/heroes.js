/* ***************************
 *  routes/heroes.js
 * ************************** */
const express = require('express');
const router = express.Router();

const heroesController = require('../controllers/heroes');

// GET /api/heroes
router.get('/', heroesController.getHeroes);

// GET /api/heroes/:id
router.get('/:id', heroesController.getHeroById);

module.exports = router;
