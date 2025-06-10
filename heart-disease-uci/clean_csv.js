const fs = require('fs');
const Papa = require('papaparse');

// Read CSV file
const rawCSV = fs.readFileSync('heart_disease_uci.csv', 'utf8');

// Parse CSV
const parsed = Papa.parse(rawCSV, {
  header: true,
  skipEmptyLines: true
});

// Remove rows with any '?' values
const cleanedData = parsed.data.filter(row =>
  !Object.values(row).some(value => value.trim() === '?')
);

// Convert back to CSV
const cleanedCSV = Papa.unparse(cleanedData);

// Save cleaned CSV
fs.writeFileSync('heart_disease_cleaned.csv', cleanedCSV);

console.log('✅ Cleaned CSV saved as heart_disease_cleaned.csv');
