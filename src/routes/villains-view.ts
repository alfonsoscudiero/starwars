/* ***************************
 *  src/routes/villains-view.ts
 * ************************** */

import { Router } from 'express';
import * as villainsController from '../controllers/villains-view';
import { requireAuth } from '../middlewares/require-auth';

const router = Router();

// Public
router.get('/', villainsController.renderVillainsIndex);

// Auth-only (optional demo route)
router.get('/manage', requireAuth, villainsController.renderVillainsIndex);

export default router;