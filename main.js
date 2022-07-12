var __canvas = document.getElementById("canvas-map");
__ctx = __canvas.getContext("2d");


var MapStatus = {
    NONE: 0,
    ADD_AP: 1,
}
var __map_status = 0;


var background_image = new Image();
background_image.src = "map.png";

var frequency = 5120 * 1000 * 1000;
var appos_list = [
    { x: 200, y: 250, powerdb: 20.0 },
    { x: 200, y: 500, powerdb: 20.0 },
    { x: 1000, y: 600, powerdb: 20.0 },
    { x: 575, y: 200, powerdb: 20.0 },
    { x: 1000, y: 175, powerdb: 20.0 },
];

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
    { start: { x: 23, y: 292 }, end: { x: 1216, y: 292 }, attenuation: 12, material: "wood" },
    { start: { x: 23, y: 412 }, end: { x: 180, y: 412 }, attenuation: 12, material: "wood" },
    { start: { x: 210, y: 412 }, end: { x: 494, y: 412 }, attenuation: 12, material: "wood" },

    { start: { x: 301, y: 35 }, end: { x: 301, y: 292 }, attenuation: 3, material: "wood" },
    { start: { x: 581, y: 35 }, end: { x: 581, y: 292 }, attenuation: 3, material: "wood" },
    { start: { x: 859, y: 35 }, end: { x: 859, y: 292 }, attenuation: 3, material: "wood" },

    { start: { x: 494, y: 412 }, end: { x: 494, y: 749}, attenuation: 3, material: "wood" },

    { start: { x: 750, y: 400 }, end: { x: 750, y: 749 }, attenuation: 3, material: "wood" },
    { start: { x: 750, y: 400 }, end: { x: 1215, y: 400 }, attenuation: 3, material: "wood" },
];

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

                powerdb_at_xy = appos_list[ap_idx].powerdb - obstaclesAttenuationdB - calc_free_space_loss_db(frequency, distM);
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
    [-15, "red"],
    [-25, "red"],
    [-35, "orange"],
    [-45, "yellow"],
    [-50, "lime"],
    [-55, "green"],
    [-60, "teal"],
    [-65, "navy"],
    [-70, "blue"],
    [-85, "blue"],
    [-90, "navy"],
    [-96, "blue"],
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
        ctx.strokeStyle = "purple"
        ctx.lineWidth = 10;
        ctx.stroke();
    }
}

function redraw_map() {
    var canvas = document.getElementById("canvas-map");

    __ctx.clearRect(0, 0, canvas.width, canvas.height)

    img_x_max = background_image.width
    img_y_max = background_image.height
    canvas_x_max = canvas.width
    canvas_y_max = canvas.height
    rate_x = canvas_x_max / img_x_max
    rate_y = canvas_y_max / img_y_max
    rate = 1.0
    if (rate_x > rate_y) {
        rate = rate_x
    } else {
        rate = rate_y
    }
    __ctx.drawImage(background_image,
        0, 0, background_image.width, background_image.height,
        0, 0, canvas_x_max * rate, canvas_y_max * rate);

    xLim = background_image.width
    yLim = background_image.height

    xbox_max = parseInt(xLim / 5);
    ybo_max = parseInt(yLim / 5)
    console.log(xbox_max, ybo_max);

    matrix = init_matrix(xbox_max, ybo_max);
    //console.log("inited", matrix)

    // fill ap
    for (key in appos_list) {
        update_matrix_with_ap(matrix, default_ap_powerdb, appos_list[key].x, appos_list[key].y, __px2meter, frequency)
    }
    update_matrix(matrix, appos_list, obstacles_list, __px2meter, frequency)

    draw_matrix(matrix)
    //console.log("drawn", matrix);
    draw_obstacles(obstacles_list);

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
    }
    console.log("add_ap: ", new_ap)
    appos_list.push(new_ap)

    __map_status = MapStatus.NONE;
    update_status("AP added")

    redraw_map()
}

function map_click(e) {
    var mapOffset = document.querySelector("canvas").getBoundingClientRect();//$("#canvas-map").getBoundingClientRect();
    mouseX = parseInt(e.clientX - mapOffset.left);
    mouseY = parseInt(e.clientY - mapOffset.top);
    console.log("clicked = ", mouseX, mouseY);

    switch (__map_status) {
        case MapStatus.NONE:
            /* do nothing */
            break;
        case MapStatus.ADD_AP:
            map_click_to_add_ap(mouseX, mouseY)
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

function download_clicked() {
    let config_obj = {
        ap: appos_list,
        obstacles: obstacles_list,
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

$("#canvas-map").click(function (e) { map_click(e); })
$("#button-clear-ap").click(function(e) { clear_ap(e); })
$("#button-add-ap").click(function(e) { add_ap(e); })
$("#button-download").click(function (e) { download_clicked(e); })