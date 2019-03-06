$(function () {
    'use strict';
    var canvas = document.getElementById("logobrand");
    if (typeof canvas === undefined){
        return;
    }
    var ctx = canvas.getContext("2d"),
        logo = new Image(),
        interval_id,
        tar_scale = 0.8,
        cur_scale = 1,
        img_width,
        img_height,
        vertical_cut_angle = 0,
        horizontal_cut_angle = 0,
        Speed = Math.PI / 25,
        State = 0,
        animation, // starter
        raf = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame;
    function single_run(run, time) {
        if (typeof interval_id !== 'undefined') {
            clearInterval(interval_id);
        }
        interval_id = setInterval(run, time);
    }

    function draw_horizontal_rotate(angle, direction) {
        ctx.fillStyle = '#404044';
        ctx.clearRect(0, 0, img_width, img_height);
        ctx.save();
        ctx.translate(img_width / 2, img_height / 2);
        var sx = -img_width / 2 * (tar_scale - (1 - tar_scale) * Math.sin(angle) * direction),
            ex = -img_width / 2 * (tar_scale + (1 - tar_scale) * Math.sin(angle) * direction),
            sy = -img_height / 2 * (tar_scale * Math.cos(angle)),
            ey = -sy;
        var xi, yi;
        var row = 0;
        while (row < img_height) {
            xi = sx - (sx - ex) * row / img_height;
            yi = sy - (sy - ey) * row / img_height;
            ctx.drawImage(logo, 0, row, img_width, 1, xi, yi, 2 * Math.abs(xi), 1);
            row++;
        }
        ctx.restore();
    }

    function draw_vertical_rotate(angle, direction) {
        ctx.fillStyle = '#404044';
        ctx.clearRect(0, 0, img_width, img_height);
        ctx.save();
        ctx.translate(img_width / 2, img_height / 2);
        var sx = -img_width / 2 * (tar_scale * Math.cos(angle)),
            ex = -sx,
            sy = -img_height / 2 * (tar_scale - (1 - tar_scale) * Math.sin(angle) * direction),
            ey = -img_height / 2 * (tar_scale - (1 - tar_scale) * Math.sin(angle) * direction);
        var xi, yi;
        var col = 0;
        while (col < img_width) {
            xi = sx - (sx - ex) * col / img_width;
            yi = sy - (sy - ey) * col / img_width;
            ctx.drawImage(logo, col, 0, 1, img_height, xi, yi, 1, 2 * Math.abs(yi));
            col++;
        }
        ctx.restore();
    }

    function draw_image() {
        var width = Math.floor(img_width * cur_scale),
            height = Math.floor(img_height * cur_scale);
        ctx.save();
        ctx.translate(img_width / 2, img_height / 2);
        ctx.drawImage(logo, -width / 2, -height / 2, width, height);
        ctx.restore();
    }

    var Animation = function () {
        this.init();
    };
    Animation.prototype = {
        isrunning: false,
        init: function () {
            logo.src = '/images/logo.png';
            logo.onload = function () {
                img_width = logo.width;
                img_height = logo.height;
            };
            canvas.onmouseover = function () {
                animation.isrunning = true;
                animate_in();
            };
            canvas.onmouseout = function () {
                animation.isrunning = false;
                horizontal_cut_angle = vertical_cut_angle = State = 0;
                animate_out();
            };
        },
        start: function () {
            animate_out();
        }
    };

    function animate_in() {
        ctx.clearRect(0, 0, img_width, img_height);
        if (cur_scale > tar_scale) {
            cur_scale -= 0.02;
            draw_image();
        } else {
            switch (State) {
                case 0:
                    if (horizontal_cut_angle < 2 * Math.PI) {
                        horizontal_cut_angle += Speed;
                    } else {
                        horizontal_cut_angle = 0;
                        State = 1;
                    }
                    draw_horizontal_rotate(horizontal_cut_angle, 1);
                    break;
                case 1:
                    if (horizontal_cut_angle < 2 * Math.PI) {
                        horizontal_cut_angle += Speed;
                    } else {
                        horizontal_cut_angle = 0;
                        State = 2;
                    }
                    draw_horizontal_rotate(horizontal_cut_angle, -1);
                    break;
                case 2:
                    if (vertical_cut_angle < 2 * Math.PI) {
                        vertical_cut_angle += Speed;
                    } else {
                        vertical_cut_angle = 0;
                        State = 3;
                    }
                    draw_vertical_rotate(vertical_cut_angle, 1);
                    break;
                case 3:
                    if (vertical_cut_angle < 2 * Math.PI) {
                        vertical_cut_angle += Speed;
                    } else {
                        vertical_cut_angle = 0;
                        State = 0;
                    }
                    draw_vertical_rotate(vertical_cut_angle, -1);
                    break;
            }
        }
        if (animation.isrunning) {
            raf(animate_in); // recursively call
        }
    }

    function animate_out() {
        ctx.clearRect(0, 0, img_width, img_height);
        if (cur_scale < 1) {
            cur_scale += 0.02;
        }
        draw_image();
        if (!animation.isrunning) {
            raf(animate_out); // recursively call
        }
    }

    animation = new Animation();
    animation.start();
});