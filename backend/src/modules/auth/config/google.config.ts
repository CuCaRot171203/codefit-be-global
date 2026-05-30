import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authService from '../services/auth.service';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleUser = profile;
          const email = googleUser.emails?.[0]?.value;
          const displayName = googleUser.displayName || googleUser.username || 'User';
          const avatar = googleUser.photos?.[0]?.value;

          if (!email) {
            return done(new Error('No email provided by Google'), undefined);
          }

          const user = await authService.findOrCreateGoogleUser({
            googleId: googleUser.id,
            email,
            username: displayName,
            avatar,
          });

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await authService.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  console.log('Google OAuth strategy initialized');
}

export default passport;
