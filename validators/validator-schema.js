/* ***************************
 *  validators/validator-schema.js
 * ************************** */
// Import Joi
const Joi = require('joi');

const characterSchema = Joi.object({
  firstName: Joi.string().trim().min(2).required(),
  lastName: Joi.string().trim().allow(null, '').required(),
  species: Joi.string().trim().required(),
  role: Joi.string().trim().required(),
  homeWorld: Joi.string().trim().allow(null, 'unknown').required(),
  weapon: Joi.string().trim().required(),
  powerLevel: Joi.number().integer().min(0).max(100).required(),
});

module.exports = { characterSchema };
