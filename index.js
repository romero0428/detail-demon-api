const express = require('express');
const { getSheetData } = require('./sheets'); // imports your sheet reader
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// GET endpoint to fetch bookings from all 4 tabs
app.get('/bookings', async (req, res) => {
  try {
    const data = await getSheetData();
    res.json(data);
  } catch (error) {
    console.error('Failed to get bookings:', error.message);
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

// Launch server
app.listen(PORT, () => {
  console.log(`🚗 Detail Demon API running at http://localhost:${PORT}`);
});
