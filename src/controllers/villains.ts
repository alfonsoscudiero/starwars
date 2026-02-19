/* ***************************
 *  src/controllers/villains.ts
 * ************************** */
import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

// MongoDB ObjectId utility and database connection
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db/connection';

// Reusable Request Body Type
type VillainInput = {
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
const toVillainDoc = (value: VillainInput) => ({
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

// GET /api/villains
export const getVillains: AsyncHandler = async (_req, res, next) => {
  try {
    const db = await connectToDatabase();
    const villains = await db.collection('villains').find({}).toArray();

    res.status(200).json(villains);
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while fetching villains';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// GET /api/villains/:id
export const getVillainById = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    const villainId = new ObjectId(id);

    const villain = await db.collection('villains').findOne({ _id: villainId });

    if (!villain) {
      const err = createError(404, 'Villain not found');

      err.publicMessage = 'No villain exists with the provided id';
      err.help = 'Use GET /api/villains to list valid ids.';
      return next(err);
    }

    res.status(200).json(villain);
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while fetching the villain';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// POST /api/villains
export const createVillain: AsyncHandler = async (req, res, next) => {
  try {
    // req.body already validated
    const villainData = req.body as VillainInput;
    const newVillain = toVillainDoc(villainData);

    const db = await connectToDatabase();
    const result = await db.collection('villains').insertOne(newVillain);

    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while creating the villain';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// PUT /api/villains/:id
export const updateVillainById = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // req.body already validated
    const villainData = req.body as VillainInput;
    const updatedVillain = toVillainDoc(villainData);

    const db = await connectToDatabase();
    const villainId = new ObjectId(id);

    const result = await db
      .collection('villains')
      .updateOne({ _id: villainId }, { $set: updatedVillain });

    if (result.matchedCount === 0) {
      const err = createError(404, 'Villain not found');

      err.publicMessage = 'No villain exists with the provided id';
      err.help = 'Use GET /api/villains to list valid ids.';
      return next(err);
    }

    res.status(204).send();
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while updating the villain';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};

// DELETE /api/villains/:id
export const deleteVillainById = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    const villainId = new ObjectId(id);

    const result = await db
      .collection('villains')
      .deleteOne({ _id: villainId });

    if (result.deletedCount === 0) {
      const err = createError(404, 'Villain not found');

      err.publicMessage = 'No villain exists with the provided id';
      err.help = 'Use GET /api/villains to list valid ids.';
      return next(err);
    }

    res.status(200).json({
      message: 'Villain deleted successfully',
    });
  } catch (error) {
    const err = createError(500, 'Server error');

    err.publicMessage = 'Something went wrong while deleting the villain';
    err.help = 'Try again later. See /api-docs';
    return next(err);
  }
};
