"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoxType = exports.DriveType = void 0;
// import * as svg from "svg.js";
var SVG = require("svg.js");
var DriveType;
(function (DriveType) {
    DriveType["HDD35"] = "3.5' HDD";
    DriveType["HDD25"] = "2.5' HDD";
    DriveType["SSD25"] = "2.5' HDD";
    DriveType["NVME"] = "NVMe";
})(DriveType = exports.DriveType || (exports.DriveType = {}));
var BoxType;
(function (BoxType) {
    BoxType["Rackmount"] = "Rackmount";
    BoxType["Tower"] = "Tower";
    BoxType["Others"] = "Other";
})(BoxType = exports.BoxType || (exports.BoxType = {}));
var SlotOrientation;
(function (SlotOrientation) {
    SlotOrientation["Vertical"] = "Vertical";
    SlotOrientation["Horizontal"] = "Horizontal";
})(SlotOrientation || (SlotOrientation = {}));
// 1U = 45 * 550
// 3.5Drive = 105 * 25, 2.5Drive = 70 * 15
function drawDriveLayout(svg, server_type, server_unit, drive_row, drive_col, drive_slot, slot_type, orientation, pic_move_x, pic_move_y) {
    var z_dimension = drive_slot / (drive_row * drive_col);
    var z_slot = drive_slot / z_dimension;
    var box_width = (server_type == BoxType.Rackmount) ? 550 : server_unit * 45;
    var box_height = (server_type == BoxType.Rackmount) ? server_unit * 45 : 350;
    var box_style = { fill: 'none', stroke: '#000', 'stroke-width': 5 };
    var drive_size_x = 0;
    var drive_size_y = 0;
    if (slot_type != DriveType.NVME) {
        var drive_size_x_1 = (slot_type == DriveType.HDD35) ? 105 : 70;
        var drive_size_y_1 = (slot_type == DriveType.HDD35) ? 24 : 15;
    }
    var drive_width = (orientation == SlotOrientation.Vertical) ? drive_size_y : drive_size_x;
    var drive_height = (orientation == SlotOrientation.Vertical) ? drive_size_x : drive_size_y;
    var drive_style = { fill: 'none', stroke: '#000', 'stroke-width': 2 };
    var drive_move_x = drive_width + 3;
    var drive_move_y = drive_height + 3;
    var drive_group_move_x = (server_type == BoxType.Rackmount) ? 80 : 20;
    var drive_group_move_y = (server_type == BoxType.Rackmount) ? 10 : 80;
    var drive_text_x, drive_text_y;
    if (slot_type == DriveType.HDD35) {
        if (orientation == SlotOrientation.Vertical) {
            var drive_text_x_1 = 35;
            var drive_text_y_1 = 6;
        }
        else {
            var drive_text_x_2 = 5;
            var drive_text_y_2 = 0;
        }
    }
    else {
        if (orientation == SlotOrientation.Vertical) {
            var drive_text_x_3 = 35;
            var drive_text_y_3 = 6;
        }
        else {
            var drive_text_x_4 = 5;
            var drive_text_y_4 = 0;
        }
    }
    var text_style = { family: 'Helvetica', size: 12, anchor: 'start', leading: '0em' };
    var text_rot = (orientation == SlotOrientation.Vertical) ? 90 : 0;
    var box_label = svg.line(0, 0, 40, 0);
    var power_buttom = svg.circle().fill('none').radius(5).move(15, 10);
    var decoration = svg.group();
    decoration.add(box_label);
    decoration.add(power_buttom);
    decoration.stroke({
        width: 3,
        color: '#000'
    }).move(10, 15);
    var server = svg.group();
    for (var z = 0; z < z_dimension; z++) {
        var z_group = svg.group();
        var box = svg.rect(box_width, box_height).attr(box_style).radius(5);
        var harddrive_group = svg.group();
        for (var r = 0; r < drive_row; r++) {
            var new_row_group = svg.group();
            for (var c = 0; c < drive_col; c++) {
                var drive = svg.rect(drive_width, drive_height).attr(drive_style).radius(5).move(0, 0);
                var text = svg.text(slot_type).font(text_style).rotate(text_rot).move(drive_text_x, drive_text_y).build(true);
                var drive_group = svg.group();
                drive_group.add(drive);
                drive_group.add(text.plain(z * z_slot + r * ((drive_slot / z_dimension) / drive_row) + c + 1));
                drive_group.move(c * drive_move_x, 0);
                new_row_group.add(drive_group);
                new_row_group.move(0, r * drive_move_y);
            }
            harddrive_group.add(new_row_group);
        }
        if (z == 0) {
            z_group.add(decoration);
            z_group.add(box);
        }
        else {
            box.attr({ stroke: '#555', "stroke-dasharray": [5, 5] });
            z_group.add(box);
        }
        harddrive_group.move(drive_group_move_x, drive_group_move_y);
        z_group.add(harddrive_group);
        z_group.move(z * (6 * server_unit), (z_dimension - 1 - z) * box_height);
        //z_group.transform({skewX:((z>0)?1:0)*-15, skewY:0})
        server.add(z_group);
    }
    server.move(pic_move_x, pic_move_y);
}
//let draw = SVG('box').size(1400, 1400);
function clear(theBox) {
    theBox.clear();
}
var draw = SVG('box').size(1400, 1400);
window.clear = clear;
window.drawDriveLayout = drawDriveLayout;
window.draw = draw;
//Rackmount 2U, 1 Row, 24 Columns, 24 slots 2.5", Drive Vertical, NON-Hot-Swap
// drawDriveLayout(draw, BoxType.Rackmount, 2, 1, 24, 24, DriveType.HDD25, SlotOrientation.Vertical, 50, 50);
//Rackmount 6U, 6 Rows, 4 Columns, 24 slots 3.5", Drive Horizontal, Hot-Swap
//drawDriveLayout(draw, BoxType.Rackmount, 4, 6, 4, 24, DriveType.HDD35, SlotOrientation.Horizontal, 50, 150);
//Rackmount 7U, 16 Rows, 1 Column 16 slots 2.5", Drive Horizontal, Hot-Swap
//drawDriveLayout(draw, BoxType.Rackmount, 7, 16, 1, 16, DriveType.HDD25, SlotOrientation.Horizontal, 650, 50);
//Rackmount 4U, 3 Row, 4 Columns, (front 12, back 12) 24 slots 3.5", Drive Horizontal, Hot-Swap
//drawDriveLayout(draw, BoxType.Rackmount, 2, 3, 4, 24, DriveType.HDD35, SlotOrientation.Horizontal, 650, 400);
//Rackmount 1U, 1 Row, 4 Columns, (z1 4, z2 4, z3 4, z4 4) 16 slots 3.5", Drive Horizontal, Hot-Swap
//drawDriveLayout(draw, BoxType.Rackmount, 1, 1, 4, 12, DriveType.HDD35, SlotOrientation.Horizontal, 50, 400);
//Rackmount 1U, 1 Row, 4 Columns, (z1 4, z2 4, z3 4, z4 4) 16 slots 3.5", Drive Horizontal, Hot-Swap
//drawDriveLayout(draw, BoxType.Tower, 4, 1, 5, 5, DriveType.HDD35, SlotOrientation.Vertical, 50, 650);
