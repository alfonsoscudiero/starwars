/* ***************************
 *  controllers/villains.js
 * ************************** */
const createError = require('http-errors');

// MongoDB ObjectId utility and database connection
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db/connection');

// Capitalization
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

// Normalize payload into DB shape
const toVillainDoc = (value) => ({
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
});

// GET /api/villains
const getVillains = async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const villains = await db.collection('villains').find({}).toArray();

    return res.status(200).json(villains);
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while fetching villains';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// GET /api/villains/:id
const getVillainById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();

    const villain = await db
      .collection('villains')
      .findOne({ _id: new ObjectId(id) });

    if (!villain) {
      const err = createError(404, 'Villain not found');

      err.publicMessage = 'No villain exists with the provided id';
      err.help = 'Use GET /api/villains to list valid ids.';
      return next(err);
    }

    return res.status(200).json(villain);
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while fetching the villain';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// POST /api/villains
const createVillain = async (req, res, next) => {
  try {
    // req.body already validated
    const newVillain = toVillainDoc(req.body);

    const db = await connectToDatabase();
    const result = await db.collection('villains').insertOne(newVillain);

    return res.status(201).json({ id: result.insertedId });
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while creating the villain';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// PUT /api/villains/:id
const updateVillainById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedVillain = toVillainDoc(req.body);

    const db = await connectToDatabase();
    const villainId = new ObjectId(id);

    const result = await db
      .collection('villains')
      .updateOne({ _id: villainId }, { $set: updatedVillain });

    if (result.matchedCount === 0) {
      const err = createError(404, 'Villain not found');

      err.publicMessage = 'No villain exists with the provided id';
      err.help = 'Use GET /api/villains to list valid ids.';
      return next(err);
    }

    return res.status(204).send();
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while updating the villain';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// DELETE /api/villains/:id
const deleteVillainById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();

    const result = await db
      .collection('villains')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      const err = createError(404, 'Villain not found');

      err.publicMessage = 'No villain exists with the provided id';
      err.help = 'Use GET /api/villains to list valid ids.';
      return next(err);
    }

    return res.status(204).send();
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while deleting the villain';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

module.exports = {
  getVillains,
  getVillainById,
  createVillain,
  updateVillainById,
  deleteVillainById,
};
