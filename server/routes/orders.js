import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ordersFile = path.join(__dirname, '../data/orders.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify({ orders: [] }, null, 2));
}

// Get all orders
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(ordersFile, 'utf-8');
    const orders = JSON.parse(data);
    res.json(orders.orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Create new order
router.post('/', (req, res) => {
  try {
    const orderData = req.body;

    // Add order metadata
    const order = {
      id: Date.now().toString(),
      orderNumber: Math.floor(Math.random() * 10000) + 1000,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Read current orders
    const data = fs.readFileSync(ordersFile, 'utf-8');
    const orders = JSON.parse(data);

    // Add new order
    orders.orders.push(order);

    // Write back to file
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  try {
    const data = fs.readFileSync(ordersFile, 'utf-8');
    const orders = JSON.parse(data);
    const order = orders.orders.find((o) => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// Update order status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const data = fs.readFileSync(ordersFile, 'utf-8');
    const orders = JSON.parse(data);
    const order = orders.orders.find((o) => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

    res.json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
