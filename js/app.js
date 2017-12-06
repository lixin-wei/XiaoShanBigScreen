window.$ = window.jQuery = require("jquery");
let moment = require("moment");
import * as G from "./include/Global";
import * as PKStage from "./PKStageField";

import {} from "./PlanManageField";
import {} from "./AddPersonField";


//PK台的相关事件
$("#foot_col4").find(".photo-col .photo")
    .mousemove(function () {
        G.setActiveStage($(this));
    })
    .mouseout(function () {
        G.setActiveStage(null);
    })
    //PK台box拽出
    .mousedown(function () {
        if($(this).data("person")) {
            G.setFloatingPerson($(this).data("person"));
            G.getFloatingPerson().$box.show();
            $(this).data("person", null);

            if($(this).parent().attr("id") === "photo_col_left")
                PKStage.clearLeft();
            else
                PKStage.clearRight();
        }
    });
let $stage_btn_left = $("#photo_col_left").find(".btn");
let $stage_btn_right = $("#photo_col_right").find(".btn");
//PK台的各种按钮
$($stage_btn_left[0]).on("mousedown click", function (e) {
    e.stopPropagation();
});
$($stage_btn_left[1]).on("mousedown click", function (e) {
    e.stopPropagation();
});
//离开PK台，左
$($stage_btn_left[2]).on("mousedown click", function (e) {
    let $photo = $("#photo_col_left").find(".photo");
    let person = $photo.data("person");
    if(person) {
        goToList(person.$box);
        PKStage.clearLeft();
        $photo.data("person", null);
    }
    e.stopPropagation();
});
$($stage_btn_right[0]).on("mousedown click", function (e) {
    e.stopPropagation();
});
$($stage_btn_right[1]).on("mousedown click", function (e) {
    e.stopPropagation();
});
//离开PK台，右
$($stage_btn_right[2]).on("mousedown click", function (e) {
    let $photo = $("#photo_col_right").find(".photo");
    let person = $photo.data("person");
    if(person) {
        goToList(person.$box);
        PKStage.clearRight();
        $photo.data("person", null);
    }
    e.stopPropagation();
});

/** 气泡框相关 **/
import {} from "./PersonDetailField";

/** 数据填充 **/
import {} from "./DataFiller";
/** 初始化 **/
$(document).ready(function () {
    //隐藏所有标签
    G.$de_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    G.$cai_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    G.$lack_label.css({"transform" : "scale(0)"}).data("vis", false);
    G.$achievement_label.css({"transform" : "scale(0)"}).data("vis", false);
    //PK条清空
    $("#total_bar_left").find(".total-bar-thumb").css({width: `0%`});
    $("#total_bar_right").find(".total-bar-thumb").css({width: `0%`});
});
