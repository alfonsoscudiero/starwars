/* ***************************
 *  controllers/heroes.js
 * ************************** */
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
      message: '[controllers/heroes] Server error.',
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
        message: '[controllers/heroes] Invalid id format.',
      });
    }

    const db = await connectToDatabase();

    const hero = await db
      .collection('heroes')
      .findOne({ _id: new ObjectId(id) });

    if (!hero) {
      return res.status(404).json({
        message: '[controllers/heroes] Hero not found.',
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

module.exports = {
  getHeroes,
  getHeroById,
};
