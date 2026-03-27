import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import App from './App.jsx';
import Home from './jsx/Home.jsx';
import Checkout from './jsx/Checkout.jsx';

const stripePromise = loadStripe('pk_test_51Pwu4R08itiWYv2Z477neCpMwwy77S6L0S3gEgpfpvJSfvg5uH5CiwdfpW2UArLWWW1rM1UWVKBRmLZiP9bVRWar00bLJ0QJJr'); // Replace with your key

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'checkout',
        element: (
          <Elements stripe={stripePromise}>
            <Checkout />
          </Elements>
        )
      }
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);