# Stripe Integration Setup Guide

## 1. Get Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up for a free Stripe account (if you don't have one)
3. Navigate to **Developers** → **API keys**
4. Copy your **Publishable key** and **Secret key**

## 2. Update Client-side

**Update `client/src/main.jsx`:**
Replace `pk_test_YOUR_PUBLISHABLE_KEY` with your actual publishable key:
```jsx
const stripePromise = loadStripe('pk_test_YOUR_ACTUAL_KEY_HERE');
```

## 3. Update Server-side

**Create/Update `server/.env` file:**
```
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
PORT=5000
```

## 4. Install Dependencies

**Client:**
```bash
cd client
npm install @stripe/react-stripe-js @stripe/js
```

**Server:**
```bash
cd server
npm install stripe
```

## 5. Test Payment Flow

Use Stripe test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)

## 6. What Changed

### Client-side:
- Replaced manual card input fields with **Stripe's CardElement**
- Card data is now tokenized by Stripe (never sent to your server)
- Sends `stripeTokenId` to backend instead of raw card data

### Server-side:
- New `/api/payment` endpoint processes Stripe charges
- Charges the card using the token
- Creates order only after successful payment
- Stores Stripe charge ID with order

## 7. Security Benefits

✅ PCI Compliance: Raw card data never touches your server
✅ PCI Compliance: Stripe handles card security
✅ Tokenization: Only Stripe token sent to backend
✅ Encryption: All card data encrypted by Stripe
✅ Autofill: Google/browser password managers work with CardElement

## 8. Next Steps (When Ready for Production)

- Replace test keys with **live keys** from Stripe
- Update to use Stripe's **Payment Intents** (more secure than tokens)
- Add database integration to save orders
- Set up webhooks for payment confirmations
- Add refund/cancellation handling
