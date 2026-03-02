import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../css/Cart.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Add some delicious items to get started!</p>
          <a href="/" className="continue-shopping-btn">Continue Shopping</a>
        </div>
      </div>
    );
  }

  const total = getCartTotal();
  const tax = (total * 0.0825).toFixed(2); // 8.25% tax rate
  const grandTotal = (parseFloat(total) + parseFloat(tax)).toFixed(2);

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="item-details">
              <h3>{item.item}</h3>
              <p className="item-price">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
              
              {Object.keys(item.modifiers).length > 0 && (
                <div className="item-modifiers">
                  {Object.entries(item.modifiers).map(([key, values]) => (
                    values.length > 0 && (
                      <p key={key} className="modifier-text">
                        <strong>{key}:</strong> {values.join(', ')}
                      </p>
                    )
                  ))}
                </div>
              )}
            </div>

            <div className="item-quantity">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1, item.modifiers)}
                className="qty-btn"
              >
                −
              </button>
              <span className="qty-display">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1, item.modifiers)}
                className="qty-btn"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.id, item.modifiers)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (8.25%):</span>
          <span>${tax}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${grandTotal}</span>
        </div>
      </div>

      <div className="cart-actions">
        <a href="/" className="continue-shopping-btn">Continue Shopping</a>
        <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
}
