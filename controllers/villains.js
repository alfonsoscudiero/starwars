/* ***************************
 *  controllers/villains.js
 * ************************** */
// // Import Joi to validate request body
const Joi = require('joi');

// // Joi schema
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

// GET /api/villains
const getVillains = async (req, res) => {
  try {
    const db = await connectToDatabase();

    const villains = await db.collection('villains').find({}).toArray();

    return res.status(200).json(villains);
  } catch (error) {
    console.error('[controllers/villains] Error fetching villains:', error);
    return res.status(500).json({
      message: '[controllers/getVillains] Server error.',
    });
  }
};

// GET /api/villains/:id
const getVillainById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: '[controllers/getVillainById] Invalid id format.',
      });
    }

    const db = await connectToDatabase();

    const villain = await db
      .collection('villains')
      .findOne({ _id: new ObjectId(id) });

    if (!villain) {
      return res.status(404).json({
        message: '[controllers/getVillainById] Villain not found.',
      });
    }

    return res.status(200).json(villain);
  } catch (error) {
    console.error(
      '[controllers/getVillainById] Error fetching villain by id:',
      error
    );
    return res.status(500).json({
      message: '[controllers/getVillainById] Server error.',
    });
  }
};

// POST /api/villains
const createVillain = async (req, res) => {
  try {
    const { value, error } = characterSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: '[controllers/createVillain] Validation failed.',
        details: error.details.map((d) => d.message),
      });
    }

    const capitalize = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

    const newVillain = {
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

    const db = await connectToDatabase();
    const result = await db.collection('villains').insertOne(newVillain);

    return res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error(
      '[controllers/createVillain] Error creating a villain:',
      error
    );
    return res
      .status(500)
      .json({ message: '[controllers/createVillain] Server error.' });
  }
};

// PUT /api/villains/:id
const updateVillainById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: '[controllers/updateVillainById] Invalid villain id format.',
      });
    }

    const { value, error } = characterSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: '[controllers/updateVillainById] Validation failed.',
        details: error.details.map((d) => d.message),
      });
    }

    const capitalize = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

    // Build the update payload
    const updatedVillain = {
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
    const villainId = new ObjectId(id);

    const result = await db
      .collection('villains')
      .updateOne({ _id: villainId }, { $set: updatedVillain });

    // If no document matched that _id
    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: '[controllers/updateVillainById] Vilain not found.',
      });
    }

    // Success (no content)
    return res.status(204).send();
  } catch (error) {
    console.error(
      '[controllers/updateVillainById] Error updating villain:',
      error
    );
    return res.status(500).json({
      message: '[controllers/updateVillainById] Server error',
    });
  }
};

module.exports = {
  getVillains,
  getVillainById,
  createVillain,
  updateVillainById,
};
