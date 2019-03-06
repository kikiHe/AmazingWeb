$(function () {
    'use strict';
    var canvas = document.getElementById("cube");
    if (canvas === null || canvas === undefined) {
        return;
    }
    var ctx = canvas.getContext("2d"),
        vpx = canvas.width / 2,
        vpy = canvas.height / 2,
        fl = 500, // focus distance
        Length = 80, // edge length
        angleX = Math.PI / 20,
        angleY = Math.PI / 20,
        cube,
        animation, // starter
        raf = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame;
    if ("addEventListener" in window) {
        window.addEventListener("mousemove", mouse_event);
    }
    else if ("attachEvent" in window) {
        window.attachEvent('onmousemove', mouse_event);
    }

    function mouse_event(event) {
        var boundx = canvas.getBoundingClientRect().left,
            boundy = canvas.getBoundingClientRect().top;
        var x = event.clientX - boundx - vpx;
        var y = event.clientY - boundy - vpy;
        angleY = x * 0.0001;
        angleX = y * 0.0001;
    }

    Array.prototype.foreach = function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback.apply(this[i], [i])
        }
    };
    var Point = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this._get2d = function () {
            var scale = fl / (fl + this.z); // closer, look farther to the origin
            var x = vpx + this.x * scale;
            var y = vpy + this.y * scale;
            return {x: x, y: y};
        }
    };
    var Plane = function (p1, p2, p3, p4, color) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.color = color;
        this.z_total = this.p1.z + this.p2.z + this.p3.z + this.p4.z;
        this.draw = function () {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.p1._get2d().x, this.p1._get2d().y);
            ctx.lineTo(this.p2._get2d().x, this.p2._get2d().y);
            ctx.lineTo(this.p3._get2d().x, this.p3._get2d().y);
            ctx.lineTo(this.p4._get2d().x, this.p4._get2d().y);
            ctx.closePath();
            ctx.fillStyle = this.color;
            // ctx.strokeStyle = this.color;
            // ctx.stroke();
            ctx.fill();
        }
    };
    var Cube = function (length) {
        this.length = length;
        this.planes = [];
    };
    Cube.prototype = {
        init: function () {
            this.points = [];
            this.points.push(new Point(-this.length / 2, -this.length / 2, this.length / 2)); // 001
            this.points.push(new Point(-this.length / 2, this.length / 2, this.length / 2)); // 011
            this.points.push(new Point(this.length / 2, -this.length / 2, this.length / 2)); // 101
            this.points.push(new Point(this.length / 2, this.length / 2, this.length / 2)); // 111
            this.points.push(new Point(this.length / 2, -this.length / 2, -this.length / 2)); // 100
            this.points.push(new Point(this.length / 2, this.length / 2, -this.length / 2)); // 110
            this.points.push(new Point(-this.length / 2, -this.length / 2, -this.length / 2)); // 000
            this.points.push(new Point(-this.length / 2, this.length / 2, -this.length / 2)); // 010
        },
        draw: function () {
            this.planes[0] = new Plane(this.points[0], this.points[1], this.points[3], this.points[2], "rgba(255,255,255,0.15)");
            this.planes[1] = new Plane(this.points[2], this.points[3], this.points[5], this.points[4], "rgba(255,255,255,0.3)");
            this.planes[2] = new Plane(this.points[4], this.points[5], this.points[7], this.points[6], "rgba(255,255,255,0.45)");
            this.planes[3] = new Plane(this.points[6], this.points[7], this.points[1], this.points[0], "rgba(255,255,255,0.6)");
            this.planes[4] = new Plane(this.points[1], this.points[3], this.points[5], this.points[7], "rgba(255,255,255,0.75)");
            this.planes[5] = new Plane(this.points[0], this.points[2], this.points[4], this.points[6], "rgba(255,255,255,0.9)");
            this.planes.sort(function (a, b) {
                return b.z_total - a.z_total; // closer ahead
            });
            this.planes.foreach(function () {
                this.draw(); // draw the plane
            })
        }
    };

    function rotateX(points) { // anticlockwise around the x-axis
        var cos = Math.cos(angleX);
        var sin = Math.sin(angleX);
        points.foreach(function () {
            var y1 = this.y * cos - this.z * sin; // y'=ycosA-zsinA
            var z1 = this.z * cos + this.y * sin; // z'=zcosA+ysinA
            this.y = y1;
            this.z = z1;
        });
    }

    function rotateY(points) { // anticlockwise around the y-axis
        var cos = Math.cos(angleY);
        var sin = Math.sin(angleY);
        points.foreach(function () {
            var x1 = this.x * cos - this.z * sin; // x'=xcosB-zsinB
            var z1 = this.z * cos + this.x * sin; // z'=zcosB+xsinB
            this.x = x1;
            this.z = z1;
        })
    }

    function rotateZ(points) { // future use
        var cos = Math.cos(angleZ);
        var sin = Math.sin(angleZ);
        points.foreach(function () {
            var x1 = this.x * cos - this.y * sin; // x'=xcosB-zsinB
            var y1 = this.y * cos + this.x * sin; // z'=zcosB+xsinB
            this.x = x1;
            this.y = y1;
        })
    }

    var Animation = function () {
        this.init();
    };
    Animation.prototype = {
        isrunning: false,
        init: function () {
            cube = new Cube(Length);
            cube.init();
        },
        start: function () {
            this.isrunning = true;
            animate();
        },
        stop: function () {
            this.isrunning = false;
        }
    };

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rotateX(cube.points); // rotate
        rotateY(cube.points);
        cube.draw(); // draw the cube
        if (animation.isrunning) {
            raf(animate); // recursively call
        }
    }

    animation = new Animation();
    animation.start();
});