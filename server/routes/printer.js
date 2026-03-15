import express from 'express';
import escpos from 'escpos';
import USB from 'escpos-usb';

const router = express.Router();

// Initialize printer connection
let device = null;
let printer = null;

// Test printer connection
router.get('/test', (req, res) => {
  try {
    const device = new USB();
    const printer = new escpos.Printer(device);
    
    device.open(() => {
      printer
        .align('ct')
        .font('b')
        .text('🖨️ Printer Test')
        .feed(1)
        .text('Connected Successfully!')
        .feed(2)
        .cut()
        .close();
      
      res.json({ success: true, message: 'Printer test successful' });
    });

    device.on('error', (err) => {
      res.status(500).json({ success: false, error: 'Printer not found or not connected' });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Print receipt
router.post('/receipt', (req, res) => {
  try {
    const { order, orderNumber } = req.body;

    if (!order) {
      return res.status(400).json({ success: false, error: 'Order data required' });
    }

    const device = new USB();
    const printer = new escpos.Printer(device);

    device.open(() => {
      try {
        // Header
        printer
          .align('ct')
          .font('b')
          .text('YUMMY KOSHER GRILL')
          .font('a')
          .text('15511 Oak Grove Dr. SA, TX')
          .text('(210) 750-6770')
          .feed(1);

        // Order number and date
        printer
          .align('ct')
          .text('='.repeat(40))
          .text(`Order #${orderNumber || 'N/A'}`)
          .text(new Date().toLocaleString())
          .text('='.repeat(40))
          .feed(1);

        // Customer info
        printer
          .align('lt')
          .font('a')
          .text(`Name: ${order.customerInfo.name}`)
          .text(`Phone: ${order.customerInfo.phone}`);

        if (order.customerInfo.email) {
          printer.text(`Email: ${order.customerInfo.email}`);
        }

        // Fulfillment type
        const fulfillmentType =
          order.fulfillmentType === 'eatIn'
            ? 'Dine In'
            : order.fulfillmentType === 'pickup'
            ? 'Pickup'
            : 'Delivery';

        printer
          .feed(1)
          .font('b')
          .text(`${fulfillmentType}`)
          .font('a');

        if (order.fulfillmentType === 'eatIn') {
          printer.text(`Table: ${order.eatInDetails.tableNumber}`);
        } else if (order.fulfillmentType === 'pickup') {
          printer.text(`Pickup Time: ${order.pickupDetails.pickupTime}`);
        } else if (order.fulfillmentType === 'delivery') {
          printer.text(`Address: ${order.deliveryDetails.address}`);
          printer.text(`${order.deliveryDetails.city}, ${order.deliveryDetails.zip}`);
          printer.text(`Delivery Time: ${order.deliveryDetails.deliveryTime}`);
          if (order.deliveryDetails.specialInstructions) {
            printer.text(`Instructions: ${order.deliveryDetails.specialInstructions}`);
          }
        }

        // Items
        printer
          .feed(1)
          .align('lt')
          .text('='.repeat(40))
          .text('ITEMS')
          .text('='.repeat(40));

        order.items.forEach((item) => {
          const itemTotal = (parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2);
          printer
            .text(`${item.item}`)
            .text(`  Qty: ${item.quantity} x $${item.price.replace('$', '')} = $${itemTotal}`);

          if (Object.keys(item.modifiers).length > 0) {
            Object.entries(item.modifiers).forEach(([key, values]) => {
              if (values.length > 0) {
                printer.text(`  ${key}: ${values.join(', ')}`);
              }
            });
          }
          printer.text('');
        });

        // Totals
        const subtotal = order.subtotal.toFixed(2);
        const tax = order.tax.toFixed(2);
        const total = order.total.toFixed(2);

        printer
          .align('ct')
          .text('='.repeat(40))
          .align('rt')
          .text(`Subtotal: $${subtotal}`)
          .text(`Tax (8.25%): $${tax}`)
          .font('b')
          .text(`TOTAL: $${total}`)
          .font('a')
          .feed(2)
          .align('ct')
          .text('Thank you for your order!')
          .text('🙏')
          .feed(2)
          .cut()
          .close();

        res.json({ success: true, message: 'Receipt printed successfully' });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    device.on('error', (err) => {
      res.status(500).json({ success: false, error: 'Printer connection error' });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
