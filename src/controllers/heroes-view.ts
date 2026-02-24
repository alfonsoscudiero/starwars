/* ***************************
 *  src/controllers/heroes-view.ts
 * ************************** */
import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

// MongoDB ObjectId utility and database connection
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db/connection.js';

// Reusable Request Body Type
type HeroInput = {
  firstName: string;
  lastName: string | null;
  species: string;
  role: string;
  homeWorld: string | null;
  weapon: string;
  powerLevel: number;
};

// Reusable Async Handler Type
type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Route params for endpoints using :id
type IdParams = { id: string };

// Capitalization
const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Normalize payload into DB shape
const toHeroDoc = (value: HeroInput) => ({
  firstName: capitalize(value.firstName),
  lastName: value.lastName ? capitalize(value.lastName) : null,
  species: capitalize(value.species),
  role: capitalize(value.role),
  homeWorld:
    value.homeWorld === null || value.homeWorld === 'unknown'
      ? value.homeWorld
      : capitalize(value.homeWorld),
  weapon: capitalize(value.weapon),
  powerLevel: value.powerLevel,
});

// Render All Heroes - GET/heroes
export const renderHeroesIndex: AsyncHandler = async (_req, res, next) => {
  try {
    const db = await connectToDatabase();
    const heroes = await db.collection('heroes').find({}).toArray();
    res.status(200).render('heroes/index', {
      pageTitle: 'Explore Heroes',
      heroes,
      user: null, // public user (no auth)
    });
  } catch (error) {
    const err = createError(500, 'Server error');
    (err as any).publicMessage = 'Something went wrong while fetching heroes';
    (err as any).help = 'Try again later. See /api-docs';
    next(err);
  }
};
