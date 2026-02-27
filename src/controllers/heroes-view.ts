/* ***************************
 *  src/controllers/heroes-view.ts
 * ************************** */

import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

import { connectToDatabase } from '../db/connection';

// Render All Heroes - GET /heroes
export const renderHeroesIndex = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const db = await connectToDatabase();
    const heroes = await db.collection('heroes').find({}).toArray();

    res.status(200).render('heroes/index', {
      pageTitle: 'Explore Heroes',
      heroes,
    });
  } catch (_error) {
    const err = createError(500, 'Server error');
    (err as any).publicMessage = 'Something went wrong while fetching heroes';
    (err as any).help = 'Try again later.';
    next(err);
  }
};