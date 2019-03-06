$(function () {
    'use strict';
    var canvas = document.getElementById("ball"),
        info = document.getElementById("ball_info");
    if (canvas === null || canvas === undefined) {
        return;
    }
    var ctx = canvas.getContext("2d"),
        vpx = canvas.width / 2,
        vpy = canvas.height / 2,
        fl = 200, // focus distance
        Radius = 80,
        Num = 200, // points num
        angleX = Math.PI / 100,
        angleY = Math.PI / 100,
        angleZ = Math.PI / 100,
        ball,
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
        angleY = -x * 0.0001; // mouse left -> x neg -> angleY pos -> anticlockwise in the x, z plane
        angleX = -y * 0.0001; // mouse up -> y neg -> angleX pos -> anticlockwise in the y, z- plane
        info.innerHTML = "clientX: " + event.clientX + " " +
            "clientY: " + event.clientY + "<br>" +
            "offsetLeft: " + canvas.offsetLeft + " " +
            "offsetTop: " + canvas.offsetTop + "<br>" +
            "vpx: " + vpx + " " +
            "vpy: " + vpy + "<br>" +
            "borderLeft: " + boundx + " " +
            "borderTop: " + boundy;
    }

    Array.prototype.foreach = function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback.apply(this[i], [i])
        }
    };
    var Point = function (x, y, z, r) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
    };
    Point.prototype = {
        draw: function () {
            ctx.save();
            ctx.beginPath();
            var scale = fl / (fl - this.z); // closer, bigger
            var alpha = (this.z + Radius) / (2 * Radius); // closer, brighter
            ctx.arc(vpx + this.x, vpy + this.y, this.r * scale, 0, 2 * Math.PI, true); // point, radius, full circle, clockwise
            ctx.fillStyle = "rgba(255,255,255," + (alpha + 0.5) + ")"; // white point
            ctx.fill(); // solid circle
            ctx.restore();
        }
    };
    var Ball = function (nums) {
        this.nums = nums;
        this.points = [];
    };
    Ball.prototype = {
        init: function () {
            for (var i = 1; i <= this.nums; i++) {
                // method1 generate Theta and Phi
                var a = Math.acos((2 * i - 1) / this.nums - 1);
                var b = a * Math.sqrt(this.nums * Math.PI);
                var x = Radius * Math.sin(a) * Math.cos(b);
                var y = Radius * Math.sin(a) * Math.sin(b);
                var z = Radius * Math.cos(a);
                // method2 generate by the Golden Ratio
                //var f = (Math.sqrt(5) - 1) / 2; // Math.sqrt(2) - 1
                //var x = Radius * Math.sin(a) * Math.cos(2 * Math.PI * (i) * f);
                //var y = Radius * Math.sin(a) * Math.sin(2 * Math.PI * (i) * f);

                var p = new Point(x, y, z, 1.5);
                this.points.push(p);
                p.draw();
            }
        },
        draw: function () {
            this.points.sort(function (a, b) {
                return b.z - a.z; // closer ahead
            });
            this.points.foreach(function () {
                this.draw(); // draw the point
            });
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
            ball = new Ball(Num);
            ball.init();
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
        rotateX(ball.points); // rotate
        rotateY(ball.points);
        ball.draw();
        if (animation.isrunning) {
            raf(animate); // recursively call
        }
    }

    animation = new Animation();
    animation.start();
});