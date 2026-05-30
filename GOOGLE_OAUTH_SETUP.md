# Google OAuth Login - Setup Guide

## Overview

This guide helps you set up Google OAuth login for CodeFit platform. The implementation supports two OAuth flows:

1. **Frontend Flow (Recommended)**: Frontend receives Google token, sends to backend for verification
2. **Backend Flow**: Backend handles full OAuth redirect flow

---

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** > **Credentials**

### 1.2 Create OAuth 2.0 Client ID

1. Click **Create Credentials**
2. Select **OAuth client ID**
3. Application type: **Web application**
4. Name: `CodeFit Web Client`
5. **Authorized JavaScript origins**:
   - `http://localhost:3000` (for local development)
   - `https://your-domain.com` (for production)
6. **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback` (for local development)
   - `https://your-domain.com/api/auth/google/callback` (for production)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

---

## Step 2: Configure Environment Variables

### Backend (.env)

```bash
# Google OAuth (required)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Callback URL (must match exactly in Google Console)
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
# For production: https://your-domain.com/api/auth/google/callback

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000
# For production: https://your-domain.com
```

### Frontend (.env)

```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:5000
# For production: https://your-domain.com/api

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## Step 3: Install Backend Dependencies

```bash
cd backend
npm install passport passport-google-oauth20
npm install -D @types/passport @types/passport-google-oauth20
npm run build
```

---

## Step 4: Install Frontend Dependencies

```bash
cd codefit-fe
npm install @react-oauth/google
```

---

## Step 5: Test Locally

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd codefit-fe
npm run dev
```

### Test Flow
1. Open `http://localhost:3000/dang-nhap`
2. Click "Đăng nhập với Google"
3. Complete Google sign-in
4. Verify redirect to dashboard

---

## Step 6: Deploy to VPS

### Pull Latest Code
```bash
# SSH to your VPS
ssh user@your-vps-ip

# Navigate to project
cd /path/to/codefit

# Pull latest code
git pull origin main
```

### Update Backend

```bash
cd backend

# Update environment variables
nano .env
# Add:
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
# FRONTEND_URL=https://your-domain.com

# Install dependencies
npm install

# Build
npm run build

# Restart service (PM2)
pm2 restart codefit-backend
# or
pm2 restart all
```

### Update Frontend

```bash
cd codefit-fe

# Update environment variables
nano .env
# Add:
# VITE_API_BASE_URL=https://your-domain.com/api
# VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Install dependencies
npm install

# Build for production
npm run build
```

### Update Nginx/Caddy Configuration

Ensure your web server correctly proxies requests:

**Nginx**:
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/codefit/codefit-fe/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Update Google OAuth Redirect URIs

In Google Cloud Console, update Authorized redirect URIs:
- Add `https://your-domain.com/api/auth/google/callback`

---

## Deployment Commands (Safe - No Data Loss)

```bash
#!/bin/bash
# deploy.sh - Safe deployment script

set -e

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Building Backend ==="
cd backend
npm install
npm run build

echo "=== Building Frontend ==="
cd ../codefit-fe
npm install
npm run build

echo "=== Restarting Backend Service ==="
pm2 restart codefit-backend || pm2 restart all

echo "=== Deployment Complete ==="
echo "Remember to update Google OAuth redirect URIs if domain changed!"
```

---

## Database Changes

**No database migration required.**

The existing `User` model already has all fields needed:
- `email` (unique) - stores Google email
- `username` - stores Google display name
- `avatar` - stores Google profile picture

When a user logs in with Google for the first time:
1. System checks if email exists
2. If not found, creates new user with Google data
3. If found, updates avatar if changed
4. Returns JWT token as usual

---

## Troubleshooting

### Google Button Not Showing
- Check if `VITE_GOOGLE_CLIENT_ID` is set in frontend `.env`
- Restart frontend dev server after adding env variable

### OAuth Flow Fails
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CALLBACK_URL` are correct
2. Check Google Cloud Console has correct redirect URIs
3. Ensure `FRONTEND_URL` matches your frontend URL

### CORS Error
Ensure backend CORS configuration allows your frontend origin:
```javascript
// In server.ts
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

### Token Verification Fails
- Clear browser localStorage and try again
- Check JWT_SECRET is consistent between environments

---

## Security Notes

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Rotate secrets regularly** - Especially `GOOGLE_CLIENT_SECRET`
3. **Use HTTPS in production** - OAuth requires secure origins
4. **Validate redirect URIs** - Prevent OAuth redirect attacks
