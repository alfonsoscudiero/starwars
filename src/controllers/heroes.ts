/* ***************************
 *  controllers/heroes.js
 * ************************** */
const createError = require('http-errors');

// MongoDB ObjectId utility and database connection
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../../db/connection');

// Capitalization
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

// Normalize payload into DB shape
const toHeroDoc = (value) => ({
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

// GET /api/heroes
const getHeroes = async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const heroes = await db.collection('heroes').find({}).toArray();

    return res.status(200).json(heroes);
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while fetching heroes';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// GET /api/heroes/:id
const getHeroById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();

    const hero = await db
      .collection('heroes')
      .findOne({ _id: new ObjectId(id) });

    if (!hero) {
      const err = createError(404, 'Hero not found');

      err.publicMessage = 'No hero exists with the provided id';
      err.help = 'Use GET /api/heroes to list valid ids.';
      return next(err);
    }

    return res.status(200).json(hero);
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while fetching the hero';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// POST /api/heroes
const createHero = async (req, res, next) => {
  try {
    // req.body already validated
    const newHero = toHeroDoc(req.body);

    // Insert into DB
    const db = await connectToDatabase();
    const result = await db.collection('heroes').insertOne(newHero);

    // Return HTTP 201 (Created)
    return res.status(201).json({ id: result.insertedId });
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while creating the hero';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// PUT /api/heroes/:id
const updateHeroById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedHero = toHeroDoc(req.body);

    const db = await connectToDatabase();
    const heroId = new ObjectId(id);

    const result = await db
      .collection('heroes')
      .updateOne({ _id: heroId }, { $set: updatedHero });

    // If no document matched that _id
    if (result.matchedCount === 0) {
      const err = createError(404, 'Hero not found');

      err.publicMessage = 'No hero exists with the provided id';
      err.help = 'Use GET /api/heroes to list valid ids.';
      return next(err);
    }

    // Success (no content)
    return res.status(204).send();
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while updating the hero';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// DELETE /api/heroes/:id
const deleteHeroById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();

    const result = await db
      .collection('heroes')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      const err = createError(404, 'Hero not found');

      err.publicMessage = 'No hero exists with the provided id';
      err.help = 'Use GET /api/heroes to list valid ids.';
      return next(err);
    }

    return res.status(200).json({
      message: 'Hero deleted successfully',
    });
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while deleting the hero';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

module.exports = {
  getHeroes,
  getHeroById,
  createHero,
  updateHeroById,
  deleteHeroById,
};
