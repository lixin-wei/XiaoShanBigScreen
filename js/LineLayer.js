
class Point {
    constructor(x, y) {
        this.x = x||0;
        this.y = y||0;
    }
}
class Line {
    constructor(p1, p2) {
        this.p1 = p1 || new Point();
        this.p2 = p2 || new Point();
    }
}
export class LineLayer {
    constructor() {
        this.canvas = document.getElementById("line_layer");
        this.ctx = this.canvas.getContext("2d");
        this.ox = 0;
        this.oy = 0;
        this.line_list = [];
    }
    hide() {
        this.canvas.style.opacity = "0";
    }
    show() {
        this.canvas.style.opacity = "1";
    }
    resizeCanvas(h, w) {
        this.canvas.height = h;
        this.canvas.width = w;
    }
    setOrigin(x, y) {
        this.ox = x;
        this.oy = y;
        this.draw();
    }
    addLine(p1, p2) {
        this.line_list.push(new Line(p1, p2));
        this.draw();
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let that = this;
        this.line_list.forEach((line) => {
            that.ctx.strokeStyle = "rgba(155,255,155,0.7)";
            that.ctx.lineWidth = 4;
            that.ctx.lineCap = "round";
            that.ctx.fillStyle = "red";

            that.ctx.beginPath();
            that.ctx.save();
            const arr_len = 10;
            let x1 = line.p1.x - that.ox, y1 = line.p1.y - that.oy;
            let x2 = line.p2.x - that.ox, y2 = line.p2.y - that.oy;
            let d = Math.sqrt((x1-x2)*(x1-x2)+(y1 - y2)*(y1 - y2));
            let h = y2 - y1;
            //求出旋转角度
            let angle = Math.asin(h/d);
            that.ctx.translate(x1, y1);
            //如果在二三象限，x反向
            if(x2 - x1 < 0)that.ctx.scale(-1,1);
            that.ctx.rotate(angle);
            that.ctx.moveTo(0, 0); that.ctx.lineTo(d - arr_len / Math.sqrt(2), 0);
            //箭头
            that.ctx.translate(d, 0);
            that.ctx.rotate(Math.PI*3/4);
            that.ctx.moveTo(0, 0); that.ctx.lineTo(arr_len, 0);
            that.ctx.rotate(Math.PI/2);
            that.ctx.moveTo(0, 0); that.ctx.lineTo(arr_len, 0);
            that.ctx.translate(arr_len, 0);
            that.ctx.rotate(-Math.PI*3/4);
            that.ctx.moveTo(0, 0); that.ctx.lineTo(arr_len*Math.sqrt(2), 0);
            that.ctx.restore();
            that.ctx.closePath();

            that.ctx.fill();
            that.ctx.stroke();
        });
    }
}