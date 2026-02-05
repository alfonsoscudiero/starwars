/* ***************************
 *  controllers/villains.js
 * ************************** */
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
    console.error('[] Error fetching villains:', error);
    return res.status(500).json({
      message: '[controllers/villains] Server error.',
    });
  }
};

// GET /api/villains/:id
const getVillainById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: '[controllers/villains] Invalid id format.',
      });
    }

    const db = await connectToDatabase();

    const villain = await db
      .collection('villains')
      .findOne({ _id: new ObjectId(id) });

    if (!villain) {
      return res.status(404).json({
        message: '[controllers/villains] villain not found.',
      });
    }

    return res.status(200).json(villain);
  } catch (error) {
    console.error(
      '[controllers/villains] Error fetching villain by id:',
      error
    );
    return res.status(500).json({
      message: '[controllers/villains] Server error.',
    });
  }
};

module.exports = {
  getVillains,
  getVillainById,
};
