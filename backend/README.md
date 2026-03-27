# Donations backend (prototype)

This backend converts donor amounts entered in USD to UGX and exposes a simple `POST /api/donate` endpoint that returns the UGX amount and a provider-specific response.

Quick start

1. Copy `.env.example` to `.env` and set any provider keys.
2. Install dependencies and run:

```bash
cd "e:\My Projects\Creation Steppers\html pages\backend"
npm install
npm start
```

API

- `POST /api/donate` JSON body:

```
{
  "amountUSD": 10,
  "method": "card" | "mtn" | "airtel",
  "donor": { "name": "...", "email": "...", "phone": "..." }
}
```

Response contains `amountUGX` (rounded) and `result` with adapter-specific data.

Next steps for production

- Implement a real card provider integration (Stripe/PayPal) in `adapters/card.js`.
- Integrate MTN MOMO and Airtel Money server-side APIs in `adapters/mtn.js` and `adapters/airtel.js`.
- Add webhook handlers to confirm payments before crediting donations.
- Secure endpoints, validate inputs and log transactions in a database.

Local testing tips

- Start the server: run `npm install` then `npm start` inside the `backend` folder.
- Use `.env` to set `STRIPE_SECRET` (test key) to enable Checkout.
- For MTN/Airtel production testing, get sandbox credentials from each provider and set the corresponding env vars in `.env` as shown in `.env.example`.

Webhooks & transaction logging

- The backend now logs donation attempts to a local SQLite DB at `backend/data/donations.db`.
- When a donation is requested the server inserts a `pending`/`requested` record and updates the record after provider responses.
- For Stripe, configure `STRIPE_WEBHOOK_SECRET` and expose `/webhook` (or use `stripe listen` during development) to receive `checkout.session.completed` events. The webhook handler will mark matching donations `completed`.

Database file location: `backend/data/donations.db`

If you need me to add webhook tunnelling instructions (e.g., using `stripe listen` or `ngrok`), I can add them.
