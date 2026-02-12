/* ***************************
 *  middlewares/validator.js
 * ************************** */
const createError = require('http-errors');

// Middleware factory for validating request bodies using Joi
const validateBody =
  (schema, options = { abortEarly: false, stripUnknown: true }) =>
  (req, res, next) => {
    const { value, error } = schema.validate(req.body, options);

    if (error) {
      // Error with http-errors
      const err = createError(422, 'Validation failed');

      err.details = error.details.map((d) => d.message);
      err.publicMessage = 'Request body did not match required schema';
      err.help = 'See /api-docs for request body requirements';

      return next(err);
    }

    // Put cleaned/validated data back onto req.body
    req.body = value;
    next();
  };

// Middleware factory for validating route parameters using Joi
const validateParams =
  (schema, options = { abortEarly: false, stripUnknown: true }) =>
  (req, res, next) => {
    const { value, error } = schema.validate(req.params, options);

    if (error) {
      // Error with http-errors
      const err = createError(422, 'Validation failed');

      err.details = error.details.map((d) => d.message);
      err.publicMessage = 'Invalid route parameter';
      err.help = 'See /api-docs for route parameter requirements';

      return next(err);
    }

    // Assign cleaned params back
    req.params = value;

    next();
  };

module.exports = {
  validateBody,
  validateParams,
};
