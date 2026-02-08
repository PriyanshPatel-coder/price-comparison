# Deployment Guide - Fixing Vercel NOT_FOUND Error

## Problem Summary

The NOT_FOUND error occurs because your frontend is trying to call `http://localhost:5000/api/compare`, which doesn't exist in production. The backend Express server runs separately and needs to be accessible from your deployed frontend.

## Solution Options

### Option 1: Deploy Backend Separately (Recommended)

**Best for:** Production apps with separate frontend/backend deployments

1. **Deploy your backend** to a hosting service:
   - Vercel (as serverless functions)
   - Railway
   - Render
   - Heroku
   - AWS/Google Cloud/Azure

2. **Set environment variable in Vercel:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.com`
   - Redeploy your frontend

3. **The frontend will automatically use this URL** thanks to the API configuration we set up.

### Option 2: Convert Backend to Vercel Serverless Functions

**Best for:** Keeping everything in one Vercel project

1. Create `api/` directory in your frontend folder
2. Convert Express routes to Vercel serverless functions
3. Update API configuration to use relative paths

### Option 3: Use Vercel Proxy (Quick Fix)

If your backend is deployed elsewhere, you can proxy API requests through Vercel:

Update `frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Then set `VITE_API_URL=""` (empty) in Vercel environment variables to use relative paths.

## What We Fixed

1. ✅ Created `frontend/src/config/api.js` - Centralized API configuration
2. ✅ Updated `Home.jsx` - Now uses `API_ENDPOINTS.COMPARE`
3. ✅ Updated `SearchBar.jsx` - Now uses `API_ENDPOINTS.SUGGESTIONS`
4. ✅ Environment-aware URLs - Automatically uses correct API URL based on environment

## Testing Locally

1. Make sure your backend is running on `http://localhost:5000`
2. The frontend will automatically use `http://localhost:5000` in development
3. No `.env` file needed for local development (uses defaults)

## Production Deployment Checklist

- [ ] Deploy backend to hosting service
- [ ] Get backend URL (e.g., `https://api.yourdomain.com`)
- [ ] Set `VITE_API_URL` environment variable in Vercel
- [ ] Redeploy frontend
- [ ] Test API calls in production

## Environment Variables Reference

| Variable | Development Default | Production Required |
|----------|-------------------|-------------------|
| `VITE_API_URL` | `http://localhost:5000` | Your deployed backend URL |

