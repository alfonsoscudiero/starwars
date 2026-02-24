/* ***************************
 *  src/routes/heroes-view.ts
 * ************************** */
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';

import { validateBody, validateParams } from '../middlewares/validator.js';
import {
  characterSchema,
  idParamSchema,
} from '../validators/validator-schema.js';

import * as heroesController from '../controllers/heroes-view.js';

// AUTH PLACEHOLDER
const requireAuth = (_req: Request, _res: Response, next: NextFunction): void =>
  next();

const router = Router();

// GET /heroes (public render page)
router.get(
  '/',
  /* #swagger.summary = 'Get all Star Wars heroes' */
  /* #swagger.description = 'Render all heroes stored in the database.' */

  /* #swagger.responses[200] = { description: 'List of heroes' } */
  /* #swagger.responses[500] = { description: 'Internal server error' } */

  heroesController.renderHeroesIndex
);

export default router;
