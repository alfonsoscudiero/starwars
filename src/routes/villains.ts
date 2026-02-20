import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';

import { validateBody, validateParams } from '../middlewares/validator';
import { characterSchema, idParamSchema } from '../validators/validator-schema';

import * as villainsController from '../controllers/villains';

// AUTH PLACEHOLDER (do not implement yet)
const requireAuth = (_req: Request, _res: Response, next: NextFunction): void =>
  next();

const router = Router();

// GET /api/villains
router.get('/', villainsController.getVillains);

// GET /api/villains/:id
router.get(
  '/:id',
  validateParams(idParamSchema),
  villainsController.getVillainById
);

// POST /api/villains
router.post(
  '/',
  requireAuth,
  validateBody(characterSchema),
  villainsController.createVillain
);

// PUT /api/villains/:id
router.put(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  validateBody(characterSchema),
  villainsController.updateVillainById
);

// DELETE /api/villains/:id
router.delete(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  villainsController.deleteVillainById
);

export default router;
