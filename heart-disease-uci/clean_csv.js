// Dhruvii Mehta
// 10 June, 2025
// uci-heart-disease data set cleaner

// Install these packages:
// npm install csv-parser csv-stringify

// import necessary modules
const fs = require('fs');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify');

// define input and output file paths
const inputFile = 'heart_disease_uci.csv';
const outputFile = 'heart_disease_uci_cleaned.csv';

// array holds rows that do not have missing entries
const cleanRows = [];
let headers = []; // stores the header row

// read and parse the CSV file
fs.createReadStream(inputFile)
    .pipe(csv()) // csv-parser parses each row
    .on('headers', (receivedHeaders) => {
        // store headers
        headers = receivedHeaders;
    })
    .on('data', (row) => {
        // process each row, check for missing values
        let hasMissing = false;
        for (const key in row) {
            // if an empty entry is found
            if (row[key] === null || row[key] === undefined || row[key].trim() === '') {
                hasMissing = true;
                break; // no need to check further in the same row
            }
        }

        // filter valid rows
        if (!hasMissing) {
            cleanRows.push(row);
        }
    })
    .on('end', () => {
        console.log('CSV file successfully processed.');

        // write the clean data to a new CSV file, including the headers
        stringify(cleanRows, { header: true, columns: headers }, (err, output) => {
            if (err) throw err;
            fs.writeFileSync(outputFile, output);
            console.log(`Cleaned data saved to ${outputFile}`);
        });
    })
    .on('error', (error) => {
        console.error('Error reading CSV file:', error);
    });