/* ********************************
 *  src/middlewares/require-auth.ts
 * **********************************
 * - require-auth.ts handles *authorization* for app routes
 */

import type { Request, Response, NextFunction } from 'express';

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const isAuthed = req.isAuthenticated?.() ?? false;
  if (isAuthed) {
    return next();
  }
  return res.redirect('/login');
}
