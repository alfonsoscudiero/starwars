/* ***************************
 *  src/routes/heroes-view.ts
 * ************************** */

import { Router } from 'express';
import * as heroesController from '../controllers/heroes-view';
import { requireAuth } from '../middlewares/require-auth';

const router = Router();

// Public route
router.get('/', heroesController.renderHeroesIndex);

// Protected route example
router.get('/manage', requireAuth, heroesController.renderHeroesIndex);

export default router;