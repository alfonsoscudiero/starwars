/* ***************************
 *  src/routes/auth-routes.ts
 * ************************** 
 * auth-routes.ts handles *logging in/out* via GitHub OAuth
 */

import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = Router();

// GET /auth/github - Login sends the browser to GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub redirects back here after login
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (_req, res) => {
    // Successful authentication
    res.redirect('/');
  }
);

// POST /auth/logout - Logout submits a POST form
router.post(
  '/logout',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await new Promise<void>((resolve, reject) =>
        req.logout((err) => (err ? reject(err) : resolve()))
      );

      await new Promise<void>((resolve, reject) =>
        req.session.destroy((err) => (err ? reject(err) : resolve()))
      );

      res.clearCookie('connect.sid', {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      res.redirect('/');
    } catch (error: unknown) {
      next(error);
    }
  }
);

export default router;
