import { Request, Response, NextFunction } from 'express';
import passport from '../config/google.config';
import authService from '../services/auth.service';

/**
 * GoogleAuthController - Xử lý Google OAuth flow
 */
class GoogleAuthController {
  /**
   * Redirect to Google OAuth
   * GET /api/auth/google
   */
  authGoogle = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })(req, res, next);
  };

  /**
   * Google OAuth Callback
   * GET /api/auth/google/callback
   */
  googleCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dang-nhap?error=google_auth_failed`,
    }, (err: any, user: any) => {
      if (err) {
        console.error('Google OAuth error:', err);
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dang-nhap?error=google_auth_failed`
        );
      }

      if (!user) {
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dang-nhap?error=no_user_data`
        );
      }

      const authResponse = authService.formatUserResponse(user);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = new URL(`${frontendUrl}/auth/google/success`);
      redirectUrl.searchParams.set('token', authResponse.token);
      redirectUrl.searchParams.set('user', JSON.stringify(authResponse.user));

      return res.redirect(redirectUrl.toString());
    })(req, res, next);
  };

  /**
   * Handle Google ID token from frontend
   * POST /api/auth/google/verify
   * Alternative flow: Frontend receives credential, sends to backend for verification
   */
  verifyGoogleToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { googleToken } = req.body;

      if (!googleToken) {
        res.status(400).json({ message: 'Google token is required' });
        return;
      }

      // Verify Google token with Google's API
      const https = await import('https');
      const googleApiUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`;

      const response = await new Promise<any>((resolve, reject) => {
        https.get(googleApiUrl, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch {
              reject(new Error('Invalid response from Google'));
            }
          });
        }).on('error', reject);
      });

      if (response.error) {
        res.status(401).json({ message: 'Invalid Google token', error: response.error });
        return;
      }

      const { email, name, picture, sub: googleId } = response;

      if (!email) {
        res.status(400).json({ message: 'No email in Google token' });
        return;
      }

      const authResponse = await authService.findOrCreateGoogleUser({
        googleId,
        email,
        username: name || email.split('@')[0],
        avatar: picture,
      });

      res.json({
        success: true,
        data: authResponse,
      });
    } catch (error: any) {
      console.error('Google token verification error:', error);
      res.status(500).json({ message: 'Failed to verify Google token', error: error.message });
    }
  };
}

export default new GoogleAuthController();
