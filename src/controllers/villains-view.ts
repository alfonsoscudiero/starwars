/* ***************************
 *  src/controllers/villains-view.ts
 * ************************** */
import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

// MongoDB ObjectId utility and database connection
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db/connection.js';

// Reusable Request Body Type
type villainInput = {
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
type idParams = { id: string };

// Capitalization
const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Normalize payload into DB shape
const toVillainDoc = (value: villainInput) => ({
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

// Render All Villains - GET/Villaines
export const renderVillainsIndex: AsyncHandler = async (_req, res, next) => {
  try {
    const db = await connectToDatabase();
    const villains = await db.collection('villains').find({}).toArray();
    res.status(200).render('villains/index', {
      pageTitle: 'Explore Villains',
      villains,
      user: null, // public user (no auth)
    });
  } catch (error) {
    const err = createError(500, 'Server error');
    (err as any).publicMessage = 'Something went wrong while fetching villains';
    (err as any).help = 'Try again later. See /api-docs';
    next(err);
  }
};
