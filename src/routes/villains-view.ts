/* ***************************
 *  src/routes/villains-view.ts
 * ************************** */
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';

import { validateBody, validateParams } from '../middlewares/validator.js';
import {
  characterSchema,
  idParamSchema,
} from '../validators/validator-schema.js';

import * as villainsController from '../controllers/villains-view.js';

// AUTH PLACEHOLDER
const requireAuth = (_req: Request, _res: Response, next: NextFunction): void =>
  next();

const router = Router();

// GET /Villains (public render page)
router.get(
  '/',
  /* #swagger.summary = 'Get all Star Wars Villains' */
  /* #swagger.description = 'Render all Villains stored in the database.' */

  /* #swagger.responses[200] = { description: 'List of Villains' } */
  /* #swagger.responses[500] = { description: 'Internal server error' } */

  villainsController.renderVillainsIndex
);

export default router;
