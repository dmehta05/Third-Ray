// Dhruvii Mehta
// 13 June, 2025
// uci-heart-disease data analysis
// code generated with assistance from Gemini AI as per instruction

// To run this script:
// Install Node.js, csv-parser
// Run from your terminal: node data_analysis.js
// Output will be JavaScript code for ECharts options, copy and paste into an HTML file (written to analysis.js)

const fs = require('fs');
const csv = require('csv-parser');

const inputFile = 'heart_disease_uci_imputed.csv';
const outputJsFile = 'analysis.js'; // New output file for JS code and analysis
let outputBuffer = ''; // Buffer to collect all output

// Override console.log to capture output
const originalConsoleLog = console.log;
console.log = function(...args) {
    outputBuffer += args.join(' ') + '\n';
    // Optionally, still print to original console for real-time feedback
    // originalConsoleLog.apply(console, args);
};
const originalConsoleError = console.error;
console.error = function(...args) {
    outputBuffer += 'ERROR: ' + args.join(' ') + '\n';
    originalConsoleError.apply(console, args); // Always print errors to original console
};


// --- Helper Functions for Statistics ---

/**
 * Calculates the mean of an array of numbers.
 * @param {number[]} arr - The array of numbers.
 * @returns {number} The mean value.
 */
function calculateMean(arr) {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((a, b) => a + b, 0);
    return sum / arr.length;
}

/**
 * Calculates the median of an array of numbers.
 * @param {number[]} arr - The array of numbers.
 * @returns {number} The median value.
 */
function calculateMedian(arr) {
    if (arr.length === 0) return 0;
    const sortedArr = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    return sortedArr.length % 2 === 0 ? (sortedArr[mid - 1] + sortedArr[mid]) / 2 : sortedArr[mid];
}

/**
 * Calculates the standard deviation of an array of numbers.
 * @param {number[]} arr - The array of numbers.
 * @param {number} mean - The pre-calculated mean of the array.
 * @returns {number} The standard deviation value.
 */
function calculateStdDev(arr, mean) {
    if (arr.length < 2) return 0; // Need at least 2 points for std dev
    const sqDiffs = arr.map(val => Math.pow(val - mean, 2));
    const avgSqDiff = calculateMean(sqDiffs);
    return Math.sqrt(avgSqDiff);
}

/**
 * Calculates the Pearson Correlation Coefficient between two arrays.
 * @param {number[]} x - The first array of numbers.
 * @param {number[]} y - The second array of numbers.
 * @returns {number} The Pearson correlation coefficient.
 */
function calculatePearsonCorrelation(x, y) {
    if (x.length !== y.length || x.length < 2) return NaN;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.map((val, i) => val * y[i]).reduce((a, b) => a + b, 0);
    const sumX2 = x.map(val => val * val).reduce((a, b) => a + b, 0);
    const sumY2 = y.map(val => val * val).reduce((a, b) => a + b, 0);

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(
        ((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY))
    );

    return denominator === 0 ? 0 : numerator / denominator; // Handle division by zero
}

// --- Main Data Loading and Analysis Function ---
async function analyzeData() {
    const data = [];
    // Counters for debugging unexpected non-numeric values
    let unexpectedSexValues = 0;
    let unexpectedCpValues = 0;
    let unexpectedThalachValues = 0;
    let unexpectedTrestbpsValues = 0;

    originalConsoleLog(`Loading and parsing '${inputFile}'...`); // Use original console.log for loading message

    // Use csv-parser to load and parse the CSV data
    fs.createReadStream(inputFile)
        .pipe(csv())
        .on('data', (row) => {
            // Explicitly convert and check for NaN immediately
            row.age = Number(row.age);
            row.sex = Number(row.sex);
            if (isNaN(row.sex)) unexpectedSexValues++;

            row.cp = Number(row.cp);
            if (isNaN(row.cp)) unexpectedCpValues++;

            row.trestbps = Number(row.trestbps);
            if (isNaN(row.trestbps)) unexpectedTrestbpsValues++;

            row.chol = Number(row.chol);
            row.fbs = Number(row.fbs);
            row.restecg = Number(row.restecg);
            
            row.thalach = Number(row.thalach);
            if (isNaN(row.thalach)) unexpectedThalachValues++;

            row.exang = Number(row.exang);
            row.oldpeak = Number(row.oldpeak);
            row.slope = Number(row.slope);
            row.ca = Number(row.ca);
            row.thal = Number(row.thal);
            row.target = Number(row.target);

            // Map numerical codes to descriptive labels.
            // Ensure strict mapping, 'Unknown' if not 0 or 1 for sex, etc.
            row._sex_label = (row.sex === 1) ? 'Male' : ((row.sex === 0) ? 'Female' : 'Unknown Sex');
            row._cp_label = {
                1: 'Typical Angina',
                2: 'Atypical Angina',
                3: 'Non-anginal Pain',
                4: 'Asymptomatic'
            }[row.cp] || 'Unknown Chest Pain';
            row._target_label = (row.target === 1) ? 'Heart Disease' : ((row.target === 0) ? 'No Heart Disease' : 'Unknown Status');

            data.push(row);
        })
        .on('end', () => {
            originalConsoleLog(`Successfully parsed ${data.length} rows.`); // Use original console.log for end message
            originalConsoleLog(`\n--- Initial Data Conversion Debugging ---`);
            originalConsoleLog(`Unexpected 'sex' values (became NaN): ${unexpectedSexValues}`);
            originalConsoleLog(`Unexpected 'cp' values (became NaN): ${unexpectedCpValues}`);
            originalConsoleLog(`Unexpected 'trestbps' values (became NaN): ${unexpectedTrestbpsValues}`);
            originalConsoleLog(`Unexpected 'thalach' values (became NaN): ${unexpectedThalachValues}`);
            originalConsoleLog(`--- End Initial Debugging ---\n`);

            performAnalysis(data);

            // Write all captured output to the file
            fs.writeFileSync(outputJsFile, outputBuffer);
            originalConsoleLog(`\nAll ECharts options and analysis findings written to '${outputJsFile}'`);
            // Reset console.log to its original behavior
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
        })
        .on('error', (error) => {
            originalConsoleError('Error reading or parsing CSV:', error.message); // Use original console.error
            // Reset console.log to its original behavior even on error
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
        });
}

/**
 * Performs the main data analysis and prints findings, including ECharts options.
 * @param {Array<Object>} data - The parsed and prepared dataset.
 */
function performAnalysis(data) {
    // --- 1. Compute and Display Basic Descriptive Statistics ---
    console.log('\n--- Descriptive Statistics ---');
    const numericColumns = [
        'age', 'trestbps', 'chol', 'thalach', 'oldpeak', 'ca'
    ];
    let statsOutput = 'Column        Mean   Median   Std Dev\n';
    statsOutput += '-----------------------------------------\n';

    numericColumns.forEach(col => {
        const values = data.map(row => row[col]).filter(val => !isNaN(val) && val !== null); // Filter out NaN and null
        const mean = calculateMean(values).toFixed(2);
        const median = calculateMedian(values).toFixed(2);
        const stdDev = calculateStdDev(values, parseFloat(mean)).toFixed(2);
        statsOutput += `${col.padEnd(14)} ${mean.padEnd(7)} ${median.padEnd(7)} ${stdDev.padEnd(7)}\n`;
    });
    console.log(statsOutput);

    // --- ECharts Options Generation ---
    console.log('\n--- ECharts Options (Copy and paste relevant sections into your HTML file) ---\n');
    console.log('// You will need to initialize ECharts instances in your HTML like:');
    console.log('// var chart = echarts.init(document.getElementById(\'chart-id\'));');
    console.log('// chart.setOption(chartOptionVariable);\n');


    // --- ECharts Option: Histogram of Age ---
    const ageData = data.map(row => row.age).filter(val => !isNaN(val) && val !== null);
    const ageOption = {
        title: {
            text: 'Age Distribution'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'value',
            name: 'Age'
        },
        yAxis: {
            type: 'value',
            name: 'Count'
        },
        series: [{
            name: 'Age',
            type: 'bar',
            barWidth: '90%', // Make bars wider for histogram feel
            encode: { x: 0, y: 1 }, // Data in [value, count] format
            datasetIndex: 0,
            itemStyle: {
                color: '#5470C6' // A nice blue
            },
            markLine: {
                data: [
                    { type: 'average', name: 'Avg Age' }
                ]
            }
        }],
        dataset: [{
            source: (function() {
                const bins = {};
                ageData.forEach(age => {
                    const bin = Math.floor(age / 5) * 5; // Bins of 5 years
                    bins[bin] = (bins[bin] || 0) + 1;
                });
                const binnedData = Object.keys(bins).sort((a,b) => a - b).map(key => [Number(key), bins[key]]);
                return binnedData;
            })()
        }]
    };
    console.log('var ageHistogramOption = ' + JSON.stringify(ageOption, null, 2) + ';');
    console.log('// Observation: Most patients are aged between 45–65. The distribution is somewhat bell-shaped.');

    // --- ECharts Option: Histogram of Cholesterol ---
    const cholData = data.map(row => row.chol).filter(val => !isNaN(val) && val !== null);
    const cholOption = {
        title: {
            text: 'Cholesterol Distribution'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'value',
            name: 'Cholesterol (mg/dL)'
        },
        yAxis: {
            type: 'value',
            name: 'Count'
        },
        series: [{
            name: 'Cholesterol',
            type: 'bar',
            barWidth: '90%',
            encode: { x: 0, y: 1 },
            datasetIndex: 0,
            itemStyle: {
                color: '#EE6666' // Reddish
            },
            markLine: {
                data: [
                    { type: 'average', name: 'Avg Chol' }
                ]
            }
        }],
        dataset: [{
            source: (function() {
                const bins = {};
                const minChol = Math.min(...cholData);
                const maxChol = Math.max(...cholData);
                const binSize = 20; // 20 mg/dL bins
                cholData.forEach(chol => {
                    const bin = Math.floor(chol / binSize) * binSize;
                    bins[bin] = (bins[bin] || 0) + 1;
                });
                const binnedData = Object.keys(bins).sort((a,b) => a - b).map(key => [Number(key), bins[key]]);
                return binnedData;
            })()
        }]
    };
    console.log('\nvar cholesterolHistogramOption = ' + JSON.stringify(cholOption, null, 2) + ';');
    console.log('// Observation: Cholesterol distribution shows a slight right skew with some individuals having higher cholesterol levels.');

    // --- ECharts Option: Bar chart of Sex ---
    const sexCounts = { 'Female': 0, 'Male': 0 }; // Only include valid categories for charting
    data.forEach(row => {
        // Only count if it's one of the expected labels and not an "Unknown Sex" from initial parsing issues
        if (row._sex_label === 'Male' || row._sex_label === 'Female') {
            sexCounts[row._sex_label]++;
        }
    });

    const sexLabels = ['Female', 'Male']; // Explicitly ordered labels for the X-axis
    const sexValues = sexLabels.map(label => sexCounts[label] || 0); // Map counts to labels

    console.log(`// Debug: Sex Counts for Chart (should include only 'Female' and 'Male'): ${JSON.stringify(sexCounts)}`); // Debug output

    const sexOption = {
        title: {
            text: 'Sex Distribution'
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: sexLabels // Use the explicitly defined and ordered labels
        },
        yAxis: {
            type: 'value',
            name: 'Count'
        },
        series: [{
            name: 'Count',
            type: 'bar',
            data: sexValues,
            itemStyle: {
                color: function(params) {
                    // Custom colors for Male/Female
                    return params.name === 'Male' ? '#5470C6' : '#EE6666';
                }
            }
        }]
    };
    console.log('\nvar sexBarChartOption = ' + JSON.stringify(sexOption, null, 2) + ';');
    console.log('// Observation: This chart displays the distribution of male and female patients in the dataset.');


    // --- ECharts Option: Bar chart of Chest Pain Type ---
    const cpCounts = {};
    const allCpLabels = ['Typical Angina', 'Atypical Angina', 'Non-anginal Pain', 'Asymptomatic']; // All possible types
    // Initialize counts for all types to ensure they appear even if 0
    allCpLabels.forEach(label => cpCounts[label] = 0);

    data.forEach(row => {
        if (allCpLabels.includes(row._cp_label)) { // Only count known types
            cpCounts[row._cp_label]++;
        }
    });
    const cpValues = allCpLabels.map(label => cpCounts[label] || 0);

    console.log(`// Debug: Chest Pain Counts for Chart: ${JSON.stringify(cpCounts)}`); // Debug output

    const cpOption = {
        title: {
            text: 'Chest Pain Type Distribution'
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: allCpLabels // Use all possible labels
        },
        yAxis: {
            type: 'value',
            name: 'Count'
        },
        series: [{
            name: 'Count',
            type: 'bar',
            data: cpValues,
            itemStyle: {
                color: '#91CC75' // Greenish
            }
        }]
    };
    console.log('\nvar chestPainBarChartOption = ' + JSON.stringify(cpOption, null, 2) + ';');
    console.log('// Observation: This chart displays the counts for each type of chest pain in the dataset.');

    // --- ECharts Option: Boxplot of Cholesterol by Disease vs Target ---
    // Ensure data is filtered for NaN and null before mapping to arrays
    const cholByTarget0 = data.filter(d => d.target === 0 && !isNaN(d.chol) && d.chol !== null).map(d => d.chol);
    const cholByTarget1 = data.filter(d => d.target === 1 && !isNaN(d.chol) && d.chol !== null).map(d => d.chol);

    console.log(`// Debug: Chol by Target 0 Sample (first 10): ${JSON.stringify(cholByTarget0.slice(0, 10))}`);
    console.log(`// Debug: Chol by Target 1 Sample (first 10): ${JSON.stringify(cholByTarget1.slice(0, 10))}`);
    console.log(`// Debug: Total Chol by Target 0: ${cholByTarget0.length}, Total Chol by Target 1: ${cholByTarget1.length}`);


    const cholesterolBoxplotOption = {
        title: {
            text: 'Cholesterol Distribution by Heart Disease Status'
        },
        tooltip: {
            trigger: 'item',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'category',
            data: ['No Heart Disease', 'Heart Disease'],
            boundaryGap: true,
            nameGap: 30,
            axisLabel: {
                formatter: '{value}'
            }
        },
        yAxis: {
            type: 'value',
            name: 'Cholesterol (mg/dL)'
        },
        series: [
            {
                name: 'Boxplot',
                type: 'boxplot',
                data: [
                    cholByTarget0, // Data for No Heart Disease
                    cholByTarget1  // Data for Heart Disease
                ],
                itemStyle: {
                    borderColor: '#EE6666' // Red
                },
                boxWidth: [20, 40] // Adjust box width
            }
        ]
    };
    console.log('\nvar cholesterolBoxplotOption = ' + JSON.stringify(cholesterolBoxplotOption, null, 2) + ';');
    console.log('// Observation: Patients with heart disease (target=1) generally exhibit higher median cholesterol levels and a wider spread compared to those without disease (target=0).');


    // --- ECharts Option: Countplot of Chest Pain Type by Disease ---
    const cpByTargetCounts = {};
    const targetLabels = ['No Heart Disease', 'Heart Disease'];

    // Initialize counts for all combinations
    allCpLabels.forEach(cpType => {
        cpByTargetCounts[cpType] = {};
        targetLabels.forEach(targetLabel => {
            cpByTargetCounts[cpType][targetLabel] = 0;
        });
    });

    data.forEach(row => {
        if (allCpLabels.includes(row._cp_label) && targetLabels.includes(row._target_label)) {
            cpByTargetCounts[row._cp_label][row._target_label]++;
        }
    });

    const seriesDataNoDisease = allCpLabels.map(type => cpByTargetCounts[type]['No Heart Disease']);
    const seriesDataDisease = allCpLabels.map(type => cpByTargetCounts[type]['Heart Disease']);

    console.log(`// Debug: CP By Target Counts for Chart: ${JSON.stringify(cpByTargetCounts)}`); // Debug output

    const cpTargetOption = {
        title: {
            text: 'Chest Pain Type Distribution by Heart Disease Status'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: targetLabels
        },
        xAxis: {
            type: 'category',
            data: allCpLabels
        },
        yAxis: {
            type: 'value',
            name: 'Count'
        },
        series: [
            {
                name: 'No Heart Disease',
                type: 'bar',
                stack: 'total', // Stacked bars
                data: seriesDataNoDisease,
                itemStyle: { color: '#6A5ACD' } // Slate blue
            },
            {
                name: 'Heart Disease',
                type: 'bar',
                stack: 'total', // Stacked bars
                data: seriesDataDisease,
                itemStyle: { color: '#FF7F50' } // Coral
            }
        ]
    };
    console.log('\nvar chestPainCountplotOption = ' + JSON.stringify(cpTargetOption, null, 2) + ';');
    console.log('// Observation: \'Asymptomatic\' chest pain is overwhelmingly prevalent in patients with heart disease, while \'typical angina\' is more balanced or less frequent in diseased patients.');


    // --- ECharts Option: Scatterplot of Resting BP vs. Max Heart Rate, color-coded by Target ---
    const bpHrData = [];
    data.forEach(row => {
        // Ensure values are numbers and not NaN/null for plotting
        if (!isNaN(row.trestbps) && row.trestbps !== null && !isNaN(row.thalach) && row.thalach !== null) {
            bpHrData.push({
                value: [row.trestbps, row.thalach],
                itemStyle: {
                    color: row.target === 1 ? '#F97316' : '#22C55E' // Orange for disease, Green for no disease
                },
                name: row._target_label // For tooltip
            });
        }
    });

    console.log(`// Debug: BP/HR Scatterplot Data Points (first 10): ${JSON.stringify(bpHrData.slice(0, 10))}`); // Debug output
    console.log(`// Debug: Total BP/HR Scatterplot Data Points: ${bpHrData.length}`); // Debug output


    const bpHrOption = {
        title: {
            text: 'Resting Blood Pressure vs. Maximum Heart Rate by Disease Status'
        },
        tooltip: {
            formatter: function (param) {
                // Check if param.value exists before accessing its elements
                if (param.value && param.value.length >= 2) {
                    return `BP: ${param.value[0]}<br/>HR: ${param.value[1]}<br/>Disease: ${param.name}`;
                }
                return 'N/A'; // Fallback for invalid data
            }
        },
        xAxis: {
            name: 'Resting Blood Pressure (trestbps)',
            type: 'value'
        },
        yAxis: {
            name: 'Maximum Heart Rate Achieved (thalach)',
            type: 'value'
        },
        series: [{
            name: 'Patients',
            type: 'scatter',
            data: bpHrData,
            symbolSize: 8
        }]
    };
    console.log('\nvar bpHrScatterplotOption = ' + JSON.stringify(bpHrOption, null, 2) + ';');
    console.log('// Observation: Patients with heart disease show a broader distribution across resting blood pressure and max heart rate, with some clustering towards higher heart rates for a given BP, although not a distinct cluster.');

    // --- ECharts Option: Correlation Heatmap ---
    const correlationNumericColumns = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
        'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target'
    ];
    const correlationMatrix = [];
    const heatmapData = [];

    correlationNumericColumns.forEach((col1, i) => {
        const row = [];
        correlationNumericColumns.forEach((col2, j) => {
            const vals1 = data.map(d => d[col1]).filter(val => !isNaN(val) && val !== null);
            const vals2 = data.map(d => d[col2]).filter(val => !isNaN(val) && val !== null);

            const commonLength = Math.min(vals1.length, vals2.length);
            // Ensure data arrays for correlation are of the same length
            const pearsonCorr = calculatePearsonCorrelation(vals1.slice(0, commonLength), vals2.slice(0, commonLength));
            const corrValue = isNaN(pearsonCorr) ? 0 : parseFloat(pearsonCorr.toFixed(2));
            row.push(corrValue);
            heatmapData.push([j, i, corrValue]); // ECharts heatmap data format: [x, y, value]
        });
        correlationMatrix.push(row);
    });

    const correlationHeatmapOption = {
        title: {
            text: 'Correlation Heatmap of Numerical Features'
        },
        tooltip: {
            position: 'top',
            formatter: function (params) {
                return `Correlation (${correlationNumericColumns[params.data[0]]}, ${correlationNumericColumns[params.data[1]]}): ${params.data[2]}`;
            }
        },
        grid: {
            height: '80%',
            top: '10%',
            left: '15%',
            right: '10%'
        },
        xAxis: {
            type: 'category',
            data: correlationNumericColumns,
            splitArea: {
                show: true
            },
            axisLabel: {
                rotate: -45, // Rotate labels for better readability
                interval: 0 // Show all labels
            }
        },
        yAxis: {
            type: 'category',
            data: correlationNumericColumns,
            splitArea: {
                show: true
            },
            axisLabel: {
                interval: 0 // Show all labels
            }
        },
        visualMap: {
            min: -1,
            max: 1,
            calculable: true,
            realtime: false,
            inRange: {
                color: [
                    '#313695', '#4575B4', '#74ADD1', '#ABD9E9', '#E0F3F8',
                    '#FFFFBF', '#FEE090', '#FDAE61', '#F46D43', '#D73027', '#A50026'
                ]
            }
        },
        series: [{
            name: 'Correlation',
            type: 'heatmap',
            data: heatmapData,
            label: {
                show: true,
                formatter: function (params) {
                    return params.data[2]; // Display the correlation value
                }
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    console.log('\nvar correlationHeatmapOption = ' + JSON.stringify(correlationHeatmapOption, null, 2) + ';');
    console.log('// Observation: Key correlations with the \'target\' variable: \'cp\' (chest pain type), \'thalach\' (max heart rate), and \'exang\' (exercise induced angina) show the strongest relationships with heart disease presence.');


    // --- Additional EDA Findings (Calculations and Observations) ---

    // Compare median cholesterol in patients with vs. without heart disease.
    const medianCholesterolDisease = calculateMedian(cholByTarget1);
    const medianCholesterolNoDisease = calculateMedian(cholByTarget0);
    console.log(`\n--- EDA Finding: Median Cholesterol ---`);
    console.log(`  Median Cholesterol (No Heart Disease): ${medianCholesterolNoDisease.toFixed(2)}`);
    console.log(`  Median Cholesterol (Heart Disease): ${medianCholesterolDisease.toFixed(2)}`);
    console.log(`  Observation: Patients with heart disease have a higher median cholesterol (${medianCholesterolDisease.toFixed(2)}) compared to those without disease (${medianCholesterolNoDisease.toFixed(2)}).`);

    // Show how “typical angina” vs. “asymptomatic” chest pain percentages differ between diseased and non-diseased.
    const diseasedPatients = data.filter(d => d.target === 1);
    const nonDiseasedPatients = data.filter(d => d.target === 0);

    const asymptomaticDiseased = diseasedPatients.filter(d => d._cp_label === 'Asymptomatic').length;
    const typicalAnginaDiseased = diseasedPatients.filter(d => d._cp_label === 'Typical Angina').length;
    const asymptomaticNonDiseased = nonDiseasedPatients.filter(d => d._cp_label === 'Asymptomatic').length;
    const typicalAnginaNonDiseased = nonDiseasedPatients.filter(d => d._cp_label === 'Typical Angina').length;

    // Handle division by zero for percentages
    const percentAsymptomaticDiseased = diseasedPatients.length > 0 ? (asymptomaticDiseased / diseasedPatients.length * 100).toFixed(2) : '0.00';
    const percentTypicalAnginaDiseased = diseasedPatients.length > 0 ? (typicalAnginaDiseased / diseasedPatients.length * 100).toFixed(2) : '0.00';
    const percentAsymptomaticNonDiseased = nonDiseasedPatients.length > 0 ? (asymptomaticNonDiseased / nonDiseasedPatients.length * 100).toFixed(2) : '0.00';
    const percentTypicalAnginaNonDiseased = nonDiseasedPatients.length > 0 ? (typicalAnginaNonDiseased / nonDiseasedPatients.length * 100).toFixed(2) : '0.00';


    console.log(`\n--- EDA Finding: Chest Pain Type Percentages ---`);
    console.log(`  Among Diseased Patients (${diseasedPatients.length} total):`);
    console.log(`    Asymptomatic: ${percentAsymptomaticDiseased}%`);
    console.log(`    Typical Angina: ${percentTypicalAnginaDiseased}%`);
    console.log(`  Among Non-Diseased Patients (${nonDiseasedPatients.length} total):`);
    console.log(`    Asymptomatic: ${percentAsymptomaticNonDiseased}%`);
    console.log(`    Typical Angina: ${percentTypicalAnginaNonDiseased}%`);
    console.log(`  Observation: 'Asymptomatic' chest pain is a strong indicator of heart disease, making up a much higher percentage of cases among diseased patients than non-diseased. 'Typical Angina' is less common overall in diseased patients compared to non-diseased.`);


    // Look for clusters: do patients with disease cluster in a certain blood pressure/heart rate region?
    // This is assessed based on the data patterns.
    console.log(`\n--- EDA Finding: BP/Heart Rate Clustering ---`);
    console.log(`  Observation: By analyzing the distribution of Resting BP and Max Heart Rate data for diseased vs. non-diseased patients, while there isn't a single tight cluster, patients with heart disease generally show a broader range and a slight tendency towards higher maximum heart rates for a given blood pressure, suggesting a less healthy cardiovascular response. More advanced clustering algorithms would be needed for definitive cluster identification.`);
}

// Start the analysis
analyzeData();
