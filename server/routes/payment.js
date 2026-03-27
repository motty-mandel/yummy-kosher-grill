import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import ordersRouter from './orders.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Process payment and create order
router.post('/', async (req, res) => {
  try {
    const {
      stripeTokenId,
      subtotal,
      tax,
      total,
      items,
      customerInfo,
      fulfillmentType,
      eatInDetails,
      pickupDetails,
      deliveryDetails,
    } = req.body;

    if (!stripeTokenId || !total) {
      return res.status(400).json({ error: 'Missing payment information' });
    }

    // Charge the card using the token
    const charge = await stripe.charges.create({
      amount: Math.round(parseFloat(total) * 100), // Convert to cents
      currency: 'usd',
      source: stripeTokenId,
      description: `Order from ${customerInfo.name}`,
      receipt_email: customerInfo.email || customerInfo.phone,
    });

    if (charge.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment declined. Please check your card details.' });
    }

    // Payment successful, now create the order
    // Import the orders module to reuse its logic
    const orderData = {
      items,
      customerInfo,
      fulfillmentType,
      eatInDetails,
      pickupDetails,
      deliveryDetails,
      subtotal,
      tax,
      total,
      paymentMethod: 'credit_card',
      stripeChargeId: charge.id,
      chargeStatus: charge.status,
    };

    // TODO: Save order to database
    // For now, generate a simple order number
    const orderNumber = `ORD-${Date.now()}`;

    res.json({
      success: true,
      message: 'Payment processed and order created',
      order: {
        orderNumber,
        chargeId: charge.id,
        amount: charge.amount,
        ...orderData,
      },
    });
  } catch (error) {
    console.error('Payment error:', error);
    
    if (error.type === 'StripeCardError') {
      res.status(400).json({ error: error.message });
    } else if (error.type === 'StripeRateLimitError') {
      res.status(429).json({ error: 'Too many payment attempts. Please try again later.' });
    } else if (error.type === 'StripeInvalidRequestError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Payment processing failed. Please try again.' });
    }
  }
});

export default router;
