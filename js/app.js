window.$ = window.jQuery = require("jquery");
import * as G from "./include/Global";
import {getRandomInt, clipName, getNodeCenter} from "./HelperFuncitions";
import {Person} from "./class/Person";
import {Group} from "./class/Group";
import {NormalTableController} from "./NormalTableController";
import {UnfixedTableController} from "./UnfixedTableController";
import * as Charts from "./ChartField";
import * as GroupBox from "./GroupBoxField";
import * as PopBox from "./component/PopBox";
import * as PKStage from "./PKStageField";

import {} from "./PlanManageField";

/** 变动线层 **/
import * as LineLayer from "./LineLayer";

/** info-box拖动 **/
let click_x = 0, click_y = 0;
let isMouseDown = false;
const BOX_HEIGHT = 150;
const TRASH_X = G.$box_list.offset().left;
const TRASH_Y = G.$box_list.offset().top;

//box list的动画控制函数
function focusOn($ele) {
    $(".cell, .info-box").removeClass("active");
    if($ele) {
        $ele.addClass("active");
    }
}
function setPersonInfo(person) {
    console.log(`person_id = ${person.id}`);
    G.showing_person_id = person.id;
    G.$person_info_container.find(".photo img").attr("src", G.PERSON_PHOTO_ROOT + person.photo);
    G.$person_info_container.find(".name").text(person.name);
    G.$person_info_container.find(".info1").text(person.getInfo());
    G.$person_info_container.find(".info2").text(person.job);

    //先隐藏所有标签
    G.$de_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    G.$cai_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    G.$lack_label.css({"transform" : "scale(0)"}).data("vis", false);
    $.ajax({
        url: G.PERSON_INFO_API_URL,
        crossDomain: true,
        dataType: "json",
        data: {id: person.id},
        success: function (res) {
            let DELables = [], CAILabels = [];
            let DEKeys = ["政治品德", "工作作风", "个性特点", "群众基础"],
                CAIKeys = ["能力类型", "专业特长", /*"工作业绩",*/ "分类考核"];
            DEKeys.forEach((key) => {
                if(res[key] && res[key].labels) {
                    res[key].labels.forEach((label) => DELables.push(label));
                }
            });
            CAIKeys.forEach((key) => {
                if(res[key] && res[key].labels) {
                    res[key].labels.forEach((label) => CAILabels.push(label));
                }
            });
            //给两棵树显示标签
            setTimeout(function () {
                G.$de_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
                G.$cai_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
                G.$lack_label.css({"transform" : "scale(0)"}).data("vis", false);
                let x=0, y=0;
                let vis_a = {}, vis_b = {};
                DELables.forEach((label) => {
                    if(x < G.$de_tree_label_list.length) {
                        let i = getRandomInt(0, G.$de_tree_label_list.length - 1);
                        while(vis_a[i]) i = getRandomInt(0, G.$de_tree_label_list.length - 1);

                        $(G.$de_tree_label_list[i]).css({"transform": "scale(1)"}).data("vis", true).data("ref", label.ref);
                        $(G.$de_tree_label_list[i]).find("div").text(label.name.substr(0, 4));
                        x++;
                    }
                });
                CAILabels.forEach((label) => {
                    if(y < G.$cai_tree_label_list.length) {
                        let i = getRandomInt(0, G.$cai_tree_label_list.length - 1);
                        while(vis_b[i]) i = getRandomInt(0, G.$cai_tree_label_list.length - 1);

                        $(G.$cai_tree_label_list[i]).css({"transform": "scale(1)"}).data("vis", true).data("ref", label.ref);
                        $(G.$cai_tree_label_list[i]).find("div").text(label.name.substr(0, 4));
                        y++;
                    }
                });
                console.log(DELables); console.log(CAILabels);
                if(res["不足和风险点"] && res["不足和风险点"].labels.length) {
                    let lack_list = res["不足和风险点"].labels[0].ref;
                    let sentence_list = [];
                    lack_list.forEach((ref) => {
                        sentence_list.push({str: ref.sentence, source: ref.source.fileName});
                    });
                    G.$lack_label.data("ref", sentence_list);
                    G.$lack_label.css({"transform": "scale(1)"}).data("vis", true);
                }

            }, 500);
        }
    });
}
function allDown() {
    //list里原来的项目下移
    G.$box_list.find(".info-box").each(function () {
        $(this).animate({
            top: "+=" + BOX_HEIGHT
        });
    });
}
function allNextUp($box) {
    //list里在这个box之下的项目上移
    $box.nextAll().each(function () {
        $(this).animate({
            top: "-=" + BOX_HEIGHT
        });
    });
}
function goToList($box) {
    $box.show();
    allDown();
    $box.animate({ //回到原来位置
        top: TRASH_Y - $(window).scrollTop(),
        left: TRASH_X - $(window).scrollLeft(),
    },function () { //放回容器内
        $box.css({
            top: 0,
            left: 0,
        });
        $box.removeClass("float");
        $box.prependTo(G.$box_list);
    });
}

//info box 相关事件响应
function onMouseMoveInfoBox(e) { //InfoBox的拖出事件
    console.log("move");
    if(isMouseDown && !G.floating_person) {
        let maxQueueCnt = 0;
        G.$box_list.find(".info-box").each(function () {
            maxQueueCnt = Math.max(maxQueueCnt, $(this).queue());
        });
        //等待动画队列完成，防止点太快出bug
        if(maxQueueCnt === 0) {
            $(this).css({
                top: $(this).offset().top - $(window).scrollTop(),
                left: $(this).offset().left - $(window).scrollLeft(),
            }).addClass("float");
            G.floating_person = $(this).data("person_obj");
            click_x = e.pageX - $(this).offset().left;
            click_y = e.pageY - $(this).offset().top;
            allNextUp($(this));
            $(this).appendTo(G.$box_trash);
        }
    }
}
function onClickInfoBox() { //InfoBox的点击事件
    console.log("click");
    focusOn($(this));
    setPersonInfo($(this).data("person_obj"));
}

//cell 的相关事件响应
function onMouseEnterCell() {
    G.$active_cell = $(this);
}
function onMouseLeaveCell() {
    G.$active_cell = null;
}
function onMouseMoveCell(e) { //cell中的box拖出事件

    /* 如果是拖出且当前格子有内容 */
    if(isMouseDown && !G.floating_person && $(this).data("person")) {
        //拿出这个box并显示
        G.floating_person = $(this).data("person");
        $(this).data("person", null);
        $(this).text("");
        G.floating_person.$box.show();
        //修改group
        $(this).data("group").removeMember(G.floating_person.id);
        GroupBox.update();
        //记录下从哪个格子拖出来的，高亮用
        G.floating_person.$box.data("cell_from", $(this));
    }
}
function onRightClickCell(e) {
    if(!$(this).data("person")) {
        $(this).removeClass("changed");
    }
    return false;
}
function onClickCell() {
    if($(this).hasClass("title-row")) {
        GroupBox.setGroup($(this).data("group"));
    }
    else {
        let p = $(this).data("person");
        if(p) {
            focusOn($(this));
            setPersonInfo(p);
        }
        console.log($(this).width());
    }
}

//PK台的相关事件
$("#foot_col4").find(".photo-col .photo")
    .mousemove(function () {
        G.$active_stage = $(this);
    })
    .mouseout(function () {
        G.$active_stage = null;
    })
    //PK台box拽出
    .mousedown(function () {
        if($(this).data("person")) {
            G.floating_person = $(this).data("person");
            G.floating_person.$box.show();
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

//事件统一注册函数
function initCell($cell) {
    $cell.click(onClickCell)
        .mousemove(onMouseMoveCell)
        .mouseleave(onMouseLeaveCell)
        .mouseenter(onMouseEnterCell)
        .contextmenu(onRightClickCell);

}
function initBox($box, $bind_cell = null) {
    $box.mousemove(onMouseMoveInfoBox)
        .click(onClickInfoBox);
    if($bind_cell) {
        $box.data("cell_from", $bind_cell);
    }
}

//全局事件
$(window).contextmenu(function () {
    return false;
});
$(window).on("mouseup", function (e) {
    if(G.floating_person) {
        //如果当前鼠标下有cell，则填充
        if(G.$active_cell) {
            if(G.$active_cell.data("person")) { //如果当前cell已经有内容了
                //修改group
                G.$active_cell.data("group").removeMember(G.$active_cell.data("person").id);
                GroupBox.update();
                //让这个box回备选区去
                if(G.$active_cell.hasClass("active")) {
                    focusOn(null);
                }
                G.$active_cell.data("person").$box.css({
                    top: e.pageY - $(window).scrollTop(),
                    left: e.pageX - $(window).scrollLeft()
                });
                goToList(G.$active_cell.data("person").$box);
                G.$active_cell.data("person", null);
            }
            let $from = G.floating_person.$box.data("cell_from");
            let $to = G.$active_cell;
            if($from && $to && !$to.is($from)) {
                //设置高亮
                $from.addClass("changed");
                $to.addClass("changed");
                //加变动线
                LineLayer.addLine(getNodeCenter($from), getNodeCenter($to));
            }
            //设置姓名
            G.$active_cell.text(clipName(G.floating_person.name, 3));
            //把person附加到cell上
            G.$active_cell.data("person", G.floating_person);
            //设置group
            G.$active_cell.data("group").addMember(G.$active_cell.data("person"));
            GroupBox.update();
            //隐藏box
            G.floating_person.$box.hide();

        }
        //如果是拖到PK台
        else if(G.$active_stage) {
            //如果当前pk位已经有人了
            if(G.$active_stage.data("person")) {
                //让这个box回备选区去
                goToList(G.$active_stage.data("person").$box);
                G.$active_stage.data("person", null);
            }
            G.floating_person.$box.hide();
            G.$active_stage.data("person", G.floating_person);
            if(G.$active_stage.parent().attr("id") === "photo_col_left")
                PKStage.setLeft(G.floating_person);
            else
                PKStage.setRight(G.floating_person);
            G.floating_person = null;

        }
        else { //否则让box回去
            goToList(G.floating_person.$box);
            G.floating_person.$box.data("cell_from").addClass("changed");
            let group = G.floating_person.$box.data("cell_from").data("group");
            group.removeMember(G.floating_person.id);
            GroupBox.update();
        }
        G.floating_person = null;
    }
});
$(window).on("mousedown", function () {
    isMouseDown = true;
});
$(window).on("mouseup", function () {
    isMouseDown = false;
});
$(window).on("mousemove", function (e) { //box跟随鼠标移动
    if (G.floating_person) {
        G.floating_person.$box.css({
            top: e.pageY - $(window).scrollTop() - click_y,
            left: e.pageX - $(window).scrollLeft() - click_x
        });
    }
});

/** 气泡框相关 **/
import {} from "./PersonDetailField";

/** 初始数据填充 **/
let table_left = new NormalTableController();
let unfixedTableController1 = new UnfixedTableController($("#table_right1"));
let unfixedTableController2 = new UnfixedTableController($("#table_right2"));
let unfixedTableController3 = new UnfixedTableController($("#table_right3"));
let unfixedTableController4 = new UnfixedTableController($("#table_right4"));
let unfixedTableController5 = new UnfixedTableController($("#table_right5"));
$(document).ready(function () {
    //人员表数据
    //左边表格
    $.get("php/dp_leaderJson.php?BM=1", function (data) {
        data = data[0];
        console.log(data);
        //第一行的职位标题
        table_left.newLine();
        table_left.addColTitleCell("---");
        for (let i=0 ; i<16 ; ++i) {
            table_left.addColTitleCell(data.colTitle[i]);
        }
        table_left.applyLine();
        //各个街镇的行
        for (let i=0 ; i<20 ; ++i) {
            table_left.newLine();
            let group = new Group(data.rows[i].groupID, data.rows[i].rowTitle, data.rows[i].desc);
            //街镇标题
            table_left.addRowTitleCell(data.rows[i].rowTitle).click(onClickCell).data("group", group);
            for (let j=0 ; j<16 ; ++j) {
                let p_data = data.rows[i].items[j];
                let $cell = table_left.addCell();
                $cell.data("group", group);
                if(p_data.id !== -1) {
                    let person = new Person(p_data);
                    Charts.addPerson(person);
                    group.addMember(person);
                    $cell.text(clipName(person.name, 4));
                    //生成一个box的node
                    //隐藏并丢到trash里
                    initBox(person.$box, $cell);
                    person.$box.hide().addClass("float");
                    $cell.data("person", person);
                    G.$box_trash.append(person.$box);
                }
                initCell($cell);
            }
            group.setOriginState();
            table_left.applyLine();
        }
        Charts.update();
    }, "json");
    //右边表格
    function insertToTable(data, l, r, table) {
        //对于每个单位
        for(let x=l ; x<=r ; ++x) {
            //标题行
            let group = new Group(data[x].groupID, data[x].rowTitle, data[x].desc);
            table.newLine();
            table.addTitleCell(clipName(data[x].rowTitle, 3)).click(onClickCell).data("group", group);

            //所有人
            for(let i=0 ; i<data[x].items.length ; ++i) {
                let p_data = data[x].items[i];
                let person = new Person(p_data);
                let $cell = table.addCell(clipName(person.name, 3));
                $cell.data("group", group);
                initCell($cell);

                if(person.id !== -1) {
                    group.addMember(person)
                    Charts.addPerson(person);
                    //生成一个box的node
                    //隐藏并丢到trash里
                    initBox(person.$box, $cell);
                    person.$box.hide().addClass("float");
                    $cell.data("person", person);
                    G.$box_trash.append(person.$box);
                }
            }
            group.setOriginState();
            table.applyLine();
            table.finishBlock();
        }
    }

    $.get("php/dp_leaderJson.php?BM=2", function (data) {
        data = data[0].rows;
        console.log(data);
        insertToTable(data, 0, 11, unfixedTableController1);
        insertToTable(data, 12, 32, unfixedTableController2);
        insertToTable(data, 33, 49, unfixedTableController3);
        insertToTable(data, 50, 66, unfixedTableController4);
        insertToTable(data, 67, 76, unfixedTableController5);
        Charts.update();
    }, "json");
});

/** 其他一些初始化 **/
$(document).ready(function () {
    //隐藏所有标签
    G.$de_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    G.$cai_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    G.$lack_label.css({"transform" : "scale(0)"}).data("vis", false);
});

