window.$ = window.jQuery = require("jquery");
import * as PopBox from "./component/PopBox";


let $plan_name_box = $("#plan_name");

function openList() {
    let box_top = $plan_name_box.offset().top + $plan_name_box.outerHeight();
    let box_left = $plan_name_box.offset().left + $plan_name_box.outerWidth()/2;

    let $content = $(`
        <ul class="file-list">
           <li>aaa</li><li>aaa</li><li>aaa</li>
        </ul>
    `);
    $content.find("li").mousemove(function () {
        $(this).addClass("active");
    }).mouseout(function () {
        $(this).removeClass("active");
    });
    PopBox.show(box_left, box_top, $content, {
        position: {x: "center", y: "bottom"},
        css: {width: "240px"},
        showClose: false
    });
}

$plan_name_box.mousemove(function () {
    $(this).addClass("active");
}).mouseout(function () {
    $(this).removeClass("active");
});
$plan_name_box.click(function (e) {
    openList();
    e.stopPropagation();
});
