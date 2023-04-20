
var Status = {
    NONE: 0,
    SELECTING_CENTER: 1,
    SELECTING_EDGE: 2,
    SELECTING_POINT: 3,
}
var __status = Status.NONE

var __base_image = new Image()

var __rotation_deg = 0

var __config = {
}

var __center_point = {
    x: null,
    y: null,
    db: null
}

var __edge_point = {
    x: null,
    y: null,
    db: null
}

var __selected_points = []

function redraw_canvas() {
    let canvas = document.getElementById("canvas-ant")
    let ctx = canvas.getContext("2d")

    let img_w = __base_image.width
    let img_h = __base_image.height
    let canvas_img_w = canvas_w = canvas.width
    let canvas_img_h = canvas_h = canvas.height

    let fit_rate_x = canvas_w / img_w
    let fit_rate_y = canvas_h / img_h
    let fit_rate = 1.0

    if (fit_rate_x > fit_rate_y) {
        fit_rate = fit_rate_y
    } else {
        fit_rate = fit_rate_x
    }

    canvas_img_w = img_w * fit_rate
    canvas_img_h = img_h * fit_rate

    ctx.save();
    ctx.translate(__base_image.width / 2, __base_image.height / 2);
    ctx.rotate(__rotation_deg * (Math.PI / 180))
    ctx.drawImage(__base_image, -(__base_image.width / 2), -(__base_image.height/2))
    //ctx.drawImage(__base_image,
    //    0, 0, __base_image.width, __base_image.height,
    //    0, 0, canvas_img_w, canvas_img_h)
    ctx.restore()

    if (__config.center != null && __config.center.xy != null) {
        draw_circle(__config.center.xy, 5, "black")
    }
    if (__config.edge != null && __config.edge.xy != null) {
        draw_circle(__config.edge.xy, 5, "red")
    }
    draw_selected_points(__selected_points)
}

function draw_center_edge_points(center, edge){
    draw_circle(center, 5, "black")
    draw_circle(edge, 5, "black")
}

function draw_selected_points(points) {
    for (let idx in points) {
        console.log(idx)
        let point = points[idx]
        __center_point.x = point.x
        __center_point.y = point.y
        draw_circle(point, 5, "blue")
    }
}

function draw_circle(center, r, color) {
    if (center == null) {
        return
    }
    if (center.x == null || center.y == null || r == null) {
        return
    }
    let canvas = document.getElementById("canvas-ant")
    let ctx = canvas.getContext("2d")

    ctx.beginPath()
    ctx.arc(center.x, center.y, r, 0 * Math.PI / 180, 360 * Math.PI / 180, false)
    ctx.fillStyle = color
    ctx.fill();
    ctx.stroke()
}

function calc_distance_px(p0, p1) {
    return Math.sqrt(
        Math.pow( Math.abs(p0.x - p1.x), 2) +
        Math.pow( Math.abs(p0.y - p1.y), 2)
    )
}

function get_mouse_coordinate(e) {
    var mapOffset = document.querySelector("canvas").getBoundingClientRect()//$("#canvas-map").getBoundingClientRect()
    mouseX = parseInt(e.clientX - mapOffset.left)
    mouseY = parseInt(e.clientY - mapOffset.top)

    return {x: mouseX, y: mouseY}
}

function on_selecting_center_at(xy) {
    console.log("xy", xy)
    let db = parseInt($("#text-center-db").val())

    __config.center = {
        db: db,
        xy: xy,
    }

    console.log("center: ", __config.center)

    redraw_canvas()
    __status = Status.NONE
}

function on_selecting_edge_at(xy) {
    console.log("xy", xy)
    let db = parseInt($("#text-edge-db").val())

    xy.x = __config.center.xy.x

    __config.edge = {
        db: db,
        xy: xy,
    }

    console.log("edge: ", __config.edge)

    redraw_canvas()
    __status = Status.NONE
}

function calculate_db_at_xy(xy) {
    let center = __config.center
    let edge = __config.edge
    if (center == null || edge == null) {
        console.log(center, edge)
        return
    }

    let db_scale = Math.abs(center.db - edge.db)
    let len_scale = Math.abs(center.xy.y - edge.xy.y)
    let db_per_px = db_scale / len_scale
    let len_xy_from_center = calc_distance_px(center.xy, xy)

    let db = len_xy_from_center * db_per_px + center.db

    console.log("xy to db", db)

}

function on_selecting_point_at(xy) {
    console.log("point selected: ", xy)
    let new_point = {
        x: xy.x,
        y: xy.y
    }

    __selected_points.push(new_point)
}

function canvas_click(e) {
    let xy = get_mouse_coordinate(e)

    switch (__status) {
        case Status.NONE:
            calculate_db_at_xy(xy)
            break
        case Status.SELECTING_CENTER:
            on_selecting_center_at(xy)
            break
        case Status.SELECTING_EDGE:
            on_selecting_edge_at(xy)
            break
        case Status.SELECTING_POINT:
            on_selecting_point_at(xy)
            break
        default:
            break
    }

    console.log(__selected_points)
    redraw_canvas()
}

function change_image(e) {
    let file = e.target.files[0]

    console.log("change_image file=", file)
    let file_name = file.name

    if (!file.type.match('image/.*')) {
        return
    }

    let reader = new FileReader()
    reader.onload = function() {
        let imgsrc = reader.result
        __base_image.src = imgsrc
        __base_image.onload = function () {
            redraw_canvas()
        }
    }
    reader.readAsDataURL(file)

}

function rotate_image(e) {
    __rotation_deg = (__rotation_deg + 90) % 360

    redraw_canvas()
}

function selecting_center (e) {
    __status = Status.SELECTING_CENTER
}

function selecting_edge (e) {
    __status = Status.SELECTING_EDGE
}

function start_selecting_point(e) {
    __status = Status.SELECTING_POINT
}

function end_selecting_point(e) {
    __status = Status.NONE
}

$("#canvas-ant").click(function(e) { canvas_click(e) })
$("#button-load-img").on("change", function(e) { change_image(e) })
$("#button-rotate").click(function(e) { rotate_image(e)})
$("#button-select-center").click(function(e) { selecting_center(e) })
$("#button-select-edge").click(function(e) { selecting_edge(e) })
$("#button-start-point").click(function(e) { start_selecting_point(e) })
$("#button-end-point").click(function(e) { end_selecting_point(e) })