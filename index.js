const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Write the service-account.json file from the env secret (only once)
const serviceAccountEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const serviceAccountPath = path.join(__dirname, 'service-account.json');

if (serviceAccountEnv && !fs.existsSync(serviceAccountPath)) {
  fs.writeFileSync(serviceAccountPath, serviceAccountEnv);
  console.log('✅ service-account.json written to disk');
}

const { getSheetData } = require('./sheets');

const app = express();
const PORT = process.env.PORT || 3000;

// GET endpoint to fetch all sheet bookings
app.get('/bookings', async (req, res) => {
  try {
    const data = await getSheetData();
    res.json(data);
  } catch (error) {
    console.error('Failed to get bookings:', error.message);
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

// Root route (optional)
app.get('/', (req, res) => {
  res.send('🚗 Detail Demon API is running');
});

// Launch server
app.listen(PORT, () => {
  console.log(`🚗 Detail Demon API running at http://localhost:${PORT}`);
});
