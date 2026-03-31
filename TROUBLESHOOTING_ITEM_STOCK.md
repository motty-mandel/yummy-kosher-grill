# Troubleshooting: Manage Item Stock Not Working

I've added comprehensive logging to help identify the issue. Follow these steps:

## Step 1: Check Browser Console
1. Open the Admin Dashboard at `http://localhost:3000/admin`
2. Open Developer Tools: Press `F12` or `Ctrl+Shift+I`
3. Go to the "Console" tab
4. Look for any error messages or logs

## Step 2: Check Server Console
1. Look at your terminal where the Node.js server is running
2. You should see logs when you:
   - Fetch menu items
   - Try to update an item
   - Update menu status

## Common Issues & Solutions

### Issue 1: "Failed to load menu items"
**Cause**: Server is not responding to GET request  
**Solution**:
- Verify server is running: `npm start` in `/server` directory
- Check if port 5000 is available
- Verify the menu.json file exists at: `client/src/menus/menu.json`

### Issue 2: Item doesn't update but no error message
**Cause**: Network request succeeded but file wasn't written  
**Solution**:
- Check file permissions on `client/src/menus/menu.json`
- Make sure the directory is writable
- Try restarting the server

### Issue 3: CORS error in console
**Cause**: Frontend can't connect to backend  
**Solution**:
- Make sure CORS is enabled in server.js (it should be)
- Verify backend is running on `http://localhost:5000`
- Check network tab in Developer Tools to see failed requests

### Issue 4: "Item not found" error
**Cause**: Item ID doesn't match  
**Solution**:
- Open browser console and check the fetched menu items
- Verify the item IDs are strings (they should be "1", "2", etc.)
- Check menu.json to ensure all items have unique IDs

## What to Check

### In Browser Console:
Look for logs like:
```
Response status: 200 Data: {success: true, message: "Item stock status updated"}
```

### In Server Console:
Look for logs like:
```
Updating item 1 to outOfStock: true
Found item: Ara'yes / עראייס, updating from false to true
Successfully updated menu and saved to [path]
```

## Quick Debug Script

Paste this in the browser console to test the API:
```javascript
fetch('http://localhost:5000/api/admin/menu-items')
  .then(r => r.json())
  .then(data => {
    console.log('Menu items:', data);
    console.log('First item:', data[0].items[0]);
  })
  .catch(e => console.error('Error:', e));
```

## Next Steps

1. **Enable logging**: The code now has detailed console.logs
2. **Open Developer Tools**: F12 on your browser
3. **Try updating an item**: Click a "Mark as Out of Stock" button
4. **Share the console output**: Take a screenshot or copy the error messages

If you still have issues, please share:
- Browser console errors (screenshot or text)
- Server console output (screenshot or text)
- Whether the menu.json file is being saved or not

This will help identify exactly where the problem is!
