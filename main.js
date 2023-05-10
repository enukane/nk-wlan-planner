var __canvas = document.getElementById("canvas-map");
__ctx = __canvas.getContext("2d");


var MapStatus = {
    NONE: 0,
    ADD_AP: 1,
    ADD_WALL: 2,
    ADDING_WALL: 3,
    DEL_AP: 4,
    ADD_HUMAN: 5,
    SELECT_SCALE: 6,
    SELECTING_SCALE: 7,
    DEL_WALL: 8,
    MODIFY_AP: 9,
    MEASURE_SCALE: 10,
    MEASURING_SCALE: 11,
    ADD_COVERAGE: 12,
    ADDING_COVERAGE: 13,
    DEL_COVERAGE: 14,
    ADD_SQUARED_WALL: 15,
    ADDING_SQUARED_WALL: 16,
}
var __map_status = 0;
const AP_SELECT_RANGE = 20 // px
var __ap_delete_range = 20 //px
var __default_status = "Press Button to operate"
var __shoulder_width_m = 0.43 //[m]

var __working_wall_coordinates = null;

var __selecting_scale = null;

var __ap_idx_selected = null;

var background_image = new Image();
var __map_file_name = background_image.src = "map.png";

var __coverage_list = []
var COVERAGE_THRESHOLD_DB = -55

var __frequency = 5180 * 1000 * 1000;
var AntennaPatterns = {
    FRONT0: {
        base: "MistAP33_5120M_R0_phi90",
        key: "FRONT0",
        name: "8dBi Directional (MistAP33)",
        peak_db: 0,
        resolution: 10,
        bias_map:  [
            8, 8, 8,
            5, 5, 5,
            5, 5, 5,
            5, 5, 0,
            -3, -5, -2,
            -3, -3, -5,
            -5
        ]
    },
    FRONT1: {
        base: "C9130AXI_5GHz",
        key: "FRONT1",
        name: "5dBi Directional (C9130AXI)",
        peak_db: 0,
        resolution: 10,
        bias_map: [
            0, 0, 3,
            3, 5, 3,
            3, 2, 1,
            0, -1, -2,
            -3, -3, -5,
            -5 -5, -7,
            -8
        ]
    },
    FRONT2: {
        base: "EAP620HD_5.25GHz",
        key: "FRONT2",
        name: "5dBi Directional (EAP620HD)",
        peak_db: 0,
        resolution: 10,
        bias_map: [
            -9, -7.5, -7.5,
            -5, -1, -1,
            -1, -1, -1,
            -1, -1, -3
            -5, -7.5, -10,
            -7.5, -7, -8,
            -1, -1
        ]
    },
    FRONT3: {
        base: "WA6638_Radio1_5GHz",
        key: "FRONT3",
        name: "5dBi Directional (WA6638)",
        peak_db: 0,
        resolution: 10,
        bias_map: [
            -2.5, -2.5, -1.25
            -4, -1, 0,
            1, -2, -5
            -10, -13, -10,
            -12, -11, -11,
            -12, -11, -11,
            -11, -11
        ]
    },
    ARUBA550: {
        base: "ARUBA550_5.18GHz",
        key: "ARUBA550",
        name: "5dBi Directional (AP550)",
        peak_db: 0,
        resolution: 10,
        bias_map: [
            -10, -7, -4,
            -2, 0, -1,
            0, 1, 0,
            -2, -4, -5
            -7, -8, -9,
            -10, -12, -13,
            -22, -22
        ]
    },
    AP460C: {
        base: "Extreme_AP460C_RADIO1_5GHz",
        key: "AP460C",
        name: "3.5dBi AP460C",
        peak_db: 0,
        resolution: 10,
        bias_map: [
            0, 1, 1,
            0, 0, 3,
            3, 3, 2,
            0, -3, -5,
            -8, -8, -9,
            -9, -9, -8,
            -7.5, -7.5
        ]
    },
    AE6761: {
        base: "Huawe_AirEngine_6761-21_5Ghz_Vertical",
        key: "AE6761",
        name: "5.5 dBi AE6761-21",
        peak_db: 5.5,
        resolution: 10,
        bias_map: [
            -8, -7, -2,
            0, -2, -3,
            -3, -3, -3,
            -5, -7, -10,
            -15, -12, -17,
            -15, -20, -16,
            -17, -17
        ]
    },
    STEEP0: {
        base: "",
        key: "STEEP0",
        name: "0 dBi Directional (half-angle 60)",
        peak_db: 0,
        resolution: 10, bias_map: [
        0, -0.2, -1,    // 0, 10, 20
        -2.5, -6, -20,  // 30, 40, 50
        -30, -40, -40,  // 60, 70, 80
        -40, -35, -35,  // 90, 100, 120
        -25, -25, -25,  // 120, 130, 140
        -25, -25, -25,  // 150, 160, 170
        -40             // 180
    ]},
    DIRPATCH0: {
        base: "WLE-HG-DA",
        key: "DIRPATCH0",
        name: "9dBi Directional (WLE-HG-DA)",
        peak_db: 9,
        resolution: 10,
        bias_map: [
            -0, -1, -2,    // 0, 10, 20
            -3, -5, -8,  // 30, 40, 50
            -10, -12, -18,  // 60, 70, 80
            -23, -30, -30,  // 90, 100, 120
            -20, -30, -30,  // 120, 130, 140
            -30, -25, -22,  // 150, 160, 170
            -18             // 180
        ],
    },
    DIRPATCH1: {
        base: "CANT9103",
        key: "DIRPATCH1",
        name: "6dBi Directional (CANT9103)",
        peak_db: 0, // included
        resolution: 10,
        bias_map: [
            6, 6, 6, // 0, 10, 20
            6, 3, 0, // 30, 40, 50
            0, 0, -5, // 60, 70, 80
            -10, -10, -10, // 90, 100, 110
            -15, -8, -8, // 120, 130, 140
            -10, -13, -15, // 150, 160, 170
            -25
        ]
    },
    DIRPATCH2: {
        base: "ANT-4x4-5314",
        key: "DIRPATCH2",
        name: "14dBi Directional (ANT-4x4-5314)",
        peak_db: 14,
        resolution: 10,
        bias_map: [
            0, -2, -5, //0
            -9, -20, -30, //30
            -29, -28, -30, //60
            -33, -37, -35, //90
            -38, -37, -40, //120
            -40, -40, -40, //150
            -40, -40 //1808
        ]
    },
    FAP431F:{
        "base": "",
        "key": "FAP431F",
        "name": "FortiAP-431F",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          4.6,
          4.74,
          4.49,
          4,
          3.7,
          3.48,
          3.65,
          4.06,
          -0.07,
          -2.23,
          -3.43,
          -6.27,
          -3.37,
          -1.18,
          -4.34,
          -5.17,
          -5.49,
          -6.76,
          -7.06
        ]
    },
    AE676122T:{
        "base": "AE6761-22T",
        "key": "AE676122T",
        "name": "AE6761-22T",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          -6.39,
          -6.4,
          -4.8,
          -3.01,
          -2.05,
          -0.62,
          0.24,
          -2.23,
          -4.39,
          -6.83,
          -6.12,
          -5.27,
          -4.97,
          -8.41,
          -9.36,
          -8.95,
          -11.35,
          -12.61,
          -11.62
        ]
      },
    WLX222: {
        "base": "WLX222",
        "key": "WLX222",
        "name": "WLX222",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          -1.7,
          -1.23,
          0.01,
          0.08,
          -0.67,
          0.08,
          -1.84,
          -4.46,
          -7.04,
          -10.32,
          -11.73,
          -15.43,
          -16.24,
          -15.02,
          -21.94,
          -19.37,
          -20.99,
          -20.12,
          -22.2
        ]
      },
    QXW1130:{
        "base": "QX-W1130",
        "key": "QXW1130",
        "name": "QX-W1130",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          -3.67,
          -2.24,
          -0.6,
          0.23,
          1.83,
          1.59,
          1.44,
          1.06,
          -0.85,
          -2.72,
          -5.55,
          -7.15,
          -8.67,
          -11.42,
          -13.28,
          -14.59,
          -16.08,
          -16.21,
          -16.4
        ]
      },
    MISTAP45:{
        "base": "MistAP45",
        "key": "MISTAP45",
        "name": "MistAP45",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          0.43,
          2.07,
          2.77,
          5.97,
          6.86,
          6.92,
          7.54,
          6.47,
          4.52,
          1.74,
          0.01,
          -0.17,
          -1.91,
          -5.3,
          -5.74,
          -8.24,
          -8.18,
          -9.97,
          -11.11
        ]
      },
    EAP650:{
        "base": "EAP650",
        "key": "EAP650",
        "name": "EAP650",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          0.08,
          -0.22,
          -0.41,
          -0.81,
          -1.38,
          -1.45,
          -1.87,
          -1.96,
          -3.46,
          -3.38,
          -3.07,
          -5.45,
          -5.31,
          -5.48,
          -8.06,
          -8.45,
          -7.68,
          -13.04,
          -16.56
        ]
      },
      EAP610Outdoor:{
        "base": "EAP610Outdoor",
        "key": "EAP610Outdoor",
        "name": "EAP610Outdoor",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          -1.06,
          -0.46,
          -0.52,
          -1.76,
          -2.59,
          -3.7,
          -4.33,
          -4.9,
          -3.81,
          -3.49,
          -4.35,
          -5.96,
          -5.88,
          -6.39,
          -8.35,
          -7.64,
          -7,
          -10.6,
          -17.29
        ]
      },
    RGAP880AR:{
        "base": "RG-AP880-AR",
        "key": "RGAP880AR",
        "name": "RG-AP880-AR",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          0.72,
          3.73,
          4.27,
          5.43,
          5.35,
          4.14,
          2.75,
          1.87,
          0.2,
          -2.23,
          -5.18,
          -7.51,
          -9.32,
          -8.92,
          -13.38,
          -11.54,
          -13.23,
          -17.71,
          -13.15
        ]
      },
    WAWAWA:{
        "base": "WAWAWA",
        "key": "WAWAWA",
        "name": "WAWAWA",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          -8.45,
          -5.47,
          -3.85,
          -2.85,
          -0.68,
          2.8,
          1.47,
          0.29,
          -1.07,
          -1.9,
          -3.64,
          -7.59,
          -6.49,
          -9.4,
          -11.99,
          -11.19,
          -13.38,
          -12.95,
          -10.17
        ]
      },
    U6ENT: {
        "base": "U6Enterprise",
        "key": "U6ENT",
        "name": "U6Enterprise",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          7.69,
          8.7,
          10.02,
          8.65,
          9.79,
          7.89,
          7,
          6.74,
          5.16,
          3.46,
          1.69,
          2.04,
          1.18,
          -2.79,
          0.07,
          -0.68,
          -3.57,
          -3.9,
          -2.18
        ]
      },
    C9136I: {
        "base": "C9136I",
        "key": "C9136I",
        "name": "C9136I",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          -1.31,
          -1.38,
          -0.67,
          -0.42,
          -1,
          -0.21,
          0.37,
          -1.16,
          -1.6,
          -2.51,
          -3.4,
          -4.13,
          -4.63,
          -5.12,
          -6.49,
          -7.57,
          -8.99,
          -9.75,
          -10.03
        ]
      },
    CW9166I_XOR:{
        "base": "CW9166I_XOR",
        "key": "CW9166I_XOR",
        "name": "CW9166I (5GHz XOR)",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          -13.59,
          -10.16,
          -7.97,
          -4.88,
          -4.66,
          -1.44,
          -0.2,
          -0.38,
          -2.09,
          -5.05,
          -8.38,
          -11.93,
          -14.13,
          -16.03,
          -18.01,
          -17.75,
          -16.88,
          -15.62,
          -15.27
        ]
      },
      CW9166I_CLT: {
        "base": "CW9166I_CLT",
        "key": "CW9166I_CLT",
        "name": "CW9166I (5GHz Client Serving)",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          -5.29,
          -4.17,
          -1.51,
          -1.46,
          -0.27,
          -0.16,
          -0.38,
          0.11,
          -2.03,
          -2.29,
          -3.12,
          -3.78,
          -5.83,
          -5.66,
          -6.96,
          -6.98,
          -9.6,
          -8.09,
          -9.86
        ]
    },
    NSM2:{
        "base": "NanoStationM2",
        "key": "NSM2",
        "name": "NanoStationM2",
        "peak_db": 0,
        "resolution": 10,
        "bias_map": [
          -0.19,
          -1.19,
          -5.31,
          -24.86,
          -15.72,
          -12.92,
          -13.92,
          -16.91,
          -19.96,
          -24.91,
          -23.22,
          -23.12,
          -21.79,
          -21.52,
          -21.74,
          -23.07,
          -20.59,
          -17.59,
          -16.13
        ]
      }
}
    
var appos_list = [
    { x: 176, y: 163, powerdb: 20.0 },
    { x: 537, y: 163, powerdb: 20.0 },
    { x: 927, y: 163, powerdb: 20.0 },
    { x: 115, y: 540, powerdb: 20.0 },
    { x: 1018, y: 624, powerdb: 20.0 },
    { x: 112, y: 372, powerdb: 20.0, direction: { degree: 0, pattern: AntennaPatterns.DIRPATCH0 } },
];

var attdb2color = [
    [4, "saddlebrown"],
    [7, "brown"],
    [11, "darkred"],
    [13, "purple"],
    [31, "indigo"],
]
/*
 * drywall: 3
 * bookchelf: 2
 * exteriorglass: 3
 * wooddoor: 6
 * marble: 6
 * brick: 10
 * concrete 12
 * elevator shaft: 30
*/
var obstacles_list = [
    // horizontal
    /// upper room
    { start: { x: 21, y: 301 }, end: { x: 1211, y: 301 }, attenuation: 12, material: "concrete" },
    /// lower room  left
    { start: { x: 21, y: 424 }, end: { x: 64, y: 424 }, attenuation: 3, material: "exteriorglass" },
    { start: { x: 64, y: 424 }, end: { x: 113, y: 424 }, attenuation: 6, material: "wooddoor" }, // door
    { start: { x: 113, y: 424 }, end: { x: 406, y: 424 }, attenuation: 3, material: "exteriorglass" },
    { start: { x: 406, y: 424 }, end: { x: 453, y: 424 }, attenuation: 6, material: "wooddoor" }, // door
    { start: { x: 453, y: 424 }, end: { x: 493, y: 424 }, attenuation: 3, material: "exteriorglass" },
    /// lower room right
    { start: { x: 742, y: 414 }, end: { x: 792, y: 414}, attenuation: 3, material: "exteriorglass" },
    { start: { x: 792, y: 414 }, end: { x: 837, y: 414 }, attenuation: 6, material: "wooddoor" }, // door
    { start: { x: 837, y: 414 }, end: { x: 1136, y: 414 }, attenuation: 3, material: "exteriorglass" },
    { start: { x: 1135, y: 414 }, end: { x: 1180, y: 414 }, attenuation: 6, material: "wooddoor" }, // door
    { start: { x: 1180, y: 414 }, end: { x: 1211, y: 414 }, attenuation: 3, material: "exteriorglass" },

    // vertical
    /// upper room, left to right
    { start: { x: 297, y: 36 }, end: { x: 297, y: 299 }, attenuation: 6, material: "concrete" },
    { start: { x: 576, y: 36 }, end: { x: 576, y: 299 }, attenuation: 6, material: "concrete" },
    { start: { x: 853, y: 36 }, end: { x: 853, y: 299 }, attenuation: 6, material: "concrete" },
    /// lower room, left to right
    { start: { x: 493, y: 424 }, end: { x: 493, y: 771 }, attenuation: 3, material: "exteriorglass" },
    { start: { x: 742, y: 414 }, end: { x: 742, y: 771 }, attenuation: 3, material: "exteriorglass" },

    // building wall
    /// horizontal
    { start: { x: 21, y: 39}, end: { x: 1210, y: 39}, attenuation: 12, material: "concrete"},
    { start: { x: 21, y: 770}, end: { x: 1210, y: 770}, attenuation: 12, material: "concrete"},
    /// vertical
    { start: { x: 21, y: 39}, end: { x: 21, y: 770}, attenuation: 12, material: "concrete"},
    { start: { x: 1210, y: 39}, end: { x: 1210, y: 770}, attenuation: 12, material: "concrete"},
];

function wall_type_to_params(type_s) {
    attdb = 0
    switch (type_s) {
        case "drywall":
            attdb = 3
            break
        case "bookshelf":
            attdb = 3
            break
        case "exteriorglass":
            attdb = 3
            break
        case "wooddoor":
            attdb = 6
            break
        case "marble":
            attdb = 6
            break
        case "brick":
            attdb = 10
            break
        case "concrete":
            attdb = 12
            break
        case "elevator-shaft":
            attdb = 30
            break
        case "humanbody":
            attdb = 6 /* 2.4: 4-9, 5: 6-12 */
            break
        default:
            attdb = 3
            type_s = "drywall"
            break;
    }

    return {attenuation: attdb, type: type_s}
}

function get_obstacle_color_from_attdb(attdb) {
    if (attdb == null || attdb == undefined) {
        return "black"
    }

    for (idx in attdb2color) {
        if (attdb2color[idx][0] > attdb) {
            return attdb2color[idx][1]
        }

    }
}

var selected_length_px_on_image = 1300;
var selected_length_meter = 60;
var __px2meter = selected_length_meter / selected_length_px_on_image; // [m/px]

var default_ap_powerdb = 17.0;

function init_matrix(xlim, ylim) {
    var matrix = new Array(ylim);
    for (y = 0; y < ylim; y++) {
        matrix[y] = new Array(xlim);
    }
    for (y = 0; y < matrix.length; y++) {
        for (x = 0; x < matrix[y].length; x++) {
            matrix[y][x] = null
        }
    }
    return matrix
}

function update_matrix_with_ap(matrix, powerdb, ap_x, ap_y, px2meter, freq_hz) {
    /* calculate */
    xbox = parseInt(ap_x / 5)
    ybox = parseInt(ap_y / 5)
    xboxcenter = xbox * 5 + 5 / 2
    yboxcenter = ybox * 5 + 5 / 2
    matrix[ybox][xbox] = powerdb
    //matrix[parseInt(apAtY/5)][parseInt(apAtX/5)] = powerdb

    //for (y = 0; y < matrix.length; y++) {
    //    for (x = 0; x < matrix[y].length; x++) {
    //        xPos = x * 5 + 5/2;
    //        yPos = y * 5 + 5/2;
    //        distM = Math.sqrt( Math.pow(Math.abs(xPos - xboxcenter) * px2meter, 2) + Math.pow(Math.abs(yPos - yboxcenter) * px2meter, 2))

    //        dBPowerAtXY = dBPower - calcFreeSpaceLossdB(freqHz, distM)
    //        //console.log(xPos, yPos, distM, dBPowerAtXY)
    //        if (matrix[y][x] == null || matrix[y][x] < dBPowerAtXY) {
    //            matrix[y][x] = dBPowerAtXY
    //        }

    //    }
    //}

    //iterativeUpdatedBPower(matrix, xbox, ybox, dBPower, px2meter, freqHz)
}

function calc_real_point(xbox, ybox) {
    xPos = x * 5 + 5 / 2;
    yPos = y * 5 + 5 / 2;
    return [xPos, yPos];
}

function calc_distance_m(x0, y0, x1, y1, px2meter) {
    return Math.sqrt(Math.pow(Math.abs(x0 - x1) * px2meter, 2) + Math.pow(Math.abs(y0 - y1) * px2meter, 2));
}

function calc_distance_px(x0, y0, x1, y1) {
    return calc_distance_m(x0, y0, x1, y1, 1)
}

function calc_distance_px_point2line(px, py, start_x, start_y, end_x, end_y) {
    nom = Math.abs( (end_x - start_x) * (start_y - py) - (start_x - px ) * (end_y - start_y) )
    denom = Math.sqrt ( Math.pow(end_x - start_x, 2) + Math.pow(end_y - start_y, 2) )
    return nom / denom
}

function is_line_crossing(a, b, c, d) {
    s = (a.x - b.x) * (c.y - a.y) - (a.y - b.y) * (c.x - a.x);
    t = (a.x - b.x) * (d.y - a.y) - (a.y - b.y) * (d.x - a.x);
    if (s * t > 0) {
        return false;
    }

    s = (c.x - d.x) * (a.y - c.y) - (c.y - d.y) * (a.x - c.x);
    t = (c.x - d.x) * (b.y - c.y) - (c.y - d.y) * (b.x - c.x);
    if (s * t > 0) {
        return false;
    }
    return true;
}

function is_point_in_rect(px, py, rect_x, rect_y, w, h) {
    if ((rect_x <= px && px <= (rect_x + w)) && (rect_y <= py && py <= (rect_y + h))) {
        return true
    }
    return false
}

function calc_obstacles_attenuation_db(pos, apPos, obstacles) {
    attdB = 0.0
    for (let idx in obstacles) {
        obstacle = obstacles[idx];
        if (is_line_crossing(pos, apPos, obstacle.start, obstacle.end)) {
            attdB += obstacle.attenuation
        }
    }
    return attdB;
}

function ary2coordinate(pos) {
    return { x: pos[0], y: pos[1] }
}

function degree2rad(degree) {
    return degree * (Math.PI / 180)
}

function rad2degree(rad) {
    return rad / (Math.PI / 180)
}

function line2rad(x0, y0, x1, y1) {
    let val =  Math.atan2(y1 - y0, x1 - x0)
    return val
}

function calc_directional_power_db_of_ap_to_xy(ap, xp, yp) {
    let appowerdb = ap.powerdb
    let ap_x = ap.x
    let ap_y = ap.y
    let ap_direction_rad = degree2rad(-1 * ap.direction.degree)
    let ap_xy_rad = line2rad(ap_x, ap_y, xp, yp)
    let diff_rad = 0
    if (ap_direction_rad > ap_xy_rad) {
        diff_rad = ap_direction_rad - ap_xy_rad
    } else {
        diff_rad = ap_xy_rad - ap_direction_rad
    }
    let dir_xy_rad = Math.abs(diff_rad)
    let dir_xy_deg = parseInt(rad2degree(dir_xy_rad))
    if (dir_xy_deg > 180) {
        dir_xy_deg = 360 - dir_xy_deg
    }
    dir_xy_deg = parseInt(dir_xy_deg / ap.direction.pattern.resolution)
    let biasdb = ap.direction.pattern.bias_map[dir_xy_deg]
    if (biasdb == null) {
        return appowerdb
    }

    return appowerdb + ap.direction.pattern.peak_db + biasdb
}

function reset_coverage_eval(coverages) {
    for (idx in coverages) {
        coverages[idx].eval = {
            count: 0,
            sum: 0,
            shortfall: 0,
        }
    }
}

function get_ap_db_for_xy(ap, x, y, obstacles, px2meter) {
    let cur_pos = calc_real_point(x, y)

    ap_pos = [ap.x, ap.y]
    /* detect crossing obstacles */
    obstaclesAttenuationdB = calc_obstacles_attenuation_db(
        ary2coordinate(cur_pos),
        ary2coordinate(ap_pos),
        obstacles
    )

    distM = calc_distance_m(cur_pos[0], cur_pos[1], ap_pos[0], ap_pos[1], px2meter)

    powerdb_at_xy = 0
    if (ap.direction == null) {
        powerdb_at_xy = ap.powerdb - obstaclesAttenuationdB - calc_free_space_loss_db(__frequency, distM);
    } else {
        powerdb_at_xy = calc_directional_power_db_of_ap_to_xy(ap, cur_pos[0], cur_pos[1]) - obstaclesAttenuationdB - calc_free_space_loss_db(__frequency, distM);
    }

    return powerdb_at_xy
}

function update_matrix(matrix, appos_list, obstacles, px2meter, frequency) {
    reset_coverage_eval(__coverage_list);

    for (y = 0; y < matrix.length; y++) {
        for (x = 0; x < matrix[y].length; x++) {
            cur_pos = calc_real_point(x, y)

            for (ap_idx in appos_list) {
                ap = appos_list[ap_idx]
                powerdb_at_xy = get_ap_db_for_xy(ap, x, y, obstacles, px2meter)
                //ap_pos = [appos_list[ap_idx].x, appos_list[ap_idx].y]
                ///* detect crossing obstacles */
                //obstaclesAttenuationdB = calc_obstacles_attenuation_db(
                //    ary2coordinate(cur_pos),
                //    ary2coordinate(ap_pos),
                //    obstacles
                //)

                //distM = calc_distance_m(cur_pos[0], cur_pos[1], ap_pos[0], ap_pos[1], px2meter)

                //powerdb_at_xy = 0
                //if (appos_list[ap_idx].direction == null) {
                //    powerdb_at_xy = appos_list[ap_idx].powerdb - obstaclesAttenuationdB - calc_free_space_loss_db(__frequency, distM);
                //} else {
                //    powerdb_at_xy = calc_directional_power_db_of_ap_to_xy(appos_list[ap_idx], cur_pos[0], cur_pos[1]) - obstaclesAttenuationdB - calc_free_space_loss_db(__frequency, distM);
                //}
                if (matrix[y][x] == null || matrix[y][x] < powerdb_at_xy) {
                    //console.log(apPosList[idx].powerdb, powerdb_at_xy)
                    matrix[y][x] = powerdb_at_xy
                }
            }

            // coverage check
            for (cv_idx in __coverage_list) {
                let coverage = __coverage_list[cv_idx]
                if (!is_point_in_rect(cur_pos[0], cur_pos[1], coverage.start.x, coverage.start.y, coverage.width, coverage.height)) {
                    continue
                }

                coverage.eval.count += 1
                coverage.eval.sum += matrix[y][x]
                if (matrix[y][x] < COVERAGE_THRESHOLD_DB) {
                    coverage.eval.shortfall += 1
                }
            }
        }
    }
}

//function iterativeUpdatedBPower(matrix, xBox, yBox, dBPower, px2meter, freqHz) {
//    console.log("updateint adjaectt (%d, %d) power=%d (current=%d)", xBox, yBox, dBPower, matrix[yBox][xBox])
//    console.log(matrix[yBox][xBox], dBPower)
//    if (matrix[yBox][xBox] != null) {
//        if (matrix[yBox][xBox] > dBPower) {
//            console.log("already highpower: OUT");
//            return;
//        }
//    }

//    if (dBPower < dBPowerLimit) {
//        console.log("power level too low");
//        return;
//    }

//    matrix[yBox][xBox] = dBPower;

//    xyLength = 5 * px2meter
//    diagonalLength = 5 * Math.sqrt(2) * px2meter;
//    xydBPower = dBPower - calc_free_space_loss_db(freqHz, xyLength)
//    nondiagonaldBPower = dBPower - calc_free_space_loss_db(freqHz, diagonalLength)

//    for (dY = -1; dY < 2; dY++) {
//        for (dX = -1; dX < 2; dX++) {
//            if (dX == 0 && dY == 0) {
//                continue
//            }
//            console.log(dX, dY, xBox, yBox)
//            if (Math.abs(dY) == Math.abs(dX)) {
//                iterativeUpdatedBPower(matrix, xBox + dX, yBox + dY, nondiagonaldBPower, px2meter, freqHz)
//            } else  {
//                iterativeUpdatedBPower(matrix, xBox + dX, yBox + dY, xydBPower, px2meter, freqHz)
//            }
//        }
//    }


//}

function dbm2mw(dbm) {
    return Math.pow(10, dbm / 10)
}

function mw2dbm(mw) {
    return 10 * Math.log10(mw)
}

function calc_free_space_loss_db(freq_hz, dist_m) {
    speed_of_light_mps = 299792458; // [m / s]
    wave_length = speed_of_light_mps / freq_hz;
    dB = 20 * Math.log10(4 * Math.PI * dist_m / wave_length)
    //los = Math.pow((4 * Math.PI * distM) / waveLength, 2);
    return dB
}

var dBPowerLimit = -96;
var dBPower2colors = [
    //[-15, "red"],
    //[-25, "red"],
    [-25, "red"],
    [-30, "orangered"],
    [-35, "orange"],
    [-40, "yellow"],
    [-45, "chartreuse"],
    [-50, "lime"],
    [-55, "green"],
    [-60, "cornflowerblue"],
    [-65, "blue"],
    [-70, "navy"],
    [-75, "darkblue"],
    [-80, "midnightblue"],
];

function calc_color_for_powerdb(dBPower) {
    if (dBPower == null) {
        return "none";
    }
    for (idx in dBPower2colors) {
        if (dBPower2colors[idx][0] < dBPower) {
            return dBPower2colors[idx][1];
        }
    }

    return "none"
}

function draw_xybox_in_color(xbox, ybox, color) {
    if (color == "none") {
        return;
    }
    x_0 = xbox * 5
    y_0 = ybox * 5

    __ctx.fillStyle = color
    __ctx.globalAlpha = 0.5
    __ctx.fillRect(x_0, y_0, 5, 5)
    __ctx.globalAlpha = 1.0
}

function draw_matrix(matrix) {
    //for (y in matrix) {
    for (y = 0; y < matrix.length; y++) {
        //for (x in matrix[y]) {
        for (x = 0; x < matrix[y].length; x++) {
            dBPower = matrix[y][x];
            color = calc_color_for_powerdb(dBPower)
            //console.log(x, y, color)
            draw_xybox_in_color(x, y, color)

        }
    }

}

function draw_obstacles(obstacles) {
    var canvas = document.getElementById("canvas-map");
    ctx = canvas.getContext("2d");
    for (idx in obstacles) {
        start = obstacles[idx].start
        end = obstacles[idx].end
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = get_obstacle_color_from_attdb(obstacles[idx].attenuation)
        ctx.lineWidth = 5;
        ctx.stroke();
    }
}

function draw_coverages(__coverage_list) {
    let canvas = document.getElementById("canvas-map");
    let ctx = canvas.getContext("2d");
    for (idx in __coverage_list) {
        let coverage = __coverage_list[idx]
        let start = coverage.start
        let w = coverage.width;
        let h = coverage.height

        ctx.fillStyle = 'aqua'
        ctx.globalAlpha=0.05
        console.log(start.x, start.y, w, h)
        ctx.fillRect(start.x, start.y, w, h)
        ctx.globalAlpha=0.8
        ctx.strokeStyle = 'aqua'
        ctx.strokeRect(start.x, start.y, w, h)
    }
}

function draw_circle(x, y, range) {
    __ctx.beginPath()
    __ctx.arc(x, y, range, 0 * Math.PI / 180, 360 * Math.PI / 180, false)
    __ctx.fillStyle = "black"
    __ctx.fill();
    __ctx.stroke()

}

function draw_line(x0, y0, x1, y1) {
    __ctx.beginPath();
    __ctx.moveTo(x0, y0);
    __ctx.lineTo(x1, y1)
    __ctx.strokeStyle = "black"
    __ctx.lineWidth=1
    __ctx.stroke();

}

function draw_text_centered(x, y, width, text) {
    __ctx.textAlign = "center";
    __ctx.fillStyle = "black"
    __ctx.font = "15px Arial"
    __ctx.fillText(text, x, y, width)
}

function draw_scale(px2meter) {
    draw_line(25, 15, 25, 21);
    draw_line(75, 15, 75, 21);
    draw_line(25, 18, 75, 18);

    meter_for_50px = (50 * __px2meter).toFixed(1)
    draw_text_centered(50, 15, 50, meter_for_50px + " m")

}

function update_coverages_score(coverages) {
    let str = ""
    for (let idx in coverages) {
        let coverage = coverages[idx]
        let perc = ((coverage.eval.count - coverage.eval.shortfall) / coverage.eval.count * 100)
        str = str + perc.toFixed(1) + "% "
    }
    $("#coverage-status").text("Coverage Evaluation: " + str)

}

function redraw_map() {
    var canvas = document.getElementById("canvas-map");

    __ctx.clearRect(0, 0, canvas.width, canvas.height)

    img_w = background_image.width
    img_h = background_image.height
    canvas_img_w = canvas_w = canvas.width
    canvas_img_h = canvas_h = canvas.height

    fit_rate_x = canvas_w / img_w
    fit_rate_y = canvas_h / img_h
    fit_rate = 1.0

    if (fit_rate_x > fit_rate_y) {
        fit_rate = fit_rate_y
    } else {
        fit_rate = fit_rate_x
    }

    canvas_img_w = img_w * fit_rate
    canvas_img_h = img_h * fit_rate

    //console.log("rate=", rate, rate_x, rate_y, canvas_x_max, canvas_y_max, img_x_max, img_y_max)
    console.log("image plot (%d, %d) screen, img (%d, %d) transporm to (%d, %d)",
        canvas_w, canvas_h, img_w, img_h, canvas_img_w, canvas_img_h)
    __ctx.drawImage(background_image,
        0, 0, background_image.width, background_image.height,
        0, 0, canvas_img_w, canvas_img_h);

    xLim = canvas_img_w
    yLim = canvas_img_h

    xbox_max = parseInt(xLim / 5);
    ybo_max = parseInt(yLim / 5)
    console.log(xbox_max, ybo_max);

    matrix = init_matrix(xbox_max, ybo_max);
    //console.log("inited", matrix)

    // fill ap
    for (key in appos_list) {
        update_matrix_with_ap(matrix, default_ap_powerdb, appos_list[key].x, appos_list[key].y, __px2meter, __frequency)
    }
    update_matrix(matrix, appos_list, obstacles_list, __px2meter, __frequency)

    draw_matrix(matrix)
    //console.log("drawn", matrix);
    draw_obstacles(obstacles_list);

    draw_scale(__px2meter)

    draw_coverages(__coverage_list)

    update_coverages_score(__coverage_list)
}

background_image.onload = function () {
    redraw_map()
}

function update_status(text) {
    $("#map-status").text(text)
}

function add_new_coverage(start, end) {
    let start_x = start.x
    let end_x = end.x
    let start_y = start.y
    let end_y = end.y
    if (start.x > end.x) {
        start_x = end.x
        end_x = start.x
    } 
    if (start.y > end.y) {
        start_y = end.y
        end_y = start.y
    }

    let w = end_x - start_x
    let h = end_y - start_y
    __coverage_list.unshift(
        {
            start: {
                x: start_x,
                y: start_y,
            },
            width: w,
            height: h,
        }
    )
}

/* event handler */
function map_click_to_add_ap(x, y) {
    let new_ap = {
        x: x, 
        y: y,
        powerdb: 20.0, /* XXX */
        direction: null,
    }
    let powerdb = parseInt($("#ap-param-powerdb").val())
    new_ap.powerdb = powerdb
    let angle_deg = parseInt($("#ap-param-antenna-angle").val())
    let antpattern_s = $("#ap-param-antenna-type").val()
    if (AntennaPatterns[antpattern_s] != undefined) {
        new_ap.direction = {
            degree: angle_deg,
            pattern: AntennaPatterns[antpattern_s],
        }
    }


    console.log("add_ap: ", new_ap)
    appos_list.push(new_ap)

    __map_status = MapStatus.NONE;
    update_status("AP added")

    redraw_map()
}

function find_ap_in_range_from_coordination(x, y, range) {
    let found_idx = null
    for (let ap_idx in appos_list) {
        let ap = appos_list[ap_idx]
        if (ap == null) {
            continue
        }

        let distM = calc_distance_px(x, y, ap.x, ap.y)
        if (distM < range) {
            found_idx = ap_idx
            break
        }
    }

    return found_idx
}

function map_click_to_modify_ap(x, y) {
    let idx = find_ap_in_range_from_coordination(x, y, AP_SELECT_RANGE)
    if (idx == null) {
        update_status("AP out of range, done selecting");
        return;
    }

    let ap = appos_list[idx];
    draw_text_centered(ap.x, ap.y, 50, "▲")

    __ap_idx_selected = idx;
    let powerdb = ap.powerdb;
    let direction = ap.direction

    $("#ap-param-powerdb").val(powerdb)
    if (direction) {
        $("#ap-param-antenna-type").val(direction.pattern.key)
        $("#ap-param-antenna-angle").val(direction.degree)
    }

    $("#button-apply-ap-param").prop("disabled", false)

    update_status("modify AP parameters and press Apply button")
    __map_status = MapStatus.NONE
}

function map_click_to_del_ap(x, y) {
    del_idx = null
    for (ap_idx in appos_list) {
        ap = appos_list[ap_idx]
        if (ap == null) {
            continue
        }

        distM = calc_distance_px(x, y, ap.x, ap.y)
        console.log("dist: ", distM, x, y, ap.x, ap.y)
        if (distM < __ap_delete_range) {
            del_idx = ap_idx
            break
        }
    }
    console.log("del_idx:", del_idx)
    if (del_idx != null) {
        appos_list.splice(del_idx, 1)
    } 
    
    __map_status = MapStatus.NONE;
    update_status("AP deleted")

    redraw_map()
}

function map_click_to_add_human(x, y) {
    human_params = wall_type_to_params("humanbody")
    angle_radian = Math.floor(Math.random() * 180) * (Math.PI / 180)
    end_x = Math.cos(angle_radian) * (__shoulder_width_m / __px2meter) + x
    end_y = Math.sin(angle_radian) * (__shoulder_width_m / __px2meter) + y

    obstacle = new_wall()
    obstacle.start.x = x
    obstacle.start.y = y
    obstacle.end.x = end_x
    obstacle.end.y = end_y
    obstacle.attenuation = human_params.attenuation
    obstacle.material = "humanbody"

    console.log("add human : ", obstacle)

    obstacles_list.push(obstacle)

    update_status("Added human body")
    __map_status = MapStatus.NONE
    redraw_map()
}

function map_click_to_del_wall(x, y) {
    del_idx = null
    for (obstacle_idx in obstacles_list) {
        obstacle = obstacles_list[obstacle_idx]
        if (obstacle == null) {
            continue
        }

        start_x = obstacle.start.x
        start_y = obstacle.start.y
        end_x = obstacle.end.x
        end_y = obstacle.end.y

        distM = calc_distance_px_point2line(x, y, start_x, start_y, end_x, end_y)
        if (distM < __ap_delete_range) {
            del_idx = obstacle_idx
            break
        }
    }

    console.log("del_idx: ", del_idx)
    if (del_idx != null) {
        obstacles_list.splice(del_idx, 1)
    }

    update_status("Deleted wall")
    __map_status = MapStatus.NONE
    redraw_map()
}

function map_click_to_del_coverage(x, y) {
    let del_idx = null
    for (idx in __coverage_list) {
        coverage = __coverage_list[idx]
        if (coverage == null) {
            continue
        }

        if (is_point_in_rect(x, y, coverage.start.x, coverage.start.y, coverage.width, coverage.height)) {
            del_idx = idx
            break
        }
    }

    if (del_idx != null) {
        __coverage_list.splice(del_idx, 1)
        update_status("coverage deleted")
    } else {
        update_status("no matching coverage to delete")
    }

    __map_status = MapStatus.NONE;

    redraw_map()
}

function get_map_mouse_coordinate(e) {
    var mapOffset = document.querySelector("canvas").getBoundingClientRect();//$("#canvas-map").getBoundingClientRect();
    mouseX = parseInt(e.clientX - mapOffset.left);
    mouseY = parseInt(e.clientY - mapOffset.top);

    return {x: mouseX, y: mouseY}
}

function map_click(e) {
    xy = get_map_mouse_coordinate(e)
    mouseX = xy.x
    mouseY = xy.y

    switch (__map_status) {
        case MapStatus.NONE:
            /* do nothing */
            console.log(mouseX, mouseY)
            break;
        case MapStatus.ADD_AP:
            map_click_to_add_ap(mouseX, mouseY)
            break;
        case MapStatus.MODIFY_AP:
            map_click_to_modify_ap(mouseX, mouseY)
            break;
        case MapStatus.DEL_AP:
            map_click_to_del_ap(mouseX, mouseY)
            break;
        case MapStatus.ADD_HUMAN:
            map_click_to_add_human(mouseX, mouseY)
            break
        case MapStatus.DEL_WALL:
            map_click_to_del_wall(mouseX, mouseY)
            break
        case MapStatus.DEL_COVERAGE:
            map_click_to_del_coverage(mouseX, mouseY)
            break
        default:
            break;
    }
}

function add_squared_wall_to_list(wall_coordinates, list)
{
    let p0 = wall_coordinates.start
    let p1 = wall_coordinates.end
    // patterns:　(x0, y0) to (x1, y1)
    //   up:    (x0, y0) - (x1, y0) 
    //   left:  (x0, y0) - (x0, y1)
    //   right: (x1, y0) - (x1, y1)
    //   bottom:(x0, y1) - (x1, y1)

    let patterns = [
        { start: {x: p0.x, y: p0.y }, end: {x: p1.x, y: p0.y }},
        { start: {x: p0.x, y: p0.y }, end: {x: p0.x, y: p1.y }},
        { start: {x: p1.x, y: p0.y }, end: {x: p1.x, y: p1.y }},
        { start: {x: p0.x, y: p1.y }, end: {x: p1.x, y: p1.y }},
    ]

    for (let idx in patterns) {
        let wall = new_wall()
        wall.attenuation = wall_coordinates.attenuation
        wall.material = wall_coordinates.material

        wall.start = patterns[idx].start
        wall.end = patterns[idx].end

        list.push(wall)
        wall = null
    }
}

function new_wall() {
    return {
        start: {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 0
        },
        attenuation: 12,
        material: "concrete"
    }
}

function new_scale() {
    return {
        start : {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 0
        },
        px: 0.0,
        meter: 0.0,
        px2meter: 0.0
    }
}

function get_selected_wall_type() {
    type_s = $("#select-wall-type").val()
    console.log(type_s)
    return type_s
}

function get_scale_meter() {
    meter = parseFloat($("#text-scale-meter").val())
    if (meter < 0.0) {
        meter = 1.0 // never under 0
    }
    return meter
}

function map_mousedown(e) {
    xy = get_map_mouse_coordinate(e)
    switch (__map_status) {
        case MapStatus.ADD_WALL:
            __working_wall_coordinates = new_wall();
            __working_wall_coordinates.start.x = xy.x
            __working_wall_coordinates.start.y = xy.y

            type_s = get_selected_wall_type()
            param = wall_type_to_params(type_s)
            console.log(param)
            __working_wall_coordinates.attenuation = param.attenuation
            __working_wall_coordinates.material = param.type

            __map_status = MapStatus.ADDING_WALL
            break;
        case MapStatus.ADD_SQUARED_WALL:
            __working_wall_coordinates = new_wall();
            __working_wall_coordinates.start.x = xy.x
            __working_wall_coordinates.start.y = xy.y
            type_s = get_selected_wall_type()
            param = wall_type_to_params(type_s)
            console.log(param)
            __working_wall_coordinates.attenuation = param.attenuation
            __working_wall_coordinates.material = param.type

            __map_status = MapStatus.ADDING_SQUARED_WALL
            break
        case MapStatus.SELECT_SCALE:
            __selecting_scale = new_scale()
            __selecting_scale.start.x = xy.x
            __selecting_scale.start.y = xy.y
            __map_status = MapStatus.SELECTING_SCALE
            break;
        case MapStatus.MEASURE_SCALE:
            __selecting_scale = new_scale();
            __selecting_scale.start.x = xy.x
            __selecting_scale.start.y = xy.y
            __map_status = MapStatus.MEASURING_SCALE
            break;
        case MapStatus.ADD_COVERAGE:
            __selecting_scale = new_scale()
            __selecting_scale.start.x = xy.x
            __selecting_scale.start.y = xy.y
            __map_status = MapStatus.ADDING_COVERAGE
            break
        default:
            break;
    }
}

function map_mouseup(e) {
    xy = get_map_mouse_coordinate(e)
    switch (__map_status) {
        case MapStatus.ADD_WALL:
        case MapStatus.SELECT_SCALE:
            __map_status = MapStatus.NONE;
            update_status(__default_status)
            break;
        case MapStatus.ADDING_WALL:
            __working_wall_coordinates.end.x = xy.x
            __working_wall_coordinates.end.y = xy.y
            obstacles_list.push(__working_wall_coordinates)
            __working_wall_coordinates = null
            __map_status = MapStatus.NONE
            redraw_map();
            update_status(__default_status)
            break;
        case MapStatus.ADDING_SQUARED_WALL:
            __working_wall_coordinates.end.x = xy.x
            __working_wall_coordinates.end.y = xy.y
            add_squared_wall_to_list(__working_wall_coordinates, obstacles_list)
            __working_wall_coordinates = null
            __map_status = MapStatus.NONE
            redraw_map()
            update_status(__default_status)
            break
        case MapStatus.SELECTING_SCALE:
            __selecting_scale.end.x = xy.x
            __selecting_scale.end.y = xy.y

            meter = get_scale_meter()
            px = calc_distance_px(
                __selecting_scale.start.x, __selecting_scale.start.y,
                __selecting_scale.end.x, __selecting_scale.end.y
            )
            selected_length_px_on_image = px
            selected_length_meter = meter
            __px2meter = selected_length_meter / selected_length_px_on_image
            console.log("new px2meter meter=%f, px=%f, px2meter=%f", meter, px, __px2meter)

            __selecting_scale = null
            __map_status = MapStatus.NONE
            redraw_map();
            update_status(__default_status);
            break;
        case MapStatus.MEASURING_SCALE:
            __selecting_scale.end.x = xy.x
            __selecting_scale.end.y = xy.y

            let m = calc_distance_m(
                __selecting_scale.start.x,
                __selecting_scale.start.y,
                xy.x,
                xy.y,
                __px2meter
            )

            update_status("selected length is " + m.toFixed(1) + " [m]")
            __selecting_scale = null
            __map_status = MapStatus.NONE
            break;
        case MapStatus.ADDING_COVERAGE:
            __selecting_scale.end.x = xy.x
            __selecting_scale.end.y = xy.y

            add_new_coverage(
                __selecting_scale.start,
                __selecting_scale.end
            )

            redraw_map()
            update_status("added coverage")
            __selecting_scale = null
            __map_status = MapStatus.NONE
            break;
        default:
            break;
    }
}

function clear_ap(e) {
    update_status("cleared all AP")

    appos_list = []
    redraw_map()
}

function add_ap(e) {
    update_status("click on map to add AP, press button to stop")
    $("button-add-ap").text()
    __map_status = MapStatus.ADD_AP
}

function modify_ap(e) {
    update_status("click on map to select AP")
    __map_status = MapStatus.MODIFY_AP
}

function del_ap(e) {
    update_status("click on map to delete AP")
    __map_status = MapStatus.DEL_AP
}

function apply_ap(e) {
    if(__ap_idx_selected == null) {
        return;
    }

    appos_list[__ap_idx_selected].powerdb = parseInt($("#ap-param-powerdb").val())
    let pattern = $("#ap-param-antenna-type").val()
    if (pattern != 0) {
        let degree = $("#ap-param-antenna-angle").val()
        appos_list[__ap_idx_selected].direction = {
            degree: degree,
            pattern: AntennaPatterns[pattern],
        }
    } else {
        appos_list[__ap_idx_selected].direction = null
    }

    __ap_idx_selected = null

    $("#button-apply-ap-param").prop("disabled", true)

    redraw_map()

    update_status("AP parameters updated")
}

function add_wall(e) {
    update_status("drag to draw wall")
    __map_status = MapStatus.ADD_WALL
}

function add_squared_wall(e) {
    update_status("drat to draw square of wall")
    __map_status = MapStatus.ADD_SQUARED_WALL
}

function del_wall(e) {
    update_status("click on map to delete wall")
    __map_status = MapStatus.DEL_WALL;
}

function clear_wall(e) {
    update_status("cleared all wall")
    obstacles_list = []
    redraw_map()
}

function add_human_body(e) {
    update_status("click on map to add human body")
    __map_status = MapStatus.ADD_HUMAN
}

function change_freqhz(e) {
    console.log(e)
    __frequency = parseInt(e.currentTarget.value)
    redraw_map()
}

function select_scale(e) {
    update_status("drag to select scale [m]")
    __map_status = MapStatus.SELECT_SCALE
}

function measure_scale(e) {
    update_status("drag to measure scale [m]")
    __map_status = MapStatus.MEASURE_SCALE
}

function change_image(e) {
    console.log("change_image");
    var file = e.target.files[0];
    console.log("change_image file=", file)

    __map_file_name = file.name;

    if (!file.type.match('image/.*')) {
        update_status("Unknown file type. Select image");
        return;
    }

    var reader = new FileReader();
    reader.onload = function() {
        var imgsrc = reader.result;
        background_image.src = imgsrc
        background_image.onload = function () {
            redraw_map()
        }
    }
    reader.readAsDataURL(file)
}

function add_coverage(e) {
    update_status("drag to add coverage")
    __map_status = MapStatus.ADD_COVERAGE
}

function del_coverage(e) {
    update_status("click map to delete coverage")
    __map_status = MapStatus.DEL_COVERAGE
}

function download_clicked() {
    let config_obj = {
        ap: appos_list,
        obstacles: obstacles_list,
        map_image_file: __map_file_name,
        px2meter: __px2meter
    }
    let config_s = JSON.stringify(config_obj)
    let blob = new Blob([config_s], {type: 'application/json'})
    let url = URL.createObjectURL(blob)

    let anchor = document.createElement('a')
    anchor.setAttribute('href', url)
    anchor.setAttribute('download', "config.json")

    let mouse_event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
    })

    anchor.dispatchEvent(mouse_event)
}

function change_config(e) {
    var file = e.target.files[0];
    console.log("change_config file=", file)

    if (!file.type.match("application/json")) {
        update_status("Unknown config file type. Select json");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var config_json = JSON.parse(reader.result)
        console.log(config_json)

        if (!config_json.ap || !config_json.obstacles || !config_json.px2meter) {
            update_status("Irregular config detected: no ap or obstacles or px2meter")
        }

        appos_list = config_json.ap
        obstacles_list = config_json.obstacles
        __px2meter = config_json.px2meter

        update_status("Loading config done")

        redraw_map()

    }
    reader.readAsText(file)

}

function download_image(e) {
    let download_link = document.createElement("a")
    let fname = "map_" + String(Date.now()) + ".png"
    download_link.setAttribute("download", fname)

    let canvas = document.getElementById("canvas-map")
    canvas.toBlob(function(blob) {
        let url = URL.createObjectURL(blob)
        download_link.setAttribute("href", url)
        download_link.click()
    })
}

$("#canvas-map").click(function (e) { map_click(e); })
$("#canvas-map").mousedown(function (e) { map_mousedown(e); })
$("#canvas-map").mouseup(function (e) { map_mouseup(e); })
$("#button-clear-ap").click(function(e) { clear_ap(e); })
$("#button-add-ap").click(function(e) { add_ap(e); })
$("#button-modify-ap").click(function(e) { modify_ap(e); })
$("#button-del-ap").click(function(e) { del_ap(e); })
$("#button-apply-ap-param").click(function(e) { apply_ap(e); })
$("#button-add-wall").click(function(e) { add_wall(e); })
$("#button-add-square").click(function(e) {add_squared_wall(e); })
$("#button-del-wall").click(function(e) { del_wall(e); })
$("#button-clear-wall").click(function(e) { clear_wall(e); })
$("#button-add-human").click(function(e) { add_human_body(e); })
$("#select-freq-type").change(function(e) { change_freqhz(e); })
$("#button-select-scale").click(function(e) { select_scale(e); })
$("#button-measure-scale").click(function(e) { measure_scale(e); })
$("#button-image-upload").on('change', function(e) { change_image(e); })
$("#button-add-coverage").click(function (e) { add_coverage(e) })
$("#button-del-coverage").click(function (e) { del_coverage(e) })
$("#button-download").click(function (e) { download_clicked(e); })
$("#button-config-upload").on('change', function(e) { change_config(e); })
$("#button-image-download").click(function(e) { download_image(e); })

// add option of antenna
for (const [key, pattern] of Object.entries(AntennaPatterns)) {
    let opt = $('<option>').val(pattern.key).text(pattern.name)
    $("#ap-param-antenna-type").append(opt)
}

// color table
for (const idx in dBPower2colors) {
    let db2color = dBPower2colors[idx]
    let td = $('<td>').css("background", db2color[1]).css("color", "white").text("> " + db2color[0])
    $("#tr-powerdb-colorbar").append(td)
}
for (const idx in attdb2color) {
    let db2color = attdb2color[idx]
    let td = $('<td>').css("background", db2color[1]).css("color", "white").text(db2color[0] - 1)
    $("#tr-obstacles-attdb-colorbar").append(td)
}
