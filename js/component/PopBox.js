let $active_pop_box = null;
export function remove() {
    if($active_pop_box) {
        let $temp = $active_pop_box;
        //马上设成null，防止点太快出BUG
        $active_pop_box = null;
        $temp.fadeOut(500, function () {
            $temp.remove();
        });
    }
}
export function show(x, y, $content, position,  css = {}) {
    this.remove();
    let $popBox = $($.parseHTML(`
            <div class="pop-box beauty-scroll"></div>
        `)).css(css);
    $popBox.append($content);
    //先隐藏放到dom里，计算出大小
    $popBox.hide();
    $popBox.appendTo($("body"));
    $popBox = $(".pop-box:last-child");
    let left = x;
    if(position === "right") {
        left = x + 20;
    }
    else if(position === "left") {
        left = x - $popBox.outerWidth() - 20;
    }
    else if (position === "middle") {
        left = x - $popBox.outerWidth()/2;
    }
    //然后显示
    $popBox.css({
        position: "fixed",
        top: y - $popBox.outerHeight() - 20,
        left: left
    }).fadeIn();

    $active_pop_box = $popBox;
}

$(window).on("scroll click", function () {
    remove();
});