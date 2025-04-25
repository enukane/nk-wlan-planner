// =============================================================================
// Antenna patterns
// =============================================================================
const AntennaPatternsList = [
  {
    "vendor": "Generic",
    "product": "Generic",
    "name": "Isotropic",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ]
  },
  {
    "vendor": "Juniper",
    "product": "Mist AP33",
    "name": "5.12GHz R0 phi90 Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [8, 8, 8, 5, 5, 5, 5, 5, 5, 5, 5, 0, -3, -5, -2, -3, -3, -5, -5]
  },
  {
    "vendor": "Cisco",
    "product": "C9130AXI",
    "name": "5GHz 5dBi Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      0,
      0,
      3,
      3,
      5,
      3,
      3,
      2,
      1,
      0,
      -1,
      -2,
      -3,
      -3,
      -5,
      -5 - 5,
      -7,
      -8
    ]
  },
  {
    "vendor": "TP-Link",
    "product": "EAP620HD",
    "name": "5.2GHz 5dBi Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -9,
      -7.5,
      -7.5,
      -5,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -3 - 5,
      -7.5,
      -10,
      -7.5,
      -7,
      -8,
      -1,
      -1
    ]
  },
  {
    "vendor": "H3C",
    "product": "WA6638",
    "name": "5GHz Radio1 Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -2.5,
      -2.5,
      -1.25 - 4,
      -1,
      0,
      1,
      -2,
      -5 - 10,
      -13,
      -10,
      -12,
      -11,
      -11,
      -12,
      -11,
      -11,
      -11,
      -11
    ]
  },
  {
    "vendor": "Aruba",
    "product": "AP550",
    "name": "5.18GHz 5Dbi Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -10,
      -7,
      -4,
      -2,
      0,
      -1,
      0,
      1,
      0,
      -2,
      -4,
      -5 - 7,
      -8,
      -9,
      -10,
      -12,
      -13,
      -22,
      -22
    ]
  },
  {
    "vendor": "Extreme",
    "product": "AP460C",
    "name": "5GHz Radio1 3.5dBi Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      0, 1, 1, 0, 0, 3, 3, 3, 2, 0, -3, -5, -8, -8, -9, -9, -9, -8, -7.5, -7.5
    ]
  },
  {
    "vendor": "Huawei",
    "product": "AirEngine 6761-21",
    "name": "5GHz 5.5dBi Horizontal",
    "peak_db": 5.5,
    "resolution": 10,
    "bias_map": [
      -8, -7, -2, 0, -2, -3, -3, -3, -3, -5, -7, -10, -15, -12, -17, -15, -20
      -16, -17, -17,
    ]
  },
  {
    "vendor": "Generic",
    "product": "Generic",
    "name": "0 dBi Directinal (half-angle 60)",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      0,
      -0.2,
      -1, // 0, 10, 20
      -2.5,
      -6,
      -20, // 30, 40, 50
      -30,
      -40,
      -40, // 60, 70, 80
      -40,
      -35,
      -35, // 90, 100, 120
      -25,
      -25,
      -25, // 120, 130, 140
      -25,
      -25,
      -25, // 150, 160, 170
      -40 // 180
    ]
  },
  {
    "vendor": "Buffalo",
    "product": "WLE-HG-DA",
    "name": "9dBi Horizontal",
    "peak_db": 9,
    "resolution": 10,
    "bias_map": [
      -0,
      -1,
      -2, // 0, 10, 20
      -3,
      -5,
      -8, // 30, 40, 50
      -10,
      -12,
      -18, // 60, 70, 80
      -23,
      -30,
      -30, // 90, 100, 120
      -20,
      -30,
      -30, // 120, 130, 140
      -30,
      -25,
      -22, // 150, 160, 170
      -18 // 180
    ]
  },
  {
    "vendor": "Cisco",
    "product": "CANT9103",
    "name": "6dBi Directional Horizontal",
    "peak_db": 0, // included
    "resolution": 10,
    "bias_map": [
      6,
      6,
      6, // 0, 10, 20
      6,
      3,
      0, // 30, 40, 50
      0,
      0,
      -5, // 60, 70, 80
      -10,
      -10,
      -10, // 90, 100, 110
      -15,
      -8,
      -8, // 120, 130, 140
      -10,
      -13,
      -15, // 150, 160, 170
      -25
    ]
  },
  {
    "vendor": "Aruba",
    "product": "ANT-4x4-5314",
    "name": "14dBi Directional Horizontal",
    "peak_db": 14,
    "resolution": 10,
    "bias_map": [
      0,
      -2,
      -5, //0
      -9,
      -20,
      -30, //30
      -29,
      -28,
      -30, //60
      -33,
      -37,
      -35, //90
      -38,
      -37,
      -40, //120
      -40,
      -40,
      -40, //150
      -40,
      -40 //1808
    ]
  },
  {
    "vendor": "Fortinet",
    "product": "FortiAP 431F",
    "name": "Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      4.6, 4.74, 4.49, 4, 3.7, 3.48, 3.65, 4.06, -0.07, -2.23, -3.43, -6.27,
      -3.37, -1.18, -4.34, -5.17, -5.49, -6.76, -7.06
    ]
  },
  {
    "vendor": "Fortinet",
    "product": "FortiAP 431G",
    "name": "Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      4.46, 5.5, 5.49, 7.67, 8.54, 7.08, 7.06, 6.65, 5.29, 3.85, 2.35, -0.18,
      -2.38, -2.77, -1.85, -3.32, -4.34, -5.67, -9.69
    ]
  },
  {
    "vendor": "YAMAHA",
    "product": "WLX323",
    "name": "Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -3.45, -3.97, -3.71, -2.15, -1.95, -1, -1.62, -2.31, -3.35, -3.94, -5.29,
      -6.61, -7.36, -10.21, -10.37, -12.54, -12.84, -13.48, -12.82
    ]
  },
  {
    "vendor": "TP-Link",
    "product": "EAP773",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -2.57, -1.32, -0.85, -1.69, -2.65, -3.69, -4.73, -5.07, -3.84, -3.86,
      -3.95, -5.22, -5.28, -5.94, -7.7, -8.05, -7.34, -11.65, -9
    ]
  },
  {
    "vendor": "NEC",
    "product": "QX-W1240",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -2.27, 0.39, 0.13, 1.15, 1.97, 0.07, -0.73, -4.18, -7.31, -10.94, -12.27,
      -14.82, -17.56, -19.52, -18.63, -18.78, -20.94, -20.88, -18.34
    ]
  },
  {
    "vendor": "Huawei",
    "product": "AirEngine 6761-22T",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -6.39, -6.4, -4.8, -3.01, -2.05, -0.62, 0.24, -2.23, -4.39, -6.83, -6.12,
      -5.27, -4.97, -8.41, -9.36, -8.95, -11.35, -12.61, -11.62
    ]
  },
  {
    "vendor": "YAMAHA",
    "product": "WLX222",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -1.7, -1.23, 0.01, 0.08, -0.67, 0.08, -1.84, -4.46, -7.04, -10.32, -11.73,
      -15.43, -16.24, -15.02, -21.94, -19.37, -20.99, -20.12, -22.2
    ]
  },
  {
    "vendor": "NEC",
    "product": "QX-W1130",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -3.67, -2.24, -0.6, 0.23, 1.83, 1.59, 1.44, 1.06, -0.85, -2.72, -5.55,
      -7.15, -8.67, -11.42, -13.28, -14.59, -16.08, -16.21, -16.4
    ]
  },
  {
    "vendor": "Juniper",
    "product": "Mist AP45",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      0.43, 2.07, 2.77, 5.97, 6.86, 6.92, 7.54, 6.47, 4.52, 1.74, 0.01, -0.17,
      -1.91, -5.3, -5.74, -8.24, -8.18, -9.97, -11.11
    ]
  },
  {
    "vendor": "TP-Link",
    "product": "EAP650",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      0.08, -0.22, -0.41, -0.81, -1.38, -1.45, -1.87, -1.96, -3.46, -3.38,
      -3.07, -5.45, -5.31, -5.48, -8.06, -8.45, -7.68, -13.04, -16.56
    ]
  },
  {
    "vendor": "TP-Link",
    "product": "EAP610-Outdoor",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -1.06, -0.46, -0.52, -1.76, -2.59, -3.7, -4.33, -4.9, -3.81, -3.49, -4.35,
      -5.96, -5.88, -6.39, -8.35, -7.64, -7, -10.6, -17.29
    ]
  },
  {
    "vendor": "Ruijie Networks",
    "product": "RG-AP880-AR",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      0.72, 3.73, 4.27, 5.43, 5.35, 4.14, 2.75, 1.87, 0.2, -2.23, -5.18, -7.51,
      -9.32, -8.92, -13.38, -11.54, -13.23, -17.71, -13.15
    ]
  },
  {
    "vendor": "Ubiquiti",
    "product": "U6 Enterprise",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      7.69, 8.7, 10.02, 8.65, 9.79, 7.89, 7, 6.74, 5.16, 3.46, 1.69, 2.04, 1.18,
      -2.79, 0.07, -0.68, -3.57, -3.9, -2.18
    ]
  },
  {
    "vendor": "Cisco",
    "product": "C9136I",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      4, 3.71, 4.23, 4.51, 4.28, 4.49, 5.1, 4.32, 3.62, 2.5, 1.91, 0.98, 0.68,
      0.82, -0.97, -2, -3.18, -3.86, -4
    ]
  },
  {
    "vendor": "Cisco",
    "product": "CW9166I",
    "name": "5GHz XOR Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -13.59, -10.16, -7.97, -4.88, -4.66, -1.44, -0.2, -0.38, -2.09, -5.05,
      -8.38, -11.93, -14.13, -16.03, -18.01, -17.75, -16.88, -15.62, -15.27
    ]
  },
  {
    "vendor": "Cisco",
    "product": "CW9166I",
    "name": "5GHz Client Serving Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -5.29, -4.17, -1.51, -1.46, -0.27, -0.16, -0.38, 0.11, -2.03, -2.29,
      -3.12, -3.78, -5.83, -5.66, -6.96, -6.98, -9.6, -8.09, -9.86
    ]
  },
  {
    "vendor": "Ubiquiti",
    "product": "NanoStation M2",
    "name": "2.4GHz Directional Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -0.19, -1.19, -5.31, -24.86, -15.72, -12.92, -13.92, -16.91, -19.96,
      -24.91, -23.22, -23.12, -21.79, -21.52, -21.74, -23.07, -20.59, -17.59,
      -16.13
    ]
  },
  {
    "vendor": "YAMAHA",
    "product": "WLX413",
    "name": "5GHz Ant1 Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -1.79,
      -2.27,
      -2.88,
      -1.84,
      -1.98,
      -0.7,
      0.16,
      -0.52,
      -0.84,
      -1.96,
      -1.19,
      -1.19,
      -4.07,
      -7.3,
      -11.85,
      -12,
      -11.07,
      -12.23,
      -13.75
    ]
  },
  {
    "vendor": "Huawei",
    "product": "AirEngine 6776-57T",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -0.11,
      -0.27,
      1.3,
      0.91,
      1.09,
      1.63,
      2.22,
      2.04,
      1.46,
      2.45,
      2.33,
      1.84,
      -0.9,
      -1.07,
      -0.31,
      -0.38,
      1.08,
      0.96,
      1.43
    ]
  },
  {
    "vendor": "Huawei",
    "product": "AirEngine 6776-57T",
    "name": "6GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      3,
      2.31,
      3.07,
      2.55,
      2.41,
      1.92,
      1.49,
      1.29,
      1.53,
      0.09,
      -0.23,
      -0.89,
      -1.35,
      1.25,
      -0.55,
      1.02,
      2.22,
      2.13,
      3.55
    ]
  },
  {
    "vendor": "Huawei",
    "product": "AirEngine 8771-X1T",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -2.52,
      -2.16,
      -2.34,
      -1.87,
      -2.12,
      -1.53,
      -2.85,
      -2.78,
      -4.26,
      -2.68,
      -1.41,
      -2.58,
      -2.66,
      -1.77,
      -0.87,
      -3.58,
      -1.93,
      -1.69,
      -0.79
    ]
  },
  {
    "vendor": "Huawei",
    "product": "AirEngine 8771-X1T",
    "name": "6GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -0.72,
      -1.01,
      0.23,
      -0.22,
      -1.53,
      -0.52,
      -0.55,
      -0.17,
      -1.4,
      0.18,
      -1.54,
      -1.81,
      0,
      -0.52,
      -3.3,
      -3.6,
      -3.01,
      -3.23,
      -2.33
    ]
  },
  {
    "vendor": "YAMAHA",
    "product": "WLX323",
    "name": "6GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -12.21,
      -7.44,
      -2.26,
      0.44,
      -0.16,
      0.2,
      -0.11,
      -0.58,
      -2.09,
      -3.01,
      -4.38,
      -6.79,
      -9.79,
      -13.74,
      -16.52,
      -19.69,
      -17.05,
      -27.46,
      -24.25
    ]
  },
  {
    "vendor": "Juniper",
    "product": "Mist AP 47",
    "name": "5GHz Ant1 Composite Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      7.39,
      7.34,
      6.25,
      5.4,
      5.52,
      5.95,
      6.03,
      6.75,
      6.55,
      4.17,
      2.02,
      -0.05,
      -1.18,
      -1.77,
      -2.03,
      -4.07,
      -5.91,
      -6.11,
      -7.09
    ]
  },
  {
    "vendor": "Juniper",
    "product": "Mist AP47",
    "name": "6GHz Ant1 Composite Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      9.8,
      9.63,
      9.11,
      7.18,
      5.98,
      5.13,
      4.3,
      3.98,
      4.28,
      2.53,
      0.52,
      -0.28,
      -3.21,
      -2.48,
      -0.46,
      -2.39,
      -4.96,
      -5.12,
      -7.37
    ]
  },
  {
    "vendor": "Cisco",
    "product": "CW9178I",
    "name": "5GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -3.71,
      0.54,
      3.36,
      2.99,
      5.49,
      7.11,
      8.14,
      7.51,
      6.83,
      4.76,
      1.37,
      -1.98,
      -3.96,
      -5.64,
      -7.06,
      -9.57,
      -11.82,
      -13.78,
      -16.61
    ]
  },
  {
    "vendor": "Cisco",
    "product": "CW9178I",
    "name": "6GHz Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      1.88,
      3.77,
      5.48,
      6.67,
      6.57,
      6.44,
      6.77,
      6.26,
      5.69,
      3.33,
      1.72,
      -0.06,
      -1.44,
      -1.77,
      -4.34,
      -6.23,
      -8.3,
      -12.09,
      -16.04
    ]
  },
  {
    "vendor": "H3C",
    "product": "WA7320i",
    "name": "6GHz Radio1 Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      -1.65,
      -1.24,
      -1.38,
      -1.18,
      0.26,
      0.24,
      -0.71,
      -1,
      -1.72,
      -3.04,
      -2.12,
      -0.57,
      1.17,
      0.51,
      -0.12,
      -0.02,
      -0.95,
      -1.44,
      -1.3
    ]
  },
  {
    "vendor": "H3C",
    "product": "WA7320i",
    "name": "5GHz Radio1 Horizontal",
    "peak_db": 0,
    "resolution": 10,
    "bias_map": [
      0.61,
      1.29,
      1.86,
      2.2,
      2.06,
      2.06,
      1.33,
      1.14,
      0.59,
      -0.2,
      -2.07,
      -2.29,
      -1.64,
      0.92,
      1.5,
      1.78,
      0.02,
      -0.9,
      -0.69
    ]
  }
];

const AntennaPatterns = {};
AntennaPatternsList.forEach((pattern, index) => {
  const vendor = pattern.vendor ? pattern.vendor.replace(" ", "_") : "Unknown";
  const product = pattern.product ? pattern.product.replace(" ", "_") : "Unknown";
  const name = pattern.name ? pattern.name.replace(" ", "_") : "Unknown";
  const key = `${vendor}-${product}-${name}`;
  AntennaPatterns[key] = {...pattern, key};
});