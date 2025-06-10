// Dhruvii Mehta
// 10 June, 2025
// uci-heart-disease data set cleaner
// code generated with assistance from Gemini AI as per instruction

// Install these packages:
// npm install csv-parser csv-stringify

const fs = require('fs');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify');

const inputFile = 'heart_disease_uci.csv';
const outputFile = 'heart_disease_uci_conditionally_cleaned.csv';
const MISSING_PERCENTAGE_THRESHOLD = 15; // Define the threshold for row removal vs. imputation
const MIN_VALID_DATA_FOR_IMPUTATION = 5; // Minimum non-missing values needed to calculate median/mode

// Array to store all parsed rows
let allRows = [];
let headers = [];

// Helper function to check if a value is numerical
function isNumerical(value) {
    // Treat empty string, null, undefined, as non-numerical for this check
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
        return false;
    }
    return !isNaN(parseFloat(value)) && isFinite(value);
}

// Helper function to calculate the median of an array of numbers
function calculateMedian(arr) {
    if (arr.length === 0) return NaN; // Return NaN if no data to calculate median
    const sortedArr = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    return sortedArr.length % 2 !== 0 ? sortedArr[mid] : (sortedArr[mid - 1] + sortedArr[mid]) / 2;
}

// Helper function to calculate the mode of an array (for categorical/discrete)
function calculateMode(arr) {
    if (arr.length === 0) return ''; // Return empty string if no data to calculate mode
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

fs.createReadStream(inputFile)
    .pipe(csv())
    .on('headers', (receivedHeaders) => {
        headers = receivedHeaders;
        console.log('Detected Headers:', headers);
    })
    .on('data', (row) => {
        allRows.push(row);
    })
    .on('end', async () => {
        console.log(`Finished reading. Original total rows: ${allRows.length}`);

        // Analyze Missing Values and Data Types
        const columnData = {}; // Store values for each column (excluding missing ones)
        const missingValueCounts = {};
        const columnTypes = {}; // Store data type for each column (numerical, categorical)

        // Initialize counts, storage, data types
        headers.forEach(header => {
            missingValueCounts[header] = 0;
            columnData[header] = [];
            columnTypes[header] = null; 
        });

        allRows.forEach(row => {
            headers.forEach(header => {
                const value = row[header];
                // Check for blank entries
                const isMissing = (value === '?' || (typeof value === 'string' && value.trim() === ''));

                if (isMissing) {
                    missingValueCounts[header]++;
                } else {
                    columnData[header].push(value); // Store non-missing values for data type and imputation
                }
            });
        });

        // Determine column types (numerical or categorical)
        headers.forEach(header => {
            const nonMissingValues = columnData[header];
            let numericalCount = 0;

            nonMissingValues.forEach(value => {
                if (isNumerical(value)) {
                    numericalCount++;
                }
            });

            // If more than 80% of non-missing values are numerical, assume numerical
            if (nonMissingValues.length > 0 && (numericalCount / nonMissingValues.length > 0.8)) {
                columnTypes[header] = 'numerical';
                // Convert all non-missing values to numbers for calculation
                columnData[header] = nonMissingValues.map(parseFloat);
            } else {
                columnTypes[header] = 'categorical';
            }
        });

        // console.log('\n--- Missing Value Analysis & Strategy Determination ---');
        const columnStrategies = {}; // Store strategy for each column
        const imputationValues = {}; // Store calculated median/mode for each column
        const columnsToDrop = new Set(); // New set to track columns to be entirely dropped

        headers.forEach(header => {
            const totalRows = allRows.length;
            const missingCount = missingValueCounts[header];
            const missingPercentage = (missingCount / totalRows * 100);
            const type = columnTypes[header];
            const hasValidDataForImputation = columnData[header].length >= MIN_VALID_DATA_FOR_IMPUTATION;

            console.log(`Column: '${header}' | Type: ${type} | Missing: ${missingCount}/${totalRows} (${missingPercentage.toFixed(2)}%)`);

            if (missingCount > 0) {
                if (missingPercentage < MISSING_PERCENTAGE_THRESHOLD) {
                    columnStrategies[header] = 'remove_row_if_missing';
                    console.log(`  -> Strategy: Remove row if missing in this column (Missing < ${MISSING_PERCENTAGE_THRESHOLD}%)`);
                } else {
                    // Percentage >= threshold, so consider imputation or dropping column
                    if (hasValidDataForImputation) {
                        if (type === 'numerical') {
                            const medianValue = calculateMedian(columnData[header]);
                            imputationValues[header] = medianValue;
                            columnStrategies[header] = 'impute_with_median';
                            console.log(`  -> Strategy: Impute with Median: ${medianValue} (Missing >= ${MISSING_PERCENTAGE_THRESHOLD}%)`);
                        } else if (type === 'categorical') {
                            const modeValue = calculateMode(columnData[header]);
                            imputationValues[header] = modeValue;
                            columnStrategies[header] = 'impute_with_mode';
                            console.log(`  -> Strategy: Impute with Mode: '${modeValue}' (Missing >= ${MISSING_PERCENTAGE_THRESHOLD}%)`);
                        } else {
                            // Should theoretically not happen if type detection is robust, but a safeguard.
                            console.warn(`  -> Column '${header}' has high missing %, but type not clear or no valid data for imputation. Will drop column.`);
                            columnStrategies[header] = 'drop_column';
                            columnsToDrop.add(header);
                        }
                    } else {
                        // High missing percentage AND not enough valid data to impute
                        console.warn(`  -> Column '${header}' has high missing % (${missingPercentage.toFixed(2)}%) and insufficient valid data (${columnData[header].length} values) for imputation. Will drop column.`);
                        columnStrategies[header] = 'drop_column';
                        columnsToDrop.add(header);
                    }
                }
            } else {
                columnStrategies[header] = 'no_missing'; // No missing values in this column
                console.log('  -> Strategy: No missing values, no action needed.');
            }
        });

        // Update headers to remove dropped columns
        const finalHeaders = headers.filter(header => !columnsToDrop.has(header));
        console.log(`\nColumns remaining after potential dropping:`, finalHeaders);

        // Apply Strategies and Filter Final Rows
        const finalCleanedRows = [];
        let rowsRemovedCount = 0;
        let valuesImputedCount = 0;

        allRows.forEach((originalRow, rowIndex) => {
            let shouldRemoveCurrentRow = false;
            const processedRow = {}; // Initialize as empty object to build the new row

            finalHeaders.forEach(header => { // Iterate only over finalHeaders
                const value = originalRow[header]; // Get value from original row
                const isMissing = (value === '?' || (typeof value === 'string' && value.trim() === ''));
                const strategy = columnStrategies[header];
                const type = columnTypes[header]; // FIX: Retrieve 'type' for the current header

                if (isMissing) {
                    if (strategy === 'remove_row_if_missing') {
                        shouldRemoveCurrentRow = true; // Mark row for removal
                        return; // Stop checking this row's columns, it's already decided for removal
                    } else if (strategy === 'impute_with_median' || strategy === 'impute_with_mode') {
                        const imputedValue = imputationValues[header];
                        // Double-check if imputedValue is valid (e.g., not NaN from a column that became empty due to filtering)
                        if (imputedValue !== undefined && !(type === 'numerical' && isNaN(imputedValue))) {
                            processedRow[header] = imputedValue;
                            valuesImputedCount++;
                        } else {
                            // This means even after strategy, imputation failed (e.g., column had 1 valid value, then removed).
                            // This scenario should be rare with the column dropping logic, but as a safeguard, remove row.
                            shouldRemoveCurrentRow = true;
                            console.warn(`Row ${rowIndex + 1} marked for removal: Missing value in '${header}', imputation value was invalid or missing. (Safeguard removal)`);
                            return; // Stop checking this row's columns
                        }
                    } else {
                        // If strategy is 'no_missing' but a missing value is found, or it's a dropped column
                        // (which won't be in finalHeaders), this shouldn't happen for finalHeaders.
                        // If it does, it's an unexpected missing value in a column without a clear strategy.
                        shouldRemoveCurrentRow = true;
                        console.warn(`Row ${rowIndex + 1} marked for removal: Unexpected missing value in '${header}' (no clear handling strategy).`);
                        return;
                    }
                } else {
                    // Value is not missing, just copy it to the processed row
                    // Ensure numerical columns are parsed to numbers in the output
                    if (type === 'numerical') { // Use the retrieved 'type' here
                        processedRow[header] = parseFloat(value);
                    } else {
                        processedRow[header] = value;
                    }
                }
            });

            if (!shouldRemoveCurrentRow) {
                finalCleanedRows.push(processedRow);
            } else {
                rowsRemovedCount++;
            }
        });

        console.log(`\n--- Final Processing Summary ---`);
        console.log(`Original rows: ${allRows.length}`);
        console.log(`Columns dropped: ${columnsToDrop.size} (${Array.from(columnsToDrop).join(', ')})`);
        console.log(`Rows removed: ${rowsRemovedCount}`);
        console.log(`Values imputed: ${valuesImputedCount}`);
        console.log(`Final cleaned rows: ${finalCleanedRows.length}`);

        // write cleaned data to a new CSV file
        if (finalCleanedRows.length === 0) {
            console.warn("No rows left after cleaning. Output file will be empty.");
        }

        stringify(finalCleanedRows, { header: true, columns: finalHeaders }, (err, output) => {
            if (err) {
                console.error('Error stringifying CSV:', err);
                return;
            }
            fs.writeFileSync(outputFile, output);
            console.log(`\nCleaned data saved to ${outputFile}`);
        });

    })
    .on('error', (error) => {
        console.error('Error during CSV processing:', error);
    });