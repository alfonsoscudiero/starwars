/* **************************************
 *  src/validators/validator-schema.ts
 * ************************************* */

import Joi from 'joi';

// Validates the request body for creating/updating characters
export const characterSchema = Joi.object({
  firstName: Joi.string().trim().min(2).required(),
  lastName: Joi.string().trim().allow(null, '').required(),
  species: Joi.string().trim().required(),
  role: Joi.string().trim().required(),
  homeWorld: Joi.string().trim().allow(null, 'unknown').required(),
  weapon: Joi.string().trim().required(),
  powerLevel: Joi.number().integer().min(0).max(100).required(),
}).required();

// Validates the ":id" route param
export const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
}).required();
