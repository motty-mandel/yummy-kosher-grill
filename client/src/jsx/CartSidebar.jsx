import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../css/CartSidebar.css';

export default function CartSidebar() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, isCartOpen, setIsCartOpen } = useContext(CartContext);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const total = getCartTotal();
  const tax = (total * 0.0825).toFixed(2);
  const grandTotal = (parseFloat(total) + parseFloat(tax)).toFixed(2);

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-sidebar-btn" onClick={() => setIsCartOpen(false)}>×</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-sidebar">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-sidebar-item">
                  <div className="item-info">
                    <h4>{item.item}</h4>
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

                  <div className="item-controls">
                    <div className="quantity-selector">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.modifiers)}
                        className="qty-btn"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
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
                </div>
              ))}
            </div>

            <div className="cart-summary-sidebar">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${tax}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${grandTotal}</span>
              </div>
            </div>

            <div className="sidebar-actions">
              <button onClick={() => clearCart()} className="clear-btn">Clear Cart</button>
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="checkout-btn"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
