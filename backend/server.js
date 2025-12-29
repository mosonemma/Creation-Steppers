const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();


const donateRouter = require('./routes/donate');
const webhookRouter = require('./routes/webhook');

const app = express();
app.use(cors());

// Health
app.get('/', (req, res) => res.json({ ok: true, msg: 'Donations backend' }));

// Webhook endpoint requires raw body for signature verification
app.post('/webhook', express.raw({ type: 'application/json' }), webhookRouter);

// JSON body parser for regular endpoints
app.use(express.json());

app.use('/api/donate', donateRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Donations backend listening on ${PORT}`));
