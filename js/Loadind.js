let $layer = $("#loadingLayer");
let $spin = $layer.find("i");
let $info = $layer.find("div");


let leftTable = $("#mid_col1").children(), rightTable = $("#mid_col2").children();


let stopped = false;
let deg = 0;
function rotate() {
    if(stopped)return;
    $({deg: 0}).animate({deg: 360}, {
        duration: 2000,
        step: function(now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            $spin.css({
                transform: 'rotate(' + now + 'deg)'
            });
        },
        done: function () {
            rotate();
        }
    });
}

// we use a pseudo object for the animation
// (starts from `0` to `angle`), you can name it as you want

export function show() {
    //先隐藏所有表格，加载完再显示
    leftTable.hide();
    rightTable.hide();

    stopped = false;
    $layer.show();
    rotate();
}
export function hide() {
    $layer.fadeOut();
    leftTable.fadeIn();
    rightTable.fadeIn();
    stopped = true;
}
export function setInfo(text) {
    $info.text(text);
}