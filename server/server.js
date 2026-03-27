import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders.js';
import printerRouter from './routes/printer.js';
import paymentRouter from './routes/payment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/printer', printerRouter);
app.use('/api/payment', paymentRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
