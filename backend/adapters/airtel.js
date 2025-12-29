// Airtel Money adapter (template)
// Template for server-side Airtel Money integration. See .env.example for required vars.

const axios = require('axios');

async function getAirtelToken() {
  const base = process.env.AIRTEL_BASE_URL;
  const clientId = process.env.AIRTEL_CLIENT_ID;
  const clientSecret = process.env.AIRTEL_CLIENT_SECRET;
  if (!base || !clientId || !clientSecret) throw new Error('Airtel env vars missing');

  const url = `${base}/auth/oauth2/token`; // may differ by region
  const resp = await axios.post(url, 'grant_type=client_credentials', {
    auth: { username: clientId, password: clientSecret },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return resp.data && resp.data.access_token ? resp.data.access_token : null;
}

async function initiateAirtelCollection({ amountUGX, phone, reference }) {
  const base = process.env.AIRTEL_BASE_URL;
  const token = await getAirtelToken();
  const url = `${base}/v1/collections`; // adjust path to actual API
  const body = {
    amount: String(amountUGX),
    currency: 'UGX',
    externalId: reference || 'Donation',
    payer: { partyIdType: 'MSISDN', partyId: phone },
    payerMessage: 'Donation to Creation Steppers',
    payee: { partyIdType: 'MSISDN', partyId: process.env.AIRTEL_PAYEE_NUMBER || '' }
  };
  const resp = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return resp.data || { status: 'requested' };
}

async function pay({ amountUGX, donor }) {
  try {
    if (!donor || !donor.phone) return { provider: 'airtel', error: 'donor.phone required for Airtel collection' };
    const reference = `don_${Date.now()}`;
    const result = await initiateAirtelCollection({ amountUGX, phone: donor.phone, reference });
    return { provider: 'airtel', amountUGX, reference, result };
  } catch (err) {
    return { provider: 'airtel', error: err.message || String(err) };
  }
}

module.exports = { pay };
