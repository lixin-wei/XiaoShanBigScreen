import {planMap} from "./include/Global";

window.$ = window.jQuery = require("jquery");
let moment = require("moment");
import * as G from "./include/Global";
import {getRandomInt, clipString, getNodeCenter} from "./HelperFuncitions";
import {Person} from "./class/Person";
import {Group} from "./class/Group";
import {NormalTableController} from "./NormalTableController";
import * as RightTable from "./UnfixedTableController";
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
    console.log(`person_id = ${person.ID}`);
    G.setShowingPersonID(person.ID);
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
        data: {id: person.ID},
        success: function (res) {
            let DELables = [], CAILabels = [], OrangeLabels = [];
            let DEKeys = ["政治品德", "工作作风", "个性特点", "群众基础"],
                OrangeKeys = ["能力类型", "专业特长"], //用橙色显示的标签
                CAIKeys = [/*"工作业绩",*/ "分类考核"];
            DEKeys.forEach((key) => {
                if(res[key] && res[key].labels) {
                    res[key].labels.forEach((label) => DELables.push(label));
                }
            });
            OrangeKeys.forEach((key) => {
                if(res[key] && res[key].labels) {
                    res[key].labels.forEach((label) => OrangeLabels.push(label));
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
                OrangeLabels.forEach((label) => {
                    if(y < G.$cai_tree_label_list.length) {
                        let i = getRandomInt(0, G.$cai_tree_label_list.length - 1);
                        while(vis_b[i]) i = getRandomInt(0, G.$cai_tree_label_list.length - 1);
                        //设置成橙色
                        $(G.$cai_tree_label_list[i]).attr("class", "tree-label orange");
                        $(G.$cai_tree_label_list[i]).css({"transform": "scale(1)"}).data("vis", true).data("ref", label.ref);
                        $(G.$cai_tree_label_list[i]).find("div").text(label.name.substr(0, 4));
                        y++;
                    }
                });
                CAILabels.forEach((label) => {
                    if(y < G.$cai_tree_label_list.length) {
                        let i = getRandomInt(0, G.$cai_tree_label_list.length - 1);
                        while(vis_b[i]) i = getRandomInt(0, G.$cai_tree_label_list.length - 1);
                        //设置成蓝色
                        $(G.$cai_tree_label_list[i]).attr("class", "tree-label blue");
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
    if(isMouseDown && !G.getFloatingPerson()) {
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
            G.setFloatingPerson($(this).data("person_obj"));
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
    G.setActiveCell($(this));
}
function onMouseLeaveCell() {
    G.setActiveCell(null);
}
function onMouseMoveCell(e) { //cell中的box拖出事件

    /* 如果是拖出且当前格子有内容 */
    if(isMouseDown && !G.getFloatingPerson() && $(this).data("person")) {
        //拿出这个box并显示
        G.setFloatingPerson($(this).data("person"));
        $(this).data("person", null);
        //清空格子
        $(this).text(G.CELL_EMPTY_ALPHA).removeClass("important");
        G.getFloatingPerson().$box.show();
        //修改group
        $(this).data("group").removeMember(G.getFloatingPerson().ID);
        GroupBox.update();
        //记录下从哪个格子拖出来的，高亮用
        G.getFloatingPerson().$box.data("cell_from", $(this));
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
    if(G.getFloatingPerson()) {
        //如果当前鼠标下有cell，则填充
        if(G.getActiveCell()) {
            if(G.getActiveCell().data("person")) { //如果当前cell已经有内容了
                //修改group
                G.getActiveCell().data("group").removeMember(G.getActiveCell().data("person").ID);
                GroupBox.update();
                //让这个box回备选区去
                if(G.getActiveCell().hasClass("active")) {
                    focusOn(null);
                }
                G.getActiveCell().data("person").$box.css({
                    top: e.pageY - $(window).scrollTop(),
                    left: e.pageX - $(window).scrollLeft()
                });
                goToList(G.getActiveCell().data("person").$box);
                G.getActiveCell().data("person", null);
            }
            let $from = G.getFloatingPerson().$box.data("cell_from");
            let $to = G.getActiveCell();
            if($from && $to && !$to.is($from)) {
                //设置高亮
                $from.addClass("changed");
                $to.addClass("changed");
                //加变动线
                LineLayer.addLine(getNodeCenter($from), getNodeCenter($to));
                //记录调动
                G.transLog.push({
                    from: $from.data("positionName"),
                    to: $to.data("positionName"),
                    who: G.getFloatingPerson()
                });
            }
            //设置姓名
            G.getActiveCell().text(clipString(G.getFloatingPerson().name, 3));
            //把person附加到cell上
            G.getActiveCell().data("person", G.getFloatingPerson());
            //设置group
            G.getActiveCell().data("group").addMember(G.getActiveCell().data("person"));
            //如果是市委干部，加个高亮
            if(G.getFloatingPerson().flag === 1) {
                G.getActiveCell().addClass("important");
            }
            GroupBox.update();
            //隐藏box
            G.getFloatingPerson().$box.hide();

        }
        //如果是拖到PK台
        else if(G.getActiveStage()) {
            //如果当前pk位已经有人了
            if(G.getActiveStage().data("person")) {
                //让这个box回备选区去
                goToList(G.getActiveStage().data("person").$box);
                G.getActiveStage().data("person", null);
            }
            G.getFloatingPerson().$box.hide();
            G.getActiveStage().data("person", G.getFloatingPerson());
            if(G.getActiveStage().parent().attr("id") === "photo_col_left")
                PKStage.setLeft(G.getFloatingPerson());
            else
                PKStage.setRight(G.getFloatingPerson());
            G.setFloatingPerson(null);

        }
        else { //否则让box回去
            goToList(G.getFloatingPerson().$box);
            G.getFloatingPerson().$box.data("cell_from").addClass("changed");
            let group = G.getFloatingPerson().$box.data("cell_from").data("group");
            group.removeMember(G.getFloatingPerson().ID);
            GroupBox.update();
        }
        G.setFloatingPerson(null);
    }
});
$(window).on("mousedown", function () {
    isMouseDown = true;
});
$(window).on("mouseup", function () {
    isMouseDown = false;
});
$(window).on("mousemove", function (e) { //box跟随鼠标移动
    if (G.getFloatingPerson()) {
        G.getFloatingPerson().$box.css({
            top: e.pageY - $(window).scrollTop() - click_y,
            left: e.pageX - $(window).scrollLeft() - click_x
        });
    }
});

/** 气泡框相关 **/
import {} from "./PersonDetailField";
/** 初始数据填充 **/
let table_left = new NormalTableController();
$(document).ready(function () {
    //首先获取整个职位结构
    $.get("php/getPositionStructure", {}, function (positionStc) {
        // G.positionStc = positionStc;
        //然后获取到当前的plan
        $.get("php/getPlan.php", {ID: "-1"}, function (planMap) {
            // console.log(map);
            // G.planMap = planMap;
            //汇总所有人，得到信息表
            let personIDList = [];
            Object.entries(planMap).forEach(([i, row]) => {
                Object.entries(row).forEach(([j, id]) => {
                    if(id !== null)personIDList.push(id);
                })
            });
            $.post("php/getPersonInfo.php", {IDList: personIDList}, function (personInfoMap) {
                //开始填充，左表
                let data = positionStc['fixed'];
                table_left.newLine();
                table_left.addColTitleCell("---");
                for (let i=0 ; i<18 ; ++i) {
                    if(i+1 === 5 || i+1 === 6 ) continue;
                    table_left.addColTitleCell(data[0]['items'][i]['name']);
                }
                table_left.applyLine();
                //各个街镇的行
                for (let x=0 ; x<data.length ; ++x) {
                    table_left.newLine();
                    let group = new Group(data[x].ID, data[x].name, data[x].desc);
                    //街镇标题
                    table_left.addRowTitleCell(data[x].name).click(onClickCell).data("group", group);
                    for (let y=0 ; y<18 ; ++y) {
                        if(y+1 === 5 || y+1 === 6 ) continue;
                        let groupID = data[x].ID, jobID = data[x].items[y].ID;
                        let pID = planMap[groupID][jobID];
                        let p_data = personInfoMap[pID];
                        let $cell = table_left.addCell();
                        $cell.data("group", group);
                        $cell.data("positionName", `${data[x].name} ${data[x].items[y].name}`);

                        if(pID !== null) {
                            p_data['groupID'] = groupID;
                            p_data['jobID'] = jobID;
                            p_data['job'] = `${data[x].name} ${data[x].items[y].name}`;
                            let person = new Person(p_data);
                            //如果是市委干部，特别颜色标注
                            if(person.flag === 1) {
                                $cell.addClass("important");
                            }
                            Charts.addPerson(person);
                            group.addMember(person);
                            $cell.text(clipString(person.name, 4));
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
                //右表
                //对于每个单位
                data = positionStc['unfixed'];
                console.log(data);
                for(let x=0 ; x<data.length ; ++x) {
                    //标题行
                    let group = new Group(data[x].ID, data[x].name, data[x].desc);
                    RightTable.newLine();
                    RightTable.addTitleCell(clipString(data[x].name, 4)).click(onClickCell).data("group", group);

                    //所有人
                    for(let y=0 ; y<data[x].items.length ; ++y) {
                        let groupID = data[x].ID, jobID = data[x].items[y].ID;
                        let pID = planMap[groupID][jobID];
                        let p_data = personInfoMap[pID];

                        let $cell = RightTable.addCell();
                        $cell.data("group", group);
                        $cell.data("positionName", `${data[x].name} ${data[x].items[y].name}`);
                        initCell($cell);

                        if(pID !== null) {
                            p_data['groupID'] = groupID;
                            p_data['jobID'] = jobID;
                            p_data['job'] = `${data[x].name} ${data[x].items[y].name}`;
                            let person = new Person(p_data);
                            //如果是市委干部，特别颜色标注
                            if(person.flag === 1) {
                                $cell.addClass("important");
                            }
                            $cell.text(clipString(person.name, 3));
                            group.addMember(person);
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
                    RightTable.applyLine();
                    RightTable.finishBlock();
                }
                Charts.update();
            }, "json")
        }, "json");
    }, "json");
});


/** 初始化 **/
$(document).ready(function () {
    //隐藏所有标签
    G.$de_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    G.$cai_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    G.$lack_label.css({"transform" : "scale(0)"}).data("vis", false);
});

