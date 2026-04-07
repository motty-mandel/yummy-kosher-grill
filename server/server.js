import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders.js';
import printerRouter from './routes/printer.js';
import paymentRouter from './routes/payment.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Allow multiple origins for development and production
const allowedOrigins = [
  'http://localhost:3000',      // Local development
  'http://localhost:5000',      // Local development
  'http://127.0.0.1:3000',      // Local development
  'http://127.0.0.1:5000',      // Local development
  process.env.FRONTEND_URL,      // Production frontend (set in environment variables)
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // For now, allow all origins but log them
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/printer', printerRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
