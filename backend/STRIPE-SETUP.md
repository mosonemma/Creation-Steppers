# Stripe setup and test mode

1. Create a Stripe account and get your test secret key from the Dashboard (starts with `sk_test_...`).
2. Copy `.env.example` to `.env` and set `STRIPE_SECRET=sk_test_...`.
3. Start the backend. When the frontend calls `/api/donate` with method `card`, the server will create a Stripe Checkout session and return `result.sessionUrl`.
4. Use Stripe test card numbers on the Checkout page. Commonly used test card: `4242 4242 4242 4242` with any valid CVC and future expiry.
5. For webhooks (optional): configure `stripe listen` or a webhook endpoint to confirm payments server-side.

Notes:
- The sample `card` adapter uses `stripe.checkout.sessions.create`. Make sure `STRIPE_SUCCESS_URL` and `STRIPE_CANCEL_URL` are set in `.env` to return the donor to your site.
- In production, replace test keys with live keys and secure your webhook endpoint.

Important security note

- Never share your full card numbers (PAN), CVC, or other sensitive cardholder data in chat or email. I cannot accept or store your card numbers.
- For live card processing, use Stripe Checkout or Elements so card data is sent directly to Stripe and never touches your server.
- Merchant receiver numbers (MTN/Airtel MSISDN) and API keys should be stored locally in `.env` and never pasted into public chat. Use the `MTN_PAYEE_NUMBER` / `AIRTEL_PAYEE_NUMBER` variables in `.env` to set the numbers that receive payments.
