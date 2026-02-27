/* ***************************
 *  src/controllers/villains-view.ts
 * ************************** */

import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { connectToDatabase } from '../db/connection';

// Render All Villains - GET /villains
export const renderVillainsIndex = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const db = await connectToDatabase();
    const villains = await db.collection('villains').find({}).toArray();

    res.status(200).render('villains/index', {
      pageTitle: 'Explore Villains',
      villains,
    });
  } catch (_error) {
    const err = createError(500, 'Server error');
    (err as any).publicMessage =
      'Something went wrong while fetching villains';
    (err as any).help = 'Try again later.';
    next(err);
  }
};