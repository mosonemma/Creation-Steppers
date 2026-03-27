// Newsletter/subscribe route has been disabled per request.
const express = require('express');
const router = express.Router();

router.use((req, res) => {
  res.status(410).json({ ok: false, error: 'Subscription feature disabled' });
});

module.exports = router;
