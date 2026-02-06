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

// POST /api/heroes
router.post('/', heroesController.createHero);

// PUT /api/heroes/:id
router.put('/:id', heroesController.updateHeroById);

module.exports = router;
