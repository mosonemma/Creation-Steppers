// Card payment adapter — supports Stripe Checkout when `STRIPE_SECRET` is provided.
const axios = require('axios');
let stripe = null;
if (process.env.STRIPE_SECRET) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET);
  } catch (e) {
    console.warn('Stripe init failed', e && e.message);
    stripe = null;
  }
}

async function pay({ amountUSD, amountUGX, donor }) {
  if (!stripe) {
    return {
      provider: 'card-placeholder',
      currency: 'USD',
      amountUSD,
      amountUGX,
      message: 'No Stripe key configured. Set STRIPE_SECRET in .env to enable Checkout.'
    };
  }

  const successUrl = process.env.STRIPE_SUCCESS_URL || 'http://localhost:5500/donate.html?success=1';
  const cancelUrl = process.env.STRIPE_CANCEL_URL || 'http://localhost:5500/donate.html?canceled=1';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Donation to Creation Steppers' },
          unit_amount: Math.round(amountUSD * 100)
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    customer_email: donor && donor.email,
    success_url: successUrl,
    cancel_url: cancelUrl
  });

  return {
    provider: 'stripe',
    sessionId: session.id,
    sessionUrl: session.url,
    amountUSD,
    amountUGX
  };
}

module.exports = { pay };
