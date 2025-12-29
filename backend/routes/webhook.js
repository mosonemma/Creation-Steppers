const express = require('express');
const router = express.Router();
const db = require('../db');
const stripe = process.env.STRIPE_SECRET ? require('stripe')(process.env.STRIPE_SECRET) : null;

// Note: this route expects raw body; mounted from server.js with express.raw
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) return res.status(400).send('Webhook not configured');

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed', err && err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // We used customer_email and description; session.client_reference_id could be used if set
    const sessionId = session.id;
    // Try to find matching donation by metadata (we stored reference in DB metadata earlier)
    // For now, update by matching email + amount
    try {
      const email = session.customer_email;
      const amountUSD = (session.amount_total || 0) / 100.0;
      // Simple heuristic: find pending donation with same email and USD amount
      const row = db.db.prepare('SELECT * FROM donations WHERE donor_email = ? AND amount_usd = ? AND status = ? ORDER BY created_at DESC LIMIT 1').get(email, amountUSD, 'requested');
      if (row) {
        db.updateDonation(row.reference, { status: 'completed', provider: 'stripe', metadata: JSON.stringify({ sessionId }) });
      }
    } catch (e) {
      console.warn('Webhook DB update error', e && e.message);
    }
  }

  res.json({ received: true });
});

module.exports = router;
