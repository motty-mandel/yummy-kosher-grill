# Quick Start Guide

## Getting Started

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Start Backend Server
```bash
npm run dev
```
Server will run on `http://localhost:5000`

### 3. Start Frontend (in another terminal)
```bash
cd client
npm run dev
```
Client will run on `http://localhost:5173`

### 4. Test Printer Connection
Open browser console and run:
```javascript
fetch('http://localhost:5000/api/printer/test')
  .then(r => r.json())
  .then(console.log)
```

Or use curl:
```bash
curl http://localhost:5000/api/printer/test
```

## Workflow

1. Browse menu on home page
2. Add items to cart
3. Click cart icon (top right) to view
4. Click "Checkout" button
5. Select fulfillment type (Eat In, Pickup, or Delivery)
6. Fill in customer info and preferences
7. Review order
8. Click "Place Order"
   - Order saves to backend
   - Receipt prints to Epson printer
   - Order #  confirmation shows
   - Cart clears, redirects to home

## Troubleshooting

**Backend won't start:**
- Port 5000 already in use? Change to different port in `.env`
- Missing node_modules? Run `npm install`

**Printer not printing:**
- Printer connected via USB?
- Run test endpoint to diagnose
- Check printer is powered on
- Driver installed correctly?

**CORS errors:**
- Backend should allow localhost:5173 by default
- If issues, check CORS settings in `server/server.js`

## File Structure

```
server/
├── server.js           # Main Express app
├── package.json        # Dependencies
├── .env               # Configuration
├── routes/
│   ├── orders.js      # Order management API
│   └── printer.js     # Printer integration
└── data/
    └── orders.json    # Saved orders

client/
├── src/
│   ├── jsx/
│   │   ├── Checkout.jsx    # Checkout page
│   │   ├── CartSidebar.jsx # Cart sidebar
│   │   └── ...
│   ├── context/
│   │   └── CartContext.jsx # Cart state management
│   └── css/
│       └── Checkout.css    # Checkout styles
```

## Customization

### Change Receipt Format
Edit `server/routes/printer.js` - look for the printer output section

### Change Backend Port
Edit `server/.env` - change PORT value

### Change Printer Timeout
Some printers need more time. Adjust device timeout in printer.js

### Add More Order Fields
Update CartContext, Checkout form, and printer receipt format

Enjoy! 🍽️
