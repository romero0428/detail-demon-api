const { google } = require('googleapis');
require('dotenv').config();

// Set up authentication using your service account
const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account.json', // Make sure this file is in the same folder
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function getSheetData() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const sheetId = process.env.GOOGLE_SHEET_ID;

  // The names of your 4 tabs
  const tabs = ['Complete Detail', 'Full Exterior', 'Interior Detail', 'Car Wash'];

  // Object to store tab data
  const allData = {};

  for (const tab of tabs) {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${tab}!A1:Z1000`, // adjust range if needed
      });

      const rows = res.data.values;
      if (rows && rows.length > 1) {
        const headers = rows[0]; // first row = column headers
        const data = rows.slice(1).map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        allData[tab] = data;
      } else {
        allData[tab] = [];
      }
    } catch (error) {
      console.error(`❌ Error reading tab "${tab}":`, error.message);
      allData[tab] = { error: error.message };
    }
  }

  return allData;
}

module.exports = { getSheetData };
