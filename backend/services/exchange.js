const axios = require('axios');

const FALLBACK_RATE = 3700; // safe fallback UGX per USD — update as needed

async function convertUSDToUGX(amountUSD) {
  try {
    const resp = await axios.get('https://api.exchangerate.host/convert', {
      params: { from: 'USD', to: 'UGX', amount: amountUSD }
    });
    if (resp.data && typeof resp.data.result === 'number') return Math.round(resp.data.result);
  } catch (e) {
    console.warn('Exchange API failed, using fallback rate', e && e.message);
  }
  return Math.round(amountUSD * FALLBACK_RATE);
}

module.exports = { convertUSDToUGX };
