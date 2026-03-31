# API URL Configuration Guide

## Overview
All API calls now use a centralized configuration file (`client/src/config.js`) that reads from the `VITE_API_URL` environment variable.

## How to Change the API URL

### For Local Development
Edit `client/.env.local`:
```
VITE_API_URL=http://localhost:5000
```

### For Production
Edit `client/.env.local`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### For Other Environments
```
VITE_API_URL=https://api.example.com
```

## What's Been Updated ✅

The following files now use the centralized configuration:

1. **Admin.jsx** - Admin dashboard
   - Menu status toggle
   - Item stock management
   - Menu item fetching

2. **Home.jsx** - Customer menu page
   - Menu open/closed status check

3. **AdminDiagnostics.jsx** - Diagnostic testing page
   - Server health checks
   - API endpoint testing

## File Locations

- **Config file**: `client/src/config.js`
- **Environment file**: `client/.env.local`
- **Example file**: `client/.env.example`

## How It Works

```javascript
// config.js exports these:
export const ADMIN_API_BASE = 'http://localhost:5000/api/admin'
export const API_BASE = 'http://localhost:5000/api'
```

The VITE_API_URL environment variable gets prepended to `/api` and `/api/admin` as needed.

## To Deploy

1. **Set environment variable on your hosting platform:**
   - Railway: Add to env vars
   - Render: Add to env vars
   - Vercel: Add to env vars

2. **Variable name**: `VITE_API_URL`
3. **Variable value**: Your backend URL (e.g., `https://backend-url.onrender.com`)

## Testing

Run the diagnostic tests to verify the API connection:
```
Go to: http://localhost:3000/admin/diagnostics
Click "Run Diagnostic Tests"
```

All 5 tests should pass if configured correctly.

## Rollback (if needed)

If you want to revert to hardcoded localhost, the default fallback is:
```javascript
VITE_API_URL || 'http://localhost:5000'
```

This means if the env var is not set, it defaults to localhost for development.
