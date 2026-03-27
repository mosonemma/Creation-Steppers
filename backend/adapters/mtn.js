// MTN Mobile Money adapter (template)
// This file implements a basic MTN MOMO collection flow template.
// It expects environment variables in .env (see .env.example):
// MTN_BASE_URL, MTN_SUBSCRIPTION_KEY, MTN_API_USER, MTN_API_KEY

const axios = require('axios');

async function getAccessToken() {
  const base = process.env.MTN_BASE_URL;
  const subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY;
  if (!base || !subscriptionKey) throw new Error('MTN env vars missing');

  // This template matches MTN MOMO sandbox token endpoint patterns; adjust as needed.
  const url = `${base}/collection/token/`; // may vary by provider region
  const resp = await axios.post(url, null, {
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  });
  if (resp.data && resp.data.access_token) return resp.data.access_token;
  if (resp.headers && resp.headers['authorization']) return resp.headers['authorization'];
  throw new Error('MTN token fetch failed');
}

async function initiateCollection({ amountUGX, phone, reference }) {
  const base = process.env.MTN_BASE_URL;
  const subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY;
  if (!base || !subscriptionKey) throw new Error('MTN env vars missing');

  const token = await getAccessToken();
  const url = `${base}/collection/v1_0/requesttopay`;
  const body = {
    amount: String(amountUGX),
    currency: 'UGX',
    externalId: reference || 'Donation',
    payer: { partyIdType: 'MSISDN', partyId: phone },
    payerMessage: 'Donation to Creation Steppers',
    payeeNote: 'Thank you for your donation',
    // Optionally include payee/receiver MSISDN if required by provider
    payee: { partyIdType: 'MSISDN', partyId: process.env.MTN_PAYEE_NUMBER || '' }
  };

  const resp = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Reference-Id': reference || `don_${Date.now()}`,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type': 'application/json'
    }
  });
  return resp.data || { status: 'requested' };
}

async function pay({ amountUGX, donor }) {
  // donor.phone is expected as MSISDN (e.g. 25677xxxxxxx)
  try {
    if (!donor || !donor.phone) {
      return { provider: 'mtn', error: 'donor.phone required for MTN collection' };
    }
    const reference = `don_${Date.now()}`;
    const result = await initiateCollection({ amountUGX, phone: donor.phone, reference });
    return { provider: 'mtn', amountUGX, reference, result };
  } catch (err) {
    return { provider: 'mtn', error: err.message || String(err) };
  }
}

module.exports = { pay };
