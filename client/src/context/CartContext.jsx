import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    fulfillmentType: 'pickup', // 'eatIn', 'pickup', 'delivery'
    customerInfo: {
      name: '',
      phone: '',
      email: '',
    },
    eatInDetails: {
      tableNumber: '',
    },
    pickupDetails: {
      pickupTime: '',
    },
    deliveryDetails: {
      address: '',
      city: '',
      zip: '',
      phone: '',
      deliveryTime: '',
      specialInstructions: '',
    },
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity = 1, modifiers = {}) => {
    setCartItems((prevItems) => {
      // Create a unique ID for the item based on item ID and selected modifiers
      const modifierKey = JSON.stringify(modifiers);
      const existingItemIndex = prevItems.findIndex(
        (cartItem) =>
          cartItem.id === item.id && JSON.stringify(cartItem.modifiers) === modifierKey
      );

      if (existingItemIndex > -1) {
        // Item already exists with same modifiers, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // New item or different modifiers
        return [
          ...prevItems,
          {
            ...item,
            quantity,
            modifiers,
          },
        ];
      }
    });
  };

  const removeFromCart = (id, modifiers = {}) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === id && JSON.stringify(item.modifiers) === JSON.stringify(modifiers))
      )
    );
  };

  const updateQuantity = (id, quantity, modifiers = {}) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && JSON.stringify(item.modifiers) === JSON.stringify(modifiers)
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const updateOrderInfo = (updates) => {
    setOrderInfo((prevInfo) => ({
      ...prevInfo,
      ...updates,
    }));
  };

  const updateCustomerInfo = (customerData) => {
    setOrderInfo((prevInfo) => ({
      ...prevInfo,
      customerInfo: {
        ...prevInfo.customerInfo,
        ...customerData,
      },
    }));
  };

  const updateFulfillmentDetails = (fulfillmentType, details) => {
    const detailsKey = `${fulfillmentType}Details`;
    setOrderInfo((prevInfo) => ({
      ...prevInfo,
      [detailsKey]: {
        ...prevInfo[detailsKey],
        ...details,
      },
    }));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        setIsCartOpen,
        orderInfo,
        updateOrderInfo,
        updateCustomerInfo,
        updateFulfillmentDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
