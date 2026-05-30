import { Router } from 'express';
import googleAuthController from '../controllers/google.controller';

/**
 * Google OAuth Router
 * Base path: /api/auth/google
 */
const router = Router();

/**
 * GET /api/auth/google
 * Redirect to Google OAuth consent screen
 */
router.get('/', (req, res, next) => googleAuthController.authGoogle(req, res, next));

/**
 * GET /api/auth/google/callback
 * Handle callback from Google OAuth
 */
router.get('/callback', (req, res, next) => googleAuthController.googleCallback(req, res, next));

/**
 * POST /api/auth/google/verify
 * Alternative: Verify Google ID token from frontend
 * This endpoint receives the Google credential token from frontend
 * and returns JWT token for our app
 */
router.post('/verify', (req, res, next) => googleAuthController.verifyGoogleToken(req, res, next));

export default router;
