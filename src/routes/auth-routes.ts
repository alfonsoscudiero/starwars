/* ***************************
 *  src/routes/auth-routes.ts
 * ************************** */
import { Router } from 'express';
import passport from 'passport';

const router = Router();

// GET /auth/github - Start OAuth with GitHub
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

// Logout
router.post('/logout', (req, res, next) => {
  (req as any).logout((err: any) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

export default router;
