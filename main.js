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
}
var __map_status = 0;
var __ap_delete_range = 20 //px
var __default_status = "Press Button to operate"
var __shoulder_width_m = 0.43 //[m]

var __working_wall_coordinates = null;

var __selecting_scale = null;


var background_image = new Image();
var __map_file_name = background_image.src = "map.png";

var __frequency = 5180 * 1000 * 1000;
var AntennaPatterns = {
    STEEP0: {
        base: "",
        name: "0 dBi Directional",
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
        name: "9dBi Directional Half-angle 65+5", 
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
        name: "6dBi Directional Half-angle 70",
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

function update_matrix(matrix, appos_list, obstacles, px2meter, frequency) {
    for (y = 0; y < matrix.length; y++) {
        for (x = 0; x < matrix[y].length; x++) {
            cur_pos = calc_real_point(x, y)

            for (ap_idx in appos_list) {
                ap_pos = [appos_list[ap_idx].x, appos_list[ap_idx].y]
                /* detect crossing obstacles */
                obstaclesAttenuationdB = calc_obstacles_attenuation_db(
                    ary2coordinate(cur_pos),
                    ary2coordinate(ap_pos),
                    obstacles
                )

                distM = calc_distance_m(cur_pos[0], cur_pos[1], ap_pos[0], ap_pos[1], px2meter)

                powerdb_at_xy = 0
                if (appos_list[ap_idx].direction == null) {
                    powerdb_at_xy = appos_list[ap_idx].powerdb - obstaclesAttenuationdB - calc_free_space_loss_db(__frequency, distM);
                } else {
                    powerdb_at_xy = calc_directional_power_db_of_ap_to_xy(appos_list[ap_idx], cur_pos[0], cur_pos[1]) - obstaclesAttenuationdB - calc_free_space_loss_db(__frequency, distM);
                }
                if (matrix[y][x] == null || matrix[y][x] < powerdb_at_xy) {
                    //console.log(apPosList[idx].powerdb, powerdb_at_xy)
                    matrix[y][x] = powerdb_at_xy
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
}

background_image.onload = function () {
    redraw_map()
}

function update_status(text) {
    $("#map-status").text(text)
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
        case MapStatus.DEL_AP:
            map_click_to_del_ap(mouseX, mouseY)
            break;
        case MapStatus.ADD_HUMAN:
            map_click_to_add_human(mouseX, mouseY)
            break
        case MapStatus.DEL_WALL:
            map_click_to_del_wall(mouseX, mouseY)
        default:
            break;
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
        case MapStatus.SELECT_SCALE:
            __selecting_scale = new_scale()
            __selecting_scale.start.x = xy.x
            __selecting_scale.start.y = xy.y
            __map_status = MapStatus.SELECTING_SCALE
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

function del_ap(e) {
    update_status("click on map to delete AP")
    __map_status = MapStatus.DEL_AP
}

function add_wall(e) {
    update_status("drag to draw wall")
    __map_status = MapStatus.ADD_WALL
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

$("#canvas-map").click(function (e) { map_click(e); })
$("#canvas-map").mousedown(function (e) { map_mousedown(e); })
$("#canvas-map").mouseup(function (e) { map_mouseup(e); })
$("#button-clear-ap").click(function(e) { clear_ap(e); })
$("#button-add-ap").click(function(e) { add_ap(e); })
$("#button-del-ap").click(function(e) { del_ap(e); })
$("#button-add-wall").click(function(e) { add_wall(e); })
$("#button-del-wall").click(function(e) { del_wall(e); })
$("#button-clear-wall").click(function(e) { clear_wall(e); })
$("#button-add-human").click(function(e) { add_human_body(e); })
$("#select-freq-type").change(function(e) { change_freqhz(e); })
$("#button-select-scale").click(function(e) { select_scale(e); })
$("#button-image-upload").on('change', function(e) { change_image(e); })
$("#button-download").click(function (e) { download_clicked(e); })
$("#button-config-upload").on('change', function(e) { change_config(e); })

// add option of antenna
for (const [key, pattern] of Object.entries(AntennaPatterns)) {
    let opt = $('<option>').val(key).text(pattern.name)
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