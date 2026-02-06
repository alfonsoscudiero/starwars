/* ***************************
 *  controllers/heroes.js
 * ************************** */
// Import Joi to validate request body
const Joi = require('joi');

// Joi schema
const characterSchema = Joi.object({
  firstName: Joi.string().trim().min(2).required(),
  lastName: Joi.string().trim().allow(null, '').required(),
  species: Joi.string().trim().required(),
  role: Joi.string().trim().required(),
  homeWorld: Joi.string().trim().allow(null, 'unknown').required(),
  weapon: Joi.string().trim().required(),
  powerLevel: Joi.number().integer().min(0).max(100).required(),
});

// MongoDB ObjectId utility and database connection
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db/connection');

// GET /api/heroes
const getHeroes = async (req, res) => {
  try {
    const db = await connectToDatabase();

    const heroes = await db.collection('heroes').find({}).toArray();

    return res.status(200).json(heroes);
  } catch (error) {
    console.error('[] Error fetching heroes:', error);
    return res.status(500).json({
      message: '[controllers/getHeroes] Server error.',
    });
  }
};

// GET /api/heroes/:id
const getHeroById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: '[controllers/getHeroById] Invalid id format.',
      });
    }

    const db = await connectToDatabase();

    const hero = await db
      .collection('heroes')
      .findOne({ _id: new ObjectId(id) });

    if (!hero) {
      return res.status(404).json({
        message: '[controllers/getHeroById] Hero not found.',
      });
    }

    return res.status(200).json(hero);
  } catch (error) {
    console.error('[controllers/heroes] Error fetching hero by id:', error);
    return res.status(500).json({
      message: '[controllers/heroes] Server error.',
    });
  }
};

// POST /api/heroes
const createHero = async (req, res) => {
  try {
    // Validate body with Joi
    const { value, error } = characterSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: '[controllers/createHero] Validation failed',
        details: error.details.map((d) => d.message),
      });
    }

    // Capitalize the first letter
    const capitalize = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

    // Build new character
    const newHero = {
      firstName: capitalize(value.firstName),
      lastName: value.lastName ? capitalize(value.lastName) : null,
      species: capitalize(value.species),
      role: capitalize(value.role),
      homeWorld:
        value.homeWorld === null || value.homeWorld === 'unknown'
          ? value.homeWorld
          : capitalize(value.homeWorld),
      weapon: capitalize(value.weapon),
      powerLevel: value.powerLevel,
    };

    // Insert into DB
    const db = await connectToDatabase();
    const result = await db.collection('heroes').insertOne(newHero);

    // Return HTTP 201 (Created)
    return res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error('[controllers/createHero] Error creating a hero:', error);
    return res.status(500).json({
      message: '[controllers/createHero] Server error.',
    });
  }
};

// PUT /api/heroes/:id
const updateHeroById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: '[controllers/updateHeroById] Invalid hero id format.',
      });
    }

    // Validate body with Joi
    const { value, error } = characterSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation failed.',
        details: error.details.map((d) => d.message),
      });
    }

    // Capitalization helper
    const capitalize = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

    // Build the update payload
    const updatedHero = {
      firstName: capitalize(value.firstName),
      lastName: value.lastName ? capitalize(value.lastName) : null,
      species: capitalize(value.species),
      role: capitalize(value.role),
      homeWorld:
        value.homeWorld === null || value.homeWorld === 'unknown'
          ? value.homeWorld
          : capitalize(value.homeWorld),
      weapon: capitalize(value.weapon),
      powerLevel: value.powerLevel,
    };

    // Update in DB
    const db = await connectToDatabase();
    const heroId = new ObjectId(id);

    const result = await db
      .collection('heroes')
      .updateOne({ _id: heroId }, { $set: updatedHero });

    // If no document matched that _id
    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: '[controllers/updateHeroById] Hero not found.',
      });
    }

    // Success (no content)
    return res.status(204).send();
  } catch (error) {
    console.error('[controllers/updateHeroById] Error updating hero:', error);
    return res.status(500).json({
      message: '[controllers/updateHeroById] Server error.',
    });
  }
};

// DELETE /api/heroes/:id
const deleteHeroById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: '[controllers/deleteHeroById] Invalid hero id format.',
      });
    }

    const db = await connectToDatabase();

    const result = await db
      .collection('heroes')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: '[controllers/deleteHeroById] hero not found.',
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('[controllers/deleteHeroById] Error deleting hero:', error);
    return res.status(500).json({
      message: '[controllers/deleteHeroById] Server error.',
    });
  }
};

module.exports = {
  getHeroes,
  getHeroById,
  createHero,
  updateHeroById,
  deleteHeroById,
};
