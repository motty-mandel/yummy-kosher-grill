# Render Deployment & CORS Configuration Guide

## The CORS Error (Fixed)
The error you saw:
```
Access to fetch at 'https://yummy-kosher-grill.onrender.com/api/admin/menu-status' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

This is because the backend server needs CORS headers configured. ✅ **This is now fixed in server.js**

## Backend Setup on Render

### Step 1: Update Server Environment Variable on Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service
3. Click "Environment" in the left sidebar
4. Add this environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: The URL where your frontend is deployed (e.g., `https://your-frontend.onrender.com`)

If you're testing locally:
   - **Key**: `FRONTEND_URL`
   - **Value**: `http://localhost:3000`

### Step 2: Redeploy Backend

1. In Render dashboard, click "Deployments"
2. Click "Deploy latest commit" (or any recent commit will trigger redeploy)
3. Wait for deployment to complete

The backend will now:
- Allow requests from your frontend
- Allow localhost for local development
- Include proper CORS headers in responses

## Frontend Setup on Render (Optional)

If you're deploying the frontend to Render:

1. Create a new Static Site service on Render
2. Connect your Git repository
3. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com`

4. Build command: `cd client && npm install && npm run build`
5. Publish directory: `client/dist`

## Local Development Setup

### Backend
```bash
# In /server directory
npm start
# Runs on http://localhost:5000
```

### Frontend  
```bash
# In /client directory
npm start
# Runs on http://localhost:3000
```

The config.js will automatically:
- Use `http://localhost:5000` when `VITE_API_URL` is not set
- Use the `VITE_API_URL` value when it's set in `.env.local`

## Testing the Fix

### Local Verification
1. Stop your backend: `Ctrl+C` in the terminal running it
2. Update `client/.env.local`:
   ```
   VITE_API_URL=http://localhost:5000
   ```
3. Restart backend: `npm start` in `/server`
4. Restart frontend: `npm start` in `/client`
5. Go to `http://localhost:3000/admin/diagnostics`
6. Run tests - all 5 should pass ✅

### Production Verification
1. Go to `https://your-frontend-url.com/admin/diagnostics`
2. Run tests - all 5 should pass ✅
3. Admin dashboard should work without CORS errors

## Environment Variables Reference

| Variable | Backend | Frontend | Purpose |
|----------|---------|----------|---------|
| `FRONTEND_URL` | ✅ | | Tells backend which frontend origins to allow |
| `VITE_API_URL` | | ✅ | Tells frontend which backend URL to use |

## Troubleshooting

### Still Getting CORS Error?
1. Make sure you redeployed the backend after adding `FRONTEND_URL`
2. Wait 2-3 minutes for Render to fully restart
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check Render deployment logs for errors

### Backend Logs on Render
1. Go to Render dashboard → Your service
2. Click "Logs" tab
3. Look for CORS configuration logging

### Test with curl (Render Backend)
```bash
curl -X GET https://your-backend.onrender.com/api/health

# Should return: {"status":"Server is running"}
```

If this fails, backend is down or unreachable.

## Deployment Checklist

- [ ] Backend environment variable `FRONTEND_URL` is set
- [ ] Backend is redeployed in Render
- [ ] Frontend environment variable `VITE_API_URL` is set
- [ ] Frontend is redeployed (or rebuilt locally)
- [ ] Browser cache is cleared
- [ ] Tests pass at `/admin/diagnostics`
