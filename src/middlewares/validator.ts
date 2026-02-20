/* **************************************
 *  src/middlewares/validator.ts
 * ************************************* */

import type { Request, Response, NextFunction } from 'express';
import type Joi from 'joi';
import createError from 'http-errors';

const defaultOptions = {
  abortEarly: false,
  stripUnknown: true,
};

// Validate req.body
export const validateBody =
  (schema: Joi.Schema, options: Joi.ValidationOptions = defaultOptions) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const { value, error } = schema.validate(req.body, options);

    if (error) {
      const err = createError(422, 'Validation failed');

      (err as any).details = error.details.map((d) => d.message);
      (err as any).publicMessage = 'Request body did not match required schema';
      (err as any).help = 'See /api-docs for request body requirements';

      return next(err);
    }

    req.body = value;
    return next();
  };

// Validate req.params
export const validateParams =
  (schema: Joi.Schema, options: Joi.ValidationOptions = defaultOptions) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const { value, error } = schema.validate(req.params, options);

    if (error) {
      const err = createError(422, 'Validation failed');

      (err as any).details = error.details.map((d) => d.message);
      (err as any).publicMessage = 'Invalid route parameter';
      (err as any).help = 'See /api-docs for route parameter requirements';

      return next(err);
    }

    req.params = value;
    return next();
  };
