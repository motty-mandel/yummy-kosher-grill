# Quick Fix for Item Stock Management Issue

I've added advanced diagnostics tools to help identify the problem. Follow these steps:

## Step 1: Run the Diagnostic Tests

1. Open your browser and go to: `http://localhost:3000/admin/diagnostics`
2. Click the **"Run Diagnostic Tests"** button
3. Wait for all 5 tests to complete
4. Screenshots or copy all the results

## What the tests will check:

✅ **Server Connection** - Is Node.js running?  
✅ **Get Menu Status** - Can we read the menu status?  
✅ **Get Menu Items** - Can we fetch all menu items?  
✅ **Toggle Menu Status** - Can we update the menu status?  
✅ **Toggle Item Stock** - Can we update individual items?  

## Common Issues & Quick Fixes

### All tests FAIL
**Cause**: Server not running  
**Fix**:
```bash
cd server
npm install
npm start
```

### "Get Menu Items" shows items but "Toggle Item Stock" fails
**Cause**: File permissions issue  
**Fix**:
1. Make sure `client/src/menus/menu.json` is writable
2. On Windows: Right-click → Properties → uncheck "Read-only"
3. On Mac/Linux: `chmod 644 client/src/menus/menu.json`

### Tests pass but Admin Dashboard still doesn't work
**Cause**: Browser cache or need to restart dev server  
**Fix**:
1. Clear browser cache: `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Restart the frontend: Stop and run `npm start` in `/client` directory
3. Refresh browser

## Step 2: Check the Console Logs

1. Open Admin Dashboard: `http://localhost:3000/admin`
2. Login with: `admin123`
3. Press `F12` to open Developer Tools → Console tab
4. Try clicking a "Mark as Out of Stock" button
5. Look for logs that show the API response

## Send Debug Information

If tests still fail, please share:
1. Screenshot of diagnostic test results
2. Browser console errors (F12 → Console)
3. Server console output (where you ran `npm start`)

## Manual Testing

If you want to test manually in the browser console:

```javascript
// Test 1: Check if API is accessible
fetch('http://localhost:5000/api/admin/menu-items')
  .then(r => r.json())
  .then(d => console.log('Menu items:', d))
  .catch(e => console.error('Error:', e));

// Test 2: Try updating an item manually
fetch('http://localhost:5000/api/admin/menu-items/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ outOfStock: true })
})
  .then(r => r.json())
  .then(d => console.log('Update response:', d))
  .catch(e => console.error('Error:', e));
```

Paste these in the browser console (F12) and share the results if you need help!
