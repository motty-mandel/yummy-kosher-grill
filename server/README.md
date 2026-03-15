# Yummy Kosher Grill - Printer Integration Setup

## Backend Setup

### 1. Install Dependencies

Navigate to the server directory and install packages:

```bash
cd server
npm install
```

### 2. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Or production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

### 3. Configure Printer

The system uses Epson printers with USB connection via the `escpos` library.

**Prerequisites:**
- Epson thermal printer (ESC/POS compatible)
- USB cable connected to the server/computer
- Printer drivers installed

**Supported Epson Models:**
- TM-T88 Series
- TM-T20 Series
- TM-L90 Series
- TM-P20 Series

### 4. Test Printer Connection

Once the backend is running, test your printer connection:

```bash
curl http://localhost:5000/api/printer/test
```

You should see a test receipt print if the printer is connected and configured correctly.

## API Endpoints

### Printer Endpoints

**Test Printer Connection**
```
GET /api/printer/test
```
Prints a test receipt to verify printer connection.

**Print Receipt**
```
POST /api/printer/receipt
Content-Type: application/json

{
  "order": {
    "items": [...],
    "customerInfo": {...},
    "fulfillmentType": "pickup",
    "pickupDetails": {...},
    "subtotal": 25.50,
    "tax": 2.10,
    "total": 27.60
  },
  "orderNumber": 1234
}
```

### Orders Endpoints

**Get All Orders**
```
GET /api/orders
```

**Create New Order**
```
POST /api/orders
Content-Type: application/json

{
  "items": [...],
  "customerInfo": {...},
  "fulfillmentType": "delivery",
  "subtotal": 45.00,
  "tax": 3.71,
  "total": 48.71
}
```

**Get Order by ID**
```
GET /api/orders/:id
```

**Update Order Status**
```
PATCH /api/orders/:id/status
Content-Type: application/json

{
  "status": "completed"
}
```

## Frontend Configuration

The client app will automatically send orders to the backend when the "Place Order" button is clicked.

Make sure the `API_URL` in [Checkout.jsx](../client/src/jsx/Checkout.jsx) matches your backend URL:

```javascript
const API_URL = 'http://localhost:5000/api';
```

## Order Flow

1. **Customer adds items to cart** - Items stored in CartContext
2. **Customer completes checkout form** - Order info captured
3. **Customer clicks "Place Order"** - Order sent to backend
4. **Backend saves order** - Stored in `server/data/orders.json`
5. **Backend triggers printer** - Receipt prints automatically
6. **Customer redirected** - Confirmation and cart cleared

## Data Storage

Orders are stored in `server/data/orders.json`:

```json
{
  "orders": [
    {
      "id": "1234567890",
      "orderNumber": 1234,
      "items": [...],
      "customerInfo": {...},
      "fulfillmentType": "pickup",
      "subtotal": 25.50,
      "tax": 2.10,
      "total": 27.60,
      "status": "pending",
      "createdAt": "2026-03-15T10:30:00.000Z"
    }
  ]
}
```

## Troubleshooting

### Printer Not Found
- Check USB cable connection
- Verify printer is powered on
- Install Epson printer drivers
- Try restarting the server

### Port Already in Use
If port 5000 is already in use, change the `PORT` in `.env`:
```
PORT=5001
```

### CORS Errors
Make sure the backend has CORS enabled (it does by default). If you change the client URL, update the CORS settings in `server.js`.

## Production Deployment

For production, you may want to:
1. Use a real database (MySQL, PostgreSQL, MongoDB) instead of JSON files
2. Add authentication and authorization
3. Use environment variables for sensitive data
4. Implement error logging and monitoring
5. Use a proper thermal printer library that supports network printers
6. Add payment processing integration

## Next Steps

1. Test the printer connection
2. Place a test order through the checkout flow
3. Verify receipt prints correctly
4. Review order data in `server/data/orders.json`
5. Customize receipt format as needed (edit `server/routes/printer.js`)
