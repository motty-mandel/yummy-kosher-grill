# Admin Dashboard - Quick Start Guide

## Accessing the Admin Dashboard

1. Navigate to: `http://localhost:3000/admin`
2. Enter the admin password: `admin123`
3. Click "Login"

## Menu Management

### Close/Open the Menu
- Look for the "Menu Status" section at the top
- Click the **"Close Menu"** or **"Open Menu"** button
- When the menu is closed:
  - Customers see a red "Menu Closed" banner
  - Menu items are not displayed
  - Orders cannot be placed

### Manage Item Stock

#### Search for Items
- Use the search box to find items by name
- Results update in real-time

#### Mark Items as Out of Stock
1. Find the item in the list
2. Click **"Mark as Out of Stock"** button
3. The item will:
   - Show as "❌ Out of Stock" with reduced opacity
   - Display an "Out of Stock" badge
   - Prevent customers from ordering it

#### Mark Items as Available
1. Find the item showing as "❌ Out"
2. Click **"Mark as Available"** button
3. The item will immediately appear as orderable

## Important Notes

⚠️ **Change the Password!**
- The current default password is `admin123`
- This is located in `/client/src/jsx/Admin.jsx` on line 20
- IMPORTANT: Change `const ADMIN_PASSWORD = 'admin123';` to a secure password
- Recommendation: Implement proper backend authentication

## Features

✅ Real-time updates - Changes appear immediately on the menu  
✅ Individual item management - Control each item's availability  
✅ Menu-wide control - Open or close the entire menu  
✅ Search functionality - Quickly find items to manage  
✅ Visual indicators - Easy to see what's in/out of stock  
✅ Persistent storage - Changes are saved to menu.json  

## How Menu Status Affects Customers

**When Menu is OPEN:**
- ✅ Customers can see and order all items
- ✅ Out of stock items show a badge but are visible
- ❌ Out of stock items cannot be ordered

**When Menu is CLOSED:**
- ❌ Customers see only the "Menu Closed" banner
- ❌ No menu items are displayed
- ❌ No orders can be placed
- 💡 Perfect for non-business hours or special closures

## Next Steps

1. **Set a secure password** - Change the admin password in Admin.jsx
2. **Add authentication** - Consider implementing JWT or session-based authentication
3. **Implement rate limiting** - Protect the admin endpoints
4. **Add more features** - Consider adding:
   - Inventory tracking
   - Sales statistics
   - Promotions/discounts
   - Item categories management
