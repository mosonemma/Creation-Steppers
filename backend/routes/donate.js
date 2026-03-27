const express = require('express');
const router = express.Router();
const exchange = require('../services/exchange');
const cardAdapter = require('../adapters/card');
const mtnAdapter = require('../adapters/mtn');
const airtelAdapter = require('../adapters/airtel');
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const { amountUSD, method, donor } = req.body;
    if (!amountUSD || !method) return res.status(400).json({ error: 'amountUSD and method required' });
    const amountUGX = await exchange.convertUSDToUGX(amountUSD);

    const reference = `don_${Date.now()}_${Math.floor(Math.random()*9000+1000)}`;
    // Log initial donation attempt as pending
    try {
      db.createDonation({
        reference,
        amount_usd: amountUSD,
        amount_ugx: amountUGX,
        method,
        donor_name: donor && donor.name,
        donor_email: donor && donor.email,
        donor_phone: donor && donor.phone,
        provider: null,
        status: 'pending',
        metadata: null
      });
    } catch (e) {
      console.warn('DB insert failed', e && e.message);
    }

    let result;
    if (method === 'card') result = await cardAdapter.pay({ amountUSD, amountUGX, donor, reference });
    else if (method === 'mtn') result = await mtnAdapter.pay({ amountUGX, donor, reference });
    else if (method === 'airtel') result = await airtelAdapter.pay({ amountUGX, donor, reference });
    else return res.status(400).json({ error: 'unsupported method' });

    // Update DB with provider info
    try {
      db.updateDonation(reference, { status: 'requested', provider: result.provider || method, metadata: JSON.stringify(result) });
    } catch (e) {
      console.warn('DB update failed', e && e.message);
    }

    res.json({ reference, amountUGX, result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
