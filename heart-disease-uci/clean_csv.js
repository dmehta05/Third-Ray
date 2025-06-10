// Dhruvii Mehta
// 10 June, 2025
// uci-heart-disease data set cleaner

// Install these packages:
// npm install csv-parser csv-stringify

// import necessary modules
const fs = require('fs');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify');

const inputFile = 'heart_disease_uci.csv';
const outputFile = 'heart_disease_uci_imputed.csv';

// array holds rows that do not have missing entries
let allRows = [];
let headers = [];

// check if a value is numerical
function isNumerical(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

// calculate the median of an array of numbers
function calculateMedian(arr) {
    if (arr.length === 0) return 0; // return 0 for empty arrays
    arr.sort((a, b) => a - b);
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

// calculate the mode of an array (for categorical values)
function calculateMode(arr) {
    if (arr.length === 0) return ''; // return empty string for empty arrays
    const frequencyMap = {};
    arr.forEach(item => {
        frequencyMap[item] = (frequencyMap[item] || 0) + 1;
    });

    let mode = '';
    let maxCount = 0;
    for (const item in frequencyMap) {
        if (frequencyMap[item] > maxCount) {
            mode = item;
            maxCount = frequencyMap[item];
        }
    }
    return mode;
}

// console.log(`Starting to read ${inputFile}...`);

// read and parse the CSV file
fs.createReadStream(inputFile)
    .pipe(csv()) // parses each row
    .on('headers', (receivedHeaders) => {
        headers = receivedHeaders;
        console.log('Headers:', headers);
    })
    .on('data', (row) => {
        allRows.push(row);
    })
    .on('end', async () => {
        console.log(`Finished reading. Total rows: ${allRows.length}`);

        // analyze missing values and data types
        const columnData = {}; // store values for each column (excluding missing entries)
        const missingValueCounts = {};
        const columnTypes = {}; // numerical or categorical

        // initialize counts, arrays, and data type
        headers.forEach(header => {
            missingValueCounts[header] = 0;
            columnData[header] = [];
            columnTypes[header] = null;
        });

        allRows.forEach(row => {
            headers.forEach(header => {
                const value = row[header];
                // check for blank entries
                const isMissing = ((typeof value === 'string' && value.trim() === ''));

                if (isMissing) {
                    missingValueCounts[header]++;
                } else {
                    columnData[header].push(value); // store values to determine data type and imputation
                }
            });
        });

        // determine data types (numerical or categorical) and populate data for calculations
        headers.forEach(header => {
            const nonMissingValues = columnData[header];
            let numericalCount = 0;
            let firstNonMissingType = null;

            if (nonMissingValues.length > 0) {
                firstNonMissingType = typeof nonMissingValues[0];
            }

            nonMissingValues.forEach(value => {
                if (isNumerical(value)) {
                    numericalCount++;
                }
            });

            // if more than 80% are numerical, consider it numerical
            // Also, consider if it was initially detected as a string
            if (numericalCount / nonMissingValues.length > 0.8 && firstNonMissingType !== 'string') {
                columnTypes[header] = 'numerical';
                // convert all non missing values to numbers for calculation
                columnData[header] = nonMissingValues.map(parseFloat);
            } else {
                columnTypes[header] = 'categorical';
            }
        });

        console.log('\n--- Missing Value Analysis & Column Types ---');
        const imputationValues = {}; // store calculated mean/median/mode for each column

        headers.forEach(header => {
            const totalRows = allRows.length;
            const missingCount = missingValueCounts[header];
            const missingPercentage = (missingCount / totalRows * 100).toFixed(2);
            const type = columnTypes[header];

            console.log(`Column: '${header}' | Type: ${type} | Missing: ${missingCount}/${totalRows} (${missingPercentage}%)`);

            if (missingCount > 0) {
                if (type === 'numerical') {
                    const medianValue = calculateMedian(columnData[header]);
                    imputationValues[header] = medianValue;
                    console.log(`  -> Will impute with Median: ${medianValue}`);
                } else if (type === 'categorical') {
                    const modeValue = calculateMode(columnData[header]);
                    imputationValues[header] = modeValue;
                    console.log(`  -> Will impute with Mode: '${modeValue}'`);
                } else {
                    console.warn(`  -> Cannot impute column '${header}', type not determined or no non-missing values.`);
                    // lastly, remove rows where specific columns are missing
                }
            }
        });

        // apply imputation and filter final rows
        const finalCleanedRows = [];
        let rowsRemovedDueToUnimputableMissing = 0;

        allRows.forEach(row => {
            let rowHasUnimputableMissing = false;
            const newRow = { ...row }; // create a copy to modify

            headers.forEach(header => {
                const value = newRow[header];
                const isMissing = (value === '?' || (typeof value === 'string' && value.trim() === ''));

                if (isMissing) {
                    if (imputationValues[header] !== undefined) {
                        newRow[header] = imputationValues[header]; // impute with calculated value
                    } else {
                        // this case happens if a column had no non-missing values or type couldn't be determined
                        rowHasUnimputableMissing = true;
                        console.warn(`Row will be removed: Column '${header}' has missing value and no imputation strategy found.`);
                    }
                } else {
                    // ensure numerical columns are actually numbers in the output
                    if (columnTypes[header] === 'numerical') {
                        newRow[header] = parseFloat(newRow[header]);
                    }
                }
            });

            if (!rowHasUnimputableMissing) {
                finalCleanedRows.push(newRow);
            } else {
                rowsRemovedDueToUnimputableMissing++;
            }
        });

        console.log(`\n--- Imputation Summary ---`);
        console.log(`Original rows: ${allRows.length}`);
        console.log(`Rows removed due to unimputable missing values: ${rowsRemovedDueToUnimputableMissing}`);
        console.log(`Final cleaned rows: ${finalCleanedRows.length}`);

        // write the cleaned data to a new CSV file
        stringify(finalCleanedRows, { header: true, columns: headers }, (err, output) => {
            if (err) {
                console.error('Error stringifying CSV:', err);
                return;
            }
            fs.writeFileSync(outputFile, output);
            console.log(`\nCleaned and imputed data saved to ${outputFile}`);
        });

    })
    .on('error', (error) => {
        console.error('Error during CSV processing:', error);
    });
