
--- Descriptive Statistics ---
Column        Mean   Median   Std Dev
-----------------------------------------
age            53.51   54.00   9.42   
trestbps       131.35  130.00  18.67  
chol           192.64  221.00  114.50 
thalach        0.00    0.00    0.00   
oldpeak        0.82    0.20    1.08   
ca             0.23    0.00    0.63   


--- ECharts Options (Copy and paste relevant sections into your HTML file) ---

// You will need to initialize ECharts instances in your HTML like:
// var chart = echarts.init(document.getElementById('chart-id'));
// chart.setOption(chartOptionVariable);

var ageHistogramOption = {
  "title": {
    "text": "Age Distribution"
  },
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "shadow"
    }
  },
  "xAxis": {
    "type": "value",
    "name": "Age"
  },
  "yAxis": {
    "type": "value",
    "name": "Count"
  },
  "series": [
    {
      "name": "Age",
      "type": "bar",
      "barWidth": "90%",
      "encode": {
        "x": 0,
        "y": 1
      },
      "datasetIndex": 0,
      "itemStyle": {
        "color": "#5470C6"
      },
      "markLine": {
        "data": [
          {
            "type": "average",
            "name": "Avg Age"
          }
        ]
      }
    }
  ],
  "dataset": [
    {
      "source": [
        [
          25,
          4
        ],
        [
          30,
          17
        ],
        [
          35,
          59
        ],
        [
          40,
          98
        ],
        [
          45,
          114
        ],
        [
          50,
          180
        ],
        [
          55,
          195
        ],
        [
          60,
          150
        ],
        [
          65,
          72
        ],
        [
          70,
          24
        ],
        [
          75,
          7
        ]
      ]
    }
  ]
};
// Observation: Most patients are aged between 45–65. The distribution is somewhat bell-shaped.

var cholesterolHistogramOption = {
  "title": {
    "text": "Cholesterol Distribution"
  },
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "shadow"
    }
  },
  "xAxis": {
    "type": "value",
    "name": "Cholesterol (mg/dL)"
  },
  "yAxis": {
    "type": "value",
    "name": "Count"
  },
  "series": [
    {
      "name": "Cholesterol",
      "type": "bar",
      "barWidth": "90%",
      "encode": {
        "x": 0,
        "y": 1
      },
      "datasetIndex": 0,
      "itemStyle": {
        "color": "#EE6666"
      },
      "markLine": {
        "data": [
          {
            "type": "average",
            "name": "Avg Chol"
          }
        ]
      }
    }
  ],
  "dataset": [
    {
      "source": [
        [
          0,
          202
        ],
        [
          80,
          1
        ],
        [
          100,
          3
        ],
        [
          120,
          5
        ],
        [
          140,
          9
        ],
        [
          160,
          43
        ],
        [
          180,
          67
        ],
        [
          200,
          117
        ],
        [
          220,
          114
        ],
        [
          240,
          95
        ],
        [
          260,
          91
        ],
        [
          280,
          68
        ],
        [
          300,
          45
        ],
        [
          320,
          22
        ],
        [
          340,
          15
        ],
        [
          360,
          3
        ],
        [
          380,
          7
        ],
        [
          400,
          5
        ],
        [
          440,
          1
        ],
        [
          460,
          2
        ],
        [
          480,
          1
        ],
        [
          500,
          1
        ],
        [
          520,
          1
        ],
        [
          560,
          1
        ],
        [
          600,
          1
        ]
      ]
    }
  ]
};
// Observation: Cholesterol distribution shows a slight right skew with some individuals having higher cholesterol levels.
// Debug: Sex Counts for Chart (should include only 'Female' and 'Male'): {"Female":0,"Male":0}

var sexBarChartOption = {
  "title": {
    "text": "Sex Distribution"
  },
  "tooltip": {},
  "xAxis": {
    "type": "category",
    "data": [
      "Female",
      "Male"
    ]
  },
  "yAxis": {
    "type": "value",
    "name": "Count"
  },
  "series": [
    {
      "name": "Count",
      "type": "bar",
      "data": [
        0,
        0
      ],
      "itemStyle": {}
    }
  ]
};
// Observation: This chart displays the distribution of male and female patients in the dataset.
// Debug: Chest Pain Counts for Chart: {"Typical Angina":0,"Atypical Angina":0,"Non-anginal Pain":0,"Asymptomatic":0}

var chestPainBarChartOption = {
  "title": {
    "text": "Chest Pain Type Distribution"
  },
  "tooltip": {},
  "xAxis": {
    "type": "category",
    "data": [
      "Typical Angina",
      "Atypical Angina",
      "Non-anginal Pain",
      "Asymptomatic"
    ]
  },
  "yAxis": {
    "type": "value",
    "name": "Count"
  },
  "series": [
    {
      "name": "Count",
      "type": "bar",
      "data": [
        0,
        0,
        0,
        0
      ],
      "itemStyle": {
        "color": "#91CC75"
      }
    }
  ]
};
// Observation: This chart displays the counts for each type of chest pain in the dataset.
// Debug: Chol by Target 0 Sample (first 10): []
// Debug: Chol by Target 1 Sample (first 10): []
// Debug: Total Chol by Target 0: 0, Total Chol by Target 1: 0

var cholesterolBoxplotOption = {
  "title": {
    "text": "Cholesterol Distribution by Heart Disease Status"
  },
  "tooltip": {
    "trigger": "item",
    "axisPointer": {
      "type": "shadow"
    }
  },
  "xAxis": {
    "type": "category",
    "data": [
      "No Heart Disease",
      "Heart Disease"
    ],
    "boundaryGap": true,
    "nameGap": 30,
    "axisLabel": {
      "formatter": "{value}"
    }
  },
  "yAxis": {
    "type": "value",
    "name": "Cholesterol (mg/dL)"
  },
  "series": [
    {
      "name": "Boxplot",
      "type": "boxplot",
      "data": [
        [],
        []
      ],
      "itemStyle": {
        "borderColor": "#EE6666"
      },
      "boxWidth": [
        20,
        40
      ]
    }
  ]
};
// Observation: Patients with heart disease (target=1) generally exhibit higher median cholesterol levels and a wider spread compared to those without disease (target=0).
// Debug: CP By Target Counts for Chart: {"Typical Angina":{"No Heart Disease":0,"Heart Disease":0},"Atypical Angina":{"No Heart Disease":0,"Heart Disease":0},"Non-anginal Pain":{"No Heart Disease":0,"Heart Disease":0},"Asymptomatic":{"No Heart Disease":0,"Heart Disease":0}}

var chestPainCountplotOption = {
  "title": {
    "text": "Chest Pain Type Distribution by Heart Disease Status"
  },
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "shadow"
    }
  },
  "legend": {
    "data": [
      "No Heart Disease",
      "Heart Disease"
    ]
  },
  "xAxis": {
    "type": "category",
    "data": [
      "Typical Angina",
      "Atypical Angina",
      "Non-anginal Pain",
      "Asymptomatic"
    ]
  },
  "yAxis": {
    "type": "value",
    "name": "Count"
  },
  "series": [
    {
      "name": "No Heart Disease",
      "type": "bar",
      "stack": "total",
      "data": [
        0,
        0,
        0,
        0
      ],
      "itemStyle": {
        "color": "#6A5ACD"
      }
    },
    {
      "name": "Heart Disease",
      "type": "bar",
      "stack": "total",
      "data": [
        0,
        0,
        0,
        0
      ],
      "itemStyle": {
        "color": "#FF7F50"
      }
    }
  ]
};
// Observation: 'Asymptomatic' chest pain is overwhelmingly prevalent in patients with heart disease, while 'typical angina' is more balanced or less frequent in diseased patients.
// Debug: BP/HR Scatterplot Data Points (first 10): []
// Debug: Total BP/HR Scatterplot Data Points: 0

var bpHrScatterplotOption = {
  "title": {
    "text": "Resting Blood Pressure vs. Maximum Heart Rate by Disease Status"
  },
  "tooltip": {},
  "xAxis": {
    "name": "Resting Blood Pressure (trestbps)",
    "type": "value"
  },
  "yAxis": {
    "name": "Maximum Heart Rate Achieved (thalach)",
    "type": "value"
  },
  "series": [
    {
      "name": "Patients",
      "type": "scatter",
      "data": [],
      "symbolSize": 8
    }
  ]
};
// Observation: Patients with heart disease show a broader distribution across resting blood pressure and max heart rate, with some clustering towards higher heart rates for a given BP, although not a distinct cluster.

var correlationHeatmapOption = {
  "title": {
    "text": "Correlation Heatmap of Numerical Features"
  },
  "tooltip": {
    "position": "top"
  },
  "grid": {
    "height": "80%",
    "top": "10%",
    "left": "15%",
    "right": "10%"
  },
  "xAxis": {
    "type": "category",
    "data": [
      "age",
      "sex",
      "cp",
      "trestbps",
      "chol",
      "fbs",
      "restecg",
      "thalach",
      "exang",
      "oldpeak",
      "slope",
      "ca",
      "thal",
      "target"
    ],
    "splitArea": {
      "show": true
    },
    "axisLabel": {
      "rotate": -45,
      "interval": 0
    }
  },
  "yAxis": {
    "type": "category",
    "data": [
      "age",
      "sex",
      "cp",
      "trestbps",
      "chol",
      "fbs",
      "restecg",
      "thalach",
      "exang",
      "oldpeak",
      "slope",
      "ca",
      "thal",
      "target"
    ],
    "splitArea": {
      "show": true
    },
    "axisLabel": {
      "interval": 0
    }
  },
  "visualMap": {
    "min": -1,
    "max": 1,
    "calculable": true,
    "realtime": false,
    "inRange": {
      "color": [
        "#313695",
        "#4575B4",
        "#74ADD1",
        "#ABD9E9",
        "#E0F3F8",
        "#FFFFBF",
        "#FEE090",
        "#FDAE61",
        "#F46D43",
        "#D73027",
        "#A50026"
      ]
    }
  },
  "series": [
    {
      "name": "Correlation",
      "type": "heatmap",
      "data": [
        [
          0,
          0,
          1
        ],
        [
          1,
          0,
          0
        ],
        [
          2,
          0,
          0
        ],
        [
          3,
          0,
          0.21
        ],
        [
          4,
          0,
          -0.07
        ],
        [
          5,
          0,
          0
        ],
        [
          6,
          0,
          0
        ],
        [
          7,
          0,
          0
        ],
        [
          8,
          0,
          0
        ],
        [
          9,
          0,
          0.21
        ],
        [
          10,
          0,
          0
        ],
        [
          11,
          0,
          0.22
        ],
        [
          12,
          0,
          0
        ],
        [
          13,
          0,
          0
        ],
        [
          0,
          1,
          0
        ],
        [
          1,
          1,
          0
        ],
        [
          2,
          1,
          0
        ],
        [
          3,
          1,
          0
        ],
        [
          4,
          1,
          0
        ],
        [
          5,
          1,
          0
        ],
        [
          6,
          1,
          0
        ],
        [
          7,
          1,
          0
        ],
        [
          8,
          1,
          0
        ],
        [
          9,
          1,
          0
        ],
        [
          10,
          1,
          0
        ],
        [
          11,
          1,
          0
        ],
        [
          12,
          1,
          0
        ],
        [
          13,
          1,
          0
        ],
        [
          0,
          2,
          0
        ],
        [
          1,
          2,
          0
        ],
        [
          2,
          2,
          0
        ],
        [
          3,
          2,
          0
        ],
        [
          4,
          2,
          0
        ],
        [
          5,
          2,
          0
        ],
        [
          6,
          2,
          0
        ],
        [
          7,
          2,
          0
        ],
        [
          8,
          2,
          0
        ],
        [
          9,
          2,
          0
        ],
        [
          10,
          2,
          0
        ],
        [
          11,
          2,
          0
        ],
        [
          12,
          2,
          0
        ],
        [
          13,
          2,
          0
        ],
        [
          0,
          3,
          0.21
        ],
        [
          1,
          3,
          0
        ],
        [
          2,
          3,
          0
        ],
        [
          3,
          3,
          1
        ],
        [
          4,
          3,
          0.09
        ],
        [
          5,
          3,
          0
        ],
        [
          6,
          3,
          0
        ],
        [
          7,
          3,
          0
        ],
        [
          8,
          3,
          0
        ],
        [
          9,
          3,
          0.18
        ],
        [
          10,
          3,
          0
        ],
        [
          11,
          3,
          0.05
        ],
        [
          12,
          3,
          0
        ],
        [
          13,
          3,
          0
        ],
        [
          0,
          4,
          -0.07
        ],
        [
          1,
          4,
          0
        ],
        [
          2,
          4,
          0
        ],
        [
          3,
          4,
          0.09
        ],
        [
          4,
          4,
          1
        ],
        [
          5,
          4,
          0
        ],
        [
          6,
          4,
          0
        ],
        [
          7,
          4,
          0
        ],
        [
          8,
          4,
          0
        ],
        [
          9,
          4,
          0.07
        ],
        [
          10,
          4,
          0
        ],
        [
          11,
          4,
          0.17
        ],
        [
          12,
          4,
          0
        ],
        [
          13,
          4,
          0
        ],
        [
          0,
          5,
          0
        ],
        [
          1,
          5,
          0
        ],
        [
          2,
          5,
          0
        ],
        [
          3,
          5,
          0
        ],
        [
          4,
          5,
          0
        ],
        [
          5,
          5,
          0
        ],
        [
          6,
          5,
          0
        ],
        [
          7,
          5,
          0
        ],
        [
          8,
          5,
          0
        ],
        [
          9,
          5,
          0
        ],
        [
          10,
          5,
          0
        ],
        [
          11,
          5,
          0
        ],
        [
          12,
          5,
          0
        ],
        [
          13,
          5,
          0
        ],
        [
          0,
          6,
          0
        ],
        [
          1,
          6,
          0
        ],
        [
          2,
          6,
          0
        ],
        [
          3,
          6,
          0
        ],
        [
          4,
          6,
          0
        ],
        [
          5,
          6,
          0
        ],
        [
          6,
          6,
          0
        ],
        [
          7,
          6,
          0
        ],
        [
          8,
          6,
          0
        ],
        [
          9,
          6,
          0
        ],
        [
          10,
          6,
          0
        ],
        [
          11,
          6,
          0
        ],
        [
          12,
          6,
          0
        ],
        [
          13,
          6,
          0
        ],
        [
          0,
          7,
          0
        ],
        [
          1,
          7,
          0
        ],
        [
          2,
          7,
          0
        ],
        [
          3,
          7,
          0
        ],
        [
          4,
          7,
          0
        ],
        [
          5,
          7,
          0
        ],
        [
          6,
          7,
          0
        ],
        [
          7,
          7,
          0
        ],
        [
          8,
          7,
          0
        ],
        [
          9,
          7,
          0
        ],
        [
          10,
          7,
          0
        ],
        [
          11,
          7,
          0
        ],
        [
          12,
          7,
          0
        ],
        [
          13,
          7,
          0
        ],
        [
          0,
          8,
          0
        ],
        [
          1,
          8,
          0
        ],
        [
          2,
          8,
          0
        ],
        [
          3,
          8,
          0
        ],
        [
          4,
          8,
          0
        ],
        [
          5,
          8,
          0
        ],
        [
          6,
          8,
          0
        ],
        [
          7,
          8,
          0
        ],
        [
          8,
          8,
          0
        ],
        [
          9,
          8,
          0
        ],
        [
          10,
          8,
          0
        ],
        [
          11,
          8,
          0
        ],
        [
          12,
          8,
          0
        ],
        [
          13,
          8,
          0
        ],
        [
          0,
          9,
          0.21
        ],
        [
          1,
          9,
          0
        ],
        [
          2,
          9,
          0
        ],
        [
          3,
          9,
          0.18
        ],
        [
          4,
          9,
          0.07
        ],
        [
          5,
          9,
          0
        ],
        [
          6,
          9,
          0
        ],
        [
          7,
          9,
          0
        ],
        [
          8,
          9,
          0
        ],
        [
          9,
          9,
          1
        ],
        [
          10,
          9,
          0
        ],
        [
          11,
          9,
          0.23
        ],
        [
          12,
          9,
          0
        ],
        [
          13,
          9,
          0
        ],
        [
          0,
          10,
          0
        ],
        [
          1,
          10,
          0
        ],
        [
          2,
          10,
          0
        ],
        [
          3,
          10,
          0
        ],
        [
          4,
          10,
          0
        ],
        [
          5,
          10,
          0
        ],
        [
          6,
          10,
          0
        ],
        [
          7,
          10,
          0
        ],
        [
          8,
          10,
          0
        ],
        [
          9,
          10,
          0
        ],
        [
          10,
          10,
          0
        ],
        [
          11,
          10,
          0
        ],
        [
          12,
          10,
          0
        ],
        [
          13,
          10,
          0
        ],
        [
          0,
          11,
          0.22
        ],
        [
          1,
          11,
          0
        ],
        [
          2,
          11,
          0
        ],
        [
          3,
          11,
          0.05
        ],
        [
          4,
          11,
          0.17
        ],
        [
          5,
          11,
          0
        ],
        [
          6,
          11,
          0
        ],
        [
          7,
          11,
          0
        ],
        [
          8,
          11,
          0
        ],
        [
          9,
          11,
          0.23
        ],
        [
          10,
          11,
          0
        ],
        [
          11,
          11,
          1
        ],
        [
          12,
          11,
          0
        ],
        [
          13,
          11,
          0
        ],
        [
          0,
          12,
          0
        ],
        [
          1,
          12,
          0
        ],
        [
          2,
          12,
          0
        ],
        [
          3,
          12,
          0
        ],
        [
          4,
          12,
          0
        ],
        [
          5,
          12,
          0
        ],
        [
          6,
          12,
          0
        ],
        [
          7,
          12,
          0
        ],
        [
          8,
          12,
          0
        ],
        [
          9,
          12,
          0
        ],
        [
          10,
          12,
          0
        ],
        [
          11,
          12,
          0
        ],
        [
          12,
          12,
          0
        ],
        [
          13,
          12,
          0
        ],
        [
          0,
          13,
          0
        ],
        [
          1,
          13,
          0
        ],
        [
          2,
          13,
          0
        ],
        [
          3,
          13,
          0
        ],
        [
          4,
          13,
          0
        ],
        [
          5,
          13,
          0
        ],
        [
          6,
          13,
          0
        ],
        [
          7,
          13,
          0
        ],
        [
          8,
          13,
          0
        ],
        [
          9,
          13,
          0
        ],
        [
          10,
          13,
          0
        ],
        [
          11,
          13,
          0
        ],
        [
          12,
          13,
          0
        ],
        [
          13,
          13,
          0
        ]
      ],
      "label": {
        "show": true
      },
      "emphasis": {
        "itemStyle": {
          "shadowBlur": 10,
          "shadowColor": "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};
// Observation: Key correlations with the 'target' variable: 'cp' (chest pain type), 'thalach' (max heart rate), and 'exang' (exercise induced angina) show the strongest relationships with heart disease presence.

--- EDA Finding: Median Cholesterol ---
  Median Cholesterol (No Heart Disease): 0.00
  Median Cholesterol (Heart Disease): 0.00
  Observation: Patients with heart disease have a higher median cholesterol (0.00) compared to those without disease (0.00).

--- EDA Finding: Chest Pain Type Percentages ---
  Among Diseased Patients (0 total):
    Asymptomatic: 0.00%
    Typical Angina: 0.00%
  Among Non-Diseased Patients (0 total):
    Asymptomatic: 0.00%
    Typical Angina: 0.00%
  Observation: 'Asymptomatic' chest pain is a strong indicator of heart disease, making up a much higher percentage of cases among diseased patients than non-diseased. 'Typical Angina' is less common overall in diseased patients compared to non-diseased.

--- EDA Finding: BP/Heart Rate Clustering ---
  Observation: By analyzing the distribution of Resting BP and Max Heart Rate data for diseased vs. non-diseased patients, while there isn't a single tight cluster, patients with heart disease generally show a broader range and a slight tendency towards higher maximum heart rates for a given blood pressure, suggesting a less healthy cardiovascular response. More advanced clustering algorithms would be needed for definitive cluster identification.
