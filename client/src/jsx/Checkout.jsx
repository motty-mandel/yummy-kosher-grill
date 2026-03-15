import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../css/Checkout.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api';

export default function Checkout() {
  const navigate = useNavigate();
  const {
    cartItems,
    getCartTotal,
    orderInfo,
    updateOrderInfo,
    updateCustomerInfo,
    updateFulfillmentDetails,
    clearCart,
  } = useContext(CartContext);

  const [step, setStep] = useState(1); // 1: fulfillment, 2: details, 3: review
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState(null);
  const [orderError, setOrderError] = useState(null);

  const handleFulfillmentChange = (type) => {
    updateOrderInfo({ fulfillmentType: type });
  };

  const handleCustomerInfoChange = (field, value) => {
    updateCustomerInfo({ [field]: value });
  };

  const handleDetailsChange = (field, value) => {
    updateFulfillmentDetails(orderInfo.fulfillmentType, { [field]: value });
  };

  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);
      setOrderError(null);

      // Validate required fields
      if (!orderInfo.customerInfo.name || !orderInfo.customerInfo.phone) {
        setOrderError('Please fill in all required fields');
        return;
      }

      if (
        orderInfo.fulfillmentType === 'eatIn' &&
        !orderInfo.eatInDetails.tableNumber
      ) {
        setOrderError('Please enter a table number');
        return;
      }

      if (
        orderInfo.fulfillmentType === 'pickup' &&
        !orderInfo.pickupDetails.pickupTime
      ) {
        setOrderError('Please select a pickup time');
        return;
      }

      if (orderInfo.fulfillmentType === 'delivery') {
        if (
          !orderInfo.deliveryDetails.address ||
          !orderInfo.deliveryDetails.city ||
          !orderInfo.deliveryDetails.zip ||
          !orderInfo.deliveryDetails.phone ||
          !orderInfo.deliveryDetails.deliveryTime
        ) {
          setOrderError('Please fill in all delivery details');
          return;
        }
      }

      const total = getCartTotal();
      const tax = (total * 0.0825).toFixed(2);
      const grandTotal = (parseFloat(total) + parseFloat(tax)).toFixed(2);

      const orderPayload = {
        items: cartItems,
        customerInfo: orderInfo.customerInfo,
        fulfillmentType: orderInfo.fulfillmentType,
        eatInDetails: orderInfo.eatInDetails,
        pickupDetails: orderInfo.pickupDetails,
        deliveryDetails: orderInfo.deliveryDetails,
        subtotal: total,
        tax: parseFloat(tax),
        total: parseFloat(grandTotal),
      };

      // Save order to backend
      const orderResponse = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to save order');
      }

      const orderResult = await orderResponse.json();
      const orderNumber = orderResult.order.orderNumber;

      // Print receipt
      const printPayload = {
        order: orderPayload,
        orderNumber: orderNumber,
      };

      const printResponse = await fetch(`${API_URL}/printer/receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printPayload),
      });

      if (!printResponse.ok) {
        console.warn('Printer not connected, but order was saved');
      }

      // Success!
      setOrderMessage(
        `Order #${orderNumber} placed successfully! Redirecting...`
      );

      // Clear cart and redirect after 2 seconds
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 2000);
    } catch (error) {
      setOrderError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = getCartTotal();
  const tax = (total * 0.0825).toFixed(2);
  const grandTotal = (parseFloat(total) + parseFloat(tax)).toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h1>Checkout</h1>

        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Fulfillment</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Details</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Review</div>
          </div>
        </div>

        {/* Step 1: Fulfillment Type */}
        {step === 1 && (
          <div className="checkout-step">
            <h2>How would you like your order?</h2>
            <div className="fulfillment-options">
              <div
                className={`fulfillment-option ${orderInfo.fulfillmentType === 'eatIn' ? 'selected' : ''}`}
                onClick={() => handleFulfillmentChange('eatIn')}
              >
                <div className="option-icon">🍽️</div>
                <h3>Eat In</h3>
                <p>Enjoy your meal at our restaurant</p>
              </div>

              <div
                className={`fulfillment-option ${orderInfo.fulfillmentType === 'pickup' ? 'selected' : ''}`}
                onClick={() => handleFulfillmentChange('pickup')}
              >
                <div className="option-icon">🛍️</div>
                <h3>Pickup</h3>
                <p>Pick up your order at our location</p>
              </div>

              <div
                className={`fulfillment-option ${orderInfo.fulfillmentType === 'delivery' ? 'selected' : ''}`}
                onClick={() => handleFulfillmentChange('delivery')}
              >
                <div className="option-icon">🚗</div>
                <h3>Delivery</h3>
                <p>We'll deliver your order</p>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="next-btn">
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Customer Info & Fulfillment Details */}
        {step === 2 && (
          <div className="checkout-step">
            <h2>Order Details</h2>

            {/* Customer Information */}
            <div className="form-section">
              <h3>Your Information</h3>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={orderInfo.customerInfo.name}
                  onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={orderInfo.customerInfo.phone}
                  onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                  placeholder="(210) 123-4567"
                  required
                />
              </div>
            </div>

            {/* Fulfill Specific Details */}
            {orderInfo.fulfillmentType === 'eatIn' && (
              <div className="form-section">
                <h3>Dine In Details</h3>
                <div className="form-group">
                  <label>Table Number *</label>
                  <input
                    type="number"
                    value={orderInfo.eatInDetails.tableNumber}
                    onChange={(e) => handleDetailsChange('tableNumber', e.target.value)}
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
              </div>
            )}

            {orderInfo.fulfillmentType === 'pickup' && (
              <div className="form-section">
                <h3>Pickup Details</h3>
                <div className="form-group">
                  <label>Preferred Pickup Time *</label>
                  <input
                    type="time"
                    value={orderInfo.pickupDetails.pickupTime}
                    onChange={(e) => handleDetailsChange('pickupTime', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {orderInfo.fulfillmentType === 'delivery' && (
              <div className="form-section">
                <h3>Delivery Details</h3>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    value={orderInfo.deliveryDetails.address}
                    onChange={(e) => handleDetailsChange('address', e.target.value)}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={orderInfo.deliveryDetails.city}
                      onChange={(e) => handleDetailsChange('city', e.target.value)}
                      placeholder="San Antonio"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip Code *</label>
                    <input
                      type="text"
                      value={orderInfo.deliveryDetails.zip}
                      onChange={(e) => handleDetailsChange('zip', e.target.value)}
                      placeholder="78204"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Delivery Phone Number *</label>
                  <input
                    type="tel"
                    value={orderInfo.deliveryDetails.phone}
                    onChange={(e) => handleDetailsChange('phone', e.target.value)}
                    placeholder="(210) 123-4567"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Delivery Time *</label>
                  <input
                    type="time"
                    value={orderInfo.deliveryDetails.deliveryTime}
                    onChange={(e) => handleDetailsChange('deliveryTime', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Special Instructions</label>
                  <textarea
                    value={orderInfo.deliveryDetails.specialInstructions}
                    onChange={(e) => handleDetailsChange('specialInstructions', e.target.value)}
                    placeholder="Gate code, building notes, etc."
                    rows="3"
                  />
                </div>
              </div>
            )}

            <div className="checkout-buttons">
              <button onClick={() => setStep(1)} className="back-btn">
                Back
              </button>
              <button onClick={() => setStep(3)} className="next-btn">
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Review */}
        {step === 3 && (
          <div className="checkout-step">
            <h2>Review Your Order</h2>

            <div className="review-section">
              <h3>Order Summary</h3>
              <div className="review-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="review-item">
                    <div className="item-details">
                      <p className="item-name">{item.item}</p>
                      {Object.keys(item.modifiers).length > 0 && (
                        <p className="item-modifiers">
                          {Object.entries(item.modifiers)
                            .map(([key, values]) => (values.length > 0 ? `${key}: ${values.join(', ')}` : null))
                            .filter(Boolean)
                            .join(' | ')}
                        </p>
                      )}
                    </div>
                    <div className="item-quantity">Qty: {item.quantity}</div>
                    <div className="item-price">
                      ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Tax (8.25%):</span>
                  <span>${tax}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Grand Total:</span>
                  <span>${grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="review-section">
              <h3>Delivery Information</h3>
              <p><strong>Name:</strong> {orderInfo.customerInfo.name}</p>
              <p><strong>Phone:</strong> {orderInfo.customerInfo.phone}</p>
              {orderInfo.customerInfo.email && (
                <p><strong>Email:</strong> {orderInfo.customerInfo.email}</p>
              )}
              <p>
                <strong>Fulfillment Type:</strong>{' '}
                {orderInfo.fulfillmentType === 'eatIn'
                  ? 'Eat In'
                  : orderInfo.fulfillmentType === 'pickup'
                  ? 'Pickup'
                  : 'Delivery'}
              </p>

              {orderInfo.fulfillmentType === 'eatIn' && (
                <p><strong>Table Number:</strong> {orderInfo.eatInDetails.tableNumber}</p>
              )}

              {orderInfo.fulfillmentType === 'pickup' && (
                <p><strong>Pickup Time:</strong> {orderInfo.pickupDetails.pickupTime}</p>
              )}

              {orderInfo.fulfillmentType === 'delivery' && (
                <>
                  <p>
                    <strong>Address:</strong> {orderInfo.deliveryDetails.address}, {orderInfo.deliveryDetails.city}{' '}
                    {orderInfo.deliveryDetails.zip}
                  </p>
                  <p><strong>Delivery Phone:</strong> {orderInfo.deliveryDetails.phone}</p>
                  <p><strong>Delivery Time:</strong> {orderInfo.deliveryDetails.deliveryTime}</p>
                  {orderInfo.deliveryDetails.specialInstructions && (
                    <p><strong>Special Instructions:</strong> {orderInfo.deliveryDetails.specialInstructions}</p>
                  )}
                </>
              )}
            </div>

            <div className="checkout-buttons">
              <button onClick={() => setStep(2)} className="back-btn">
                Back
              </button>
              <button 
                onClick={handlePlaceOrder}
                className="place-order-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>

            {orderMessage && (
              <div className="message success-message">
                ✓ {orderMessage}
              </div>
            )}

            {orderError && (
              <div className="message error-message">
                ✗ {orderError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <div className="summary-items">
          {cartItems.map((item, index) => (
            <div key={index} className="summary-item">
              <div className="summary-item-name">{item.item}</div>
              <div className="summary-item-price">
                ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="summary-divider"></div>
        <div className="summary-total">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="summary-total">
          <span>Tax:</span>
          <span>${tax}</span>
        </div>
        <div className="summary-grand-total">
          <span>Total:</span>
          <span>${grandTotal}</span>
        </div>
      </div>
    </div>
  );
}
