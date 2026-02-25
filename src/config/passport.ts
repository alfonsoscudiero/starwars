/* ***************************
 *  src/config/passport.ts
 * ************************** */
import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import type { VerifyCallback } from 'passport-oauth2';

// Check the current environment
const isProd = process.env.NODE_ENV === 'production';

// Select correct credentials depending on environment
const clientID = isProd
  ? process.env.CLIENT_ID
  : process.env.GITHUB_CLIENT_ID_LOCAL;
const clientSecret = isProd
  ? process.env.CLIENT_SECRET
  : process.env.GITHUB_CLIENT_SECRET_LOCAL;

if (!clientID || !clientSecret) {
  throw new Error('Missing GitHub OAuth env vars (clientID/clientSecret).');
}

// Serialize user into session
passport.serializeUser((user, done) => done(null, user));
// Deserialize user from session
passport.deserializeUser((obj, done) => done(null, obj as any));

// Verify callback
passport.use(
  new GitHubStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: '/auth/github/callback',
    },
    (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      return done(null, profile);
    }
  )
);
