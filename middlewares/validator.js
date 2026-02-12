/* ***************************
 *  middlewares/validator.js
 * ************************** */
// Middleware factory for validating request bodies using Joi
const validateBody =
  (schema, options = { abortEarly: false, stripUnknown: true }) =>
  (req, res, next) => {
    const { value, error } = schema.validate(req.body, options);

    if (error) {
      return res.status(422).json({
        message: 'Validation failed.',
        details: error.details.map((d) => d.message),
      });
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
      return res.status(422).json({
        message: 'Invalid route parameter.',
        details: error.details.map((d) => d.message),
      });
    }

    // Assign cleaned params back
    req.params = value;

    next();
  };

module.exports = {
  validateBody,
  validateParams,
};
