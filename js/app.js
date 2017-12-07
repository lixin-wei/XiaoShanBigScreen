window.$ = window.jQuery = require("jquery");
let moment = require("moment");
import * as G from "./include/Global";
import * as PKStage from "./PKStageField";

import {} from "./PlanManageField";
import {} from "./AddPersonField";




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
