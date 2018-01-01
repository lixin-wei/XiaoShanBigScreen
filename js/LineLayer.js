class Point {
    constructor(x, y) {
        this.x = x||0;
        this.y = y||0;
    }
}
class Line {
    constructor(ID, p1, p2) {
        this.ID = ID;
        this.p1 = p1 || new Point();
        this.p2 = p2 || new Point();
    }
}

let canvas = document.getElementById("line_layer");
let ctx = canvas.getContext("2d");
let ox = 0;
let oy = 0;
let dashOffset = 0;
let line_list = [];
let tot = 0;
let stop = false;
draw();
export function hide() {
    canvas.style.opacity = "0";
    stop = true;
}
export function show() {
    stop = false;
    draw();
    canvas.style.opacity = "1";
}
export function resizeCanvas(h, w) {
    canvas.height = h;
    canvas.width = w;
}
export function setOrigin(x, y) {
    ox = x;
    oy = y;
}
export function addLine(p1, p2) {
    line_list.push(new Line(tot, p1, p2));
    return tot++;
}
export function removeLine(ID) {
    line_list = line_list.filter((line) => {return line.ID !== ID})
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dashOffset--;
    if(dashOffset <= 0) dashOffset = 15;
    line_list.forEach((line) => {
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineCap = "round";
        ctx.fillStyle = "red";

        ctx.save();
        {
            const arr_len = 10;
            let x1 = line.p1.x - ox, y1 = line.p1.y - oy;
            let x2 = line.p2.x - ox, y2 = line.p2.y - oy;
            let d = Math.sqrt((x1-x2)*(x1-x2)+(y1 - y2)*(y1 - y2));
            let h = y2 - y1;
            //求出旋转角度
            let angle = Math.asin(h/d);
            ctx.translate(x1, y1);
            //如果在二三象限，x反向
            if(x2 - x1 < 0)ctx.scale(-1,1);
            ctx.beginPath();
            {
                ctx.lineWidth = 3;
                ctx.setLineDash([5, 10]);
                ctx.lineDashOffset = dashOffset;
                ctx.rotate(angle);
                ctx.moveTo(0, 0);
                if(x2 - x1 < 0)
                    ctx.quadraticCurveTo(d/2 ,-d/5 ,d, 0);
                else
                    ctx.quadraticCurveTo(d/2 ,d/5 ,d, 0);
            }
            ctx.stroke();
            ctx.closePath();

            // ctx.beginPath();
            // {
            //     //箭头
            //     ctx.lineWidth = 1;
            //     ctx.setLineDash([]);
            //     ctx.translate(d, 0);
            //     ctx.rotate(Math.PI*3/4);
            //     ctx.moveTo(0, 0); ctx.lineTo(arr_len, 0);
            //     ctx.rotate(Math.PI/2);
            //     ctx.moveTo(0, 0); ctx.lineTo(arr_len, 0);
            //     ctx.translate(arr_len, 0);
            //     ctx.rotate(-Math.PI*3/4);
            //     ctx.moveTo(0, 0); ctx.lineTo(arr_len*Math.sqrt(2), 0);
            //     ctx.stroke();
            // }
            // ctx.closePath();
            // ctx.stroke();
        }
        ctx.restore();
    });
    if(!stop) requestAnimationFrame(() => {draw()});
}


//保持全屏，持续重置原点
function resizeLineLayer() {
    resizeCanvas(window.innerHeight, window.innerWidth);
}
function resetOrigin() {
    setOrigin($(window).scrollLeft(), $(window).scrollTop());
}
$(window).on("resize scroll", function () {
    resizeLineLayer();
    resetOrigin();
});
resizeLineLayer();
resetOrigin();
$("#cb_line_layer").change(function () {
    if(this.checked) {
        show();
    }
    else {
        hide();
    }
});
