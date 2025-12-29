const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'data', 'donations.db');
const fs = require('fs');
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });

const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE,
  amount_usd REAL,
  amount_ugx INTEGER,
  method TEXT,
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  provider TEXT,
  status TEXT,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

const insertStmt = db.prepare(`
INSERT INTO donations (reference, amount_usd, amount_ugx, method, donor_name, donor_email, donor_phone, provider, status, metadata)
VALUES (@reference,@amount_usd,@amount_ugx,@method,@donor_name,@donor_email,@donor_phone,@provider,@status,@metadata)
`);

const updateStmt = db.prepare(`
UPDATE donations SET status=@status, provider=@provider, metadata=@metadata, updated_at=CURRENT_TIMESTAMP WHERE reference=@reference
`);

function createDonation(rec) {
  insertStmt.run(rec);
}

function updateDonation(reference, updates) {
  updateStmt.run({ reference, ...updates });
}

function getDonationByReference(reference) {
  return db.prepare('SELECT * FROM donations WHERE reference = ?').get(reference);
}

module.exports = { createDonation, updateDonation, getDonationByReference, dbPath };
