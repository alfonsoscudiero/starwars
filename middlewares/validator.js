/* ***************************
 *  middlewares/validator.js
 * ************************** */
// Higher-order middleware factory for validating request bodies using Joi
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

module.exports = { validateBody };
