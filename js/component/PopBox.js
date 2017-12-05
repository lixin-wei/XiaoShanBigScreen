let $active_pop_box = null;
let absolute_left = null, absolute_top = null;
const ANIMATION_DUR = 200;

export function isOpen() {
    return $active_pop_box !== null;
}
export function remove() {
    if($active_pop_box) {
        let $temp = $active_pop_box;
        //马上设成null，防止点太快出BUG
        $active_pop_box = null;
        $temp.slideUp(ANIMATION_DUR, function () {
            $temp.remove();
        });
    }
}

export function show(x, y, $content, option = {
    position: {x: "right", y: "top"},
    css: {},
    showClose: true,
}) {
    remove();
    let $popBox = $($.parseHTML(`
            <div class="pop-box">
                <div class="content beauty-scroll"></div>
            </div>
        `));
    //阻止事件冒泡，防止点气泡框就把它关了
    $popBox.click(function (e) {
        e.stopPropagation();
    });
    //关闭按钮的相关事件
    let showClose = option.showClose === undefined ? true : option.showClose;
    if(showClose) {
        let $close_btn = $("<i class=\"fa fa-close\"></i>");
        $close_btn.click(function () {
            remove();
        });
        $popBox.append($close_btn);
    }
    else {
        $popBox.addClass("no-close");
    }
    $popBox.find(".content").append($content);
    if(option.css) {
        $popBox.find(".content").css(option.css);
    }
    //先隐藏放到dom里，计算出大小
    $popBox.hide();
    $popBox.appendTo($("body"));
    $popBox = $(".pop-box:last-child");
    //根据参数确定显示位置
    let box_left = x, box_top = y;
    if (option.position.x === "right") {
        box_left = x + 20;
    }
    else if (option.position.x === "left") {
        box_left = x - $popBox.outerWidth() - 20;
    }
    else if (option.position.x === "center") {
        box_left = x - $popBox.outerWidth()/2;
    }

    if (option.position.y === "top") {
        box_top = y - $popBox.outerHeight() - 20;
    }
    else if (option.position.y === "bottom") {
        box_top = y + 20;
    }
    else if (option.position.y === "middle") {
        box_top = y - $popBox.outerHeight()/2;
    }
    //记录一下绝对位置，供滚动时调整位置用
    absolute_left = box_left;
    absolute_top = box_top;
    //然后显示
    $popBox.css({
        position: "fixed",
        top: box_top - $(window).scrollTop(),
        left: box_left - $(window).scrollLeft()
    }).slideDown(ANIMATION_DUR);

    $active_pop_box = $popBox;
}

// $(window).on("scroll click", function () {
//     remove();
// });
$(window).click(remove);
$(window).scroll(function () {
    if($active_pop_box) {
        $active_pop_box.css({
            top: absolute_top - $(window).scrollTop(),
            left: absolute_left - $(window).scrollLeft()
        });
    }
});
