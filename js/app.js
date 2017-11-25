window.$ = window.jQuery = require("jquery");
import * as G from "./Statics";
import {NormalTableController} from "./NormalTableController";
import {UnfixedTableController} from "./UnfixedTableController";
import {chartController} from "./ChartController";
import {GroupBoxController} from "./GroupBoxController";
import {LineLayer} from "./LineLayer";
import {PKStageController} from "./PKStageController";
import {Person} from "./Person";
import {Group} from "./Group";
import {getRandomInt, clipName, getNodeCenter} from "./HelperFuncitions";

/** 变动线层 **/
let lineLayer = new LineLayer();
//保持全屏，持续重置原点
function resizeLineLayer() {
    lineLayer.resizeCanvas(window.innerHeight, window.innerWidth);
}
function resetOrigin() {
    lineLayer.setOrigin($(window).scrollLeft(), $(window).scrollTop());
}
$(window).on("resize scroll", function () {
    resizeLineLayer();
    resetOrigin();
});
resizeLineLayer();
resetOrigin();
$("#cb_line_layer").change(function () {
    if(this.checked) {
        lineLayer.show();
    }
    else {
        lineLayer.hide();
    }
});

/** info-box拖动 **/
let $box_list = $("#mid_col3_body_list");
let $box_trash = $("#mid_col3_box_trash");
let $de_tree_label_list = $(".tree-label.purple");
let $cai_tree_label_list = $(".tree-label.blue, .tree-label.orange");
let $lack_label = $("#tree_grey_label_1");
let $person_info_container = $("#foot_col3_photo_container");
let $town_box = $("#foot_col2");
let floating_person = null;
let showing_person_id = null;
let $active_cell = null;
let $active_stage = null;
let click_x = 0, click_y = 0;
let isMouseDown = false;
let stage = new PKStageController();
let group_box = new GroupBoxController();
const BOX_HEIGHT = 150;
const TRASH_X = $box_list.offset().left;
const TRASH_Y = $box_list.offset().top;

//box list的动画控制函数
function focusOn($ele) {
    $(".cell, .info-box").removeClass("active");
    if($ele) {
        $ele.addClass("active");
    }
}
function setPersonInfo(person) {
    console.log(`person_id = ${person.id}`);
    showing_person_id = person.id;
    $person_info_container.find(".photo img").attr("src", G.PERSON_PHOTO_ROOT + person.photo);
    $person_info_container.find(".name").text(person.name);
    $person_info_container.find(".info1").text(person.getInfo());
    $person_info_container.find(".info2").text(person.job);

    //先隐藏所有标签
    $de_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    $cai_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    $lack_label.css({"transform" : "scale(0)"}).data("vis", false);
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
                $de_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
                $cai_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
                $lack_label.css({"transform" : "scale(0)"}).data("vis", false);
                let x=0, y=0;
                let vis_a = {}, vis_b = {};
                DELables.forEach((label) => {
                    if(x < $de_tree_label_list.length) {
                        let i = getRandomInt(0, $de_tree_label_list.length - 1);
                        while(vis_a[i]) i = getRandomInt(0, $de_tree_label_list.length - 1);

                        $($de_tree_label_list[i]).css({"transform": "scale(1)"}).data("vis", true).data("ref", label.ref);
                        $($de_tree_label_list[i]).find("div").text(label.name.substr(0, 4));
                        x++;
                    }
                });
                CAILabels.forEach((label) => {
                    if(y < $cai_tree_label_list.length) {
                        let i = getRandomInt(0, $cai_tree_label_list.length - 1);
                        while(vis_b[i]) i = getRandomInt(0, $cai_tree_label_list.length - 1);

                        $($cai_tree_label_list[i]).css({"transform": "scale(1)"}).data("vis", true).data("ref", label.ref);
                        $($cai_tree_label_list[i]).find("div").text(label.name.substr(0, 4));
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
                    $lack_label.data("ref", sentence_list);
                    $lack_label.css({"transform": "scale(1)"}).data("vis", true);
                }

            }, 500);
        }
    });
}
function allDown() {
    //list里原来的项目下移
    $box_list.find(".info-box").each(function () {
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
        $box.prependTo($box_list);
    });
}

//info box 相关事件响应
function onMouseMoveInfoBox(e) { //InfoBox的拖出事件
    console.log("move");
    if(isMouseDown && !floating_person) {
        let maxQueueCnt = 0;
        $box_list.find(".info-box").each(function () {
            maxQueueCnt = Math.max(maxQueueCnt, $(this).queue());
        });
        //等待动画队列完成，防止点太快出bug
        if(maxQueueCnt === 0) {
            $(this).css({
                top: $(this).offset().top - $(window).scrollTop(),
                left: $(this).offset().left - $(window).scrollLeft(),
            }).addClass("float");
            floating_person = $(this).data("person_obj");
            click_x = e.pageX - $(this).offset().left;
            click_y = e.pageY - $(this).offset().top;
            allNextUp($(this));
            $(this).appendTo($box_trash);
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
    $active_cell = $(this);
}
function onMouseLeaveCell() {
    $active_cell = null;
}
function onMouseMoveCell(e) { //cell中的box拖出事件

    /* 如果是拖出且当前格子有内容 */
    if(isMouseDown && !floating_person && $(this).data("person")) {
        //拿出这个box并显示
        floating_person = $(this).data("person");
        $(this).data("person", null);
        $(this).text("");
        floating_person.$box.show();
        //修改group
        $(this).data("group").removeMember(floating_person.id);
        group_box.update();
        //记录下从哪个格子拖出来的，高亮用
        floating_person.$box.data("cell_from", $(this));
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
        group_box.setGroup($(this).data("group"));
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
        $active_stage = $(this);
    })
    .mouseout(function () {
        $active_stage = null;
    })
    //PK台box拽出
    .mousedown(function () {
        if($(this).data("person")) {
            floating_person = $(this).data("person");
            floating_person.$box.show();
            $(this).data("person", null);

            if($(this).parent().attr("id") === "photo_col_left")
                stage.clearLeft();
            else
                stage.clearRight();
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
        stage.clearLeft();
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
        stage.clearRight();
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
    if(floating_person) {
        //如果当前鼠标下有cell，则填充
        if($active_cell) {
            if($active_cell.data("person")) { //如果当前cell已经有内容了
                //修改group
                $active_cell.data("group").removeMember($active_cell.data("person").id);
                group_box.update();
                //让这个box回备选区去
                if($active_cell.hasClass("active")) {
                    focusOn(null);
                }
                $active_cell.data("person").$box.css({
                    top: e.pageY - $(window).scrollTop(),
                    left: e.pageX - $(window).scrollLeft()
                });
                goToList($active_cell.data("person").$box);
                $active_cell.data("person", null);
            }
            let $from = floating_person.$box.data("cell_from");
            let $to = $active_cell;
            if($from && $to && !$to.is($from)) {
                //设置高亮
                $from.addClass("changed");
                $to.addClass("changed");
                //加变动线
                lineLayer.addLine(getNodeCenter($from), getNodeCenter($to));
            }
            //设置姓名
            $active_cell.text(clipName(floating_person.name, 3));
            //把person附加到cell上
            $active_cell.data("person", floating_person);
            //设置group
            $active_cell.data("group").addMember($active_cell.data("person"));
            group_box.update();
            //隐藏box
            floating_person.$box.hide();

        }
        //如果是拖到PK台
        else if($active_stage) {
            //如果当前pk位已经有人了
            if($active_stage.data("person")) {
                //让这个box回备选区去
                goToList($active_stage.data("person").$box);
                $active_stage.data("person", null);
            }
            floating_person.$box.hide();
            $active_stage.data("person", floating_person);
            if($active_stage.parent().attr("id") === "photo_col_left")
                stage.setLeft(floating_person);
            else
                stage.setRight(floating_person);
            floating_person = null;

        }
        else { //否则让box回去
            goToList(floating_person.$box);
            floating_person.$box.data("cell_from").addClass("changed");
            let group = floating_person.$box.data("cell_from").data("group");
            group.removeMember(floating_person.id);
            group_box.update();
        }
        floating_person = null;
    }
});
$(window).on("mousedown", function () {
    isMouseDown = true;
});
$(window).on("mouseup", function () {
    isMouseDown = false;
});
$(window).on("mousemove", function (e) { //box跟随鼠标移动
    if (floating_person) {
        floating_person.$box.css({
            top: e.pageY - $(window).scrollTop() - click_y,
            left: e.pageX - $(window).scrollLeft() - click_x
        });
    }
});

/** 气泡框相关 **/
let $btn_family_net = $("#btn_family_net");
let $btn_colleague = $("#btn_colleague");
let $active_pop_box = null;
function removePopBox() {
    if($active_pop_box) {
        let $temp = $active_pop_box;
        //马上设成null，防止点太快出BUG
        $active_pop_box = null;
        $temp.fadeOut(500, function () {
            $temp.remove();
        });
    }
}
function showPopBox(x, y, $content, position,  css = {}) {
    removePopBox();
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
    removePopBox();
});

//各个按钮的气泡框事件
$de_tree_label_list.add($cai_tree_label_list).click(function (e) {
    if($(this).data("vis")) {
        let x = e.clientX;
        let y = e.clientY;
        let ref = $(this).data("ref");
        let $content = $($.parseHTML(`
        <div>
            <div style="font-size:larger ;color: #1a92d1; margin-bottom: 15px;">
                <i class="fa fa-files-o" style="margin-right: 7px;"></i>
                共${ref.length}条记录支持
            </div>
            <ul>
            </ul>
        </div>
        `));
        ref.forEach((r) => {
            let $li = $("<li />").text(`${r.sentence} —— 《${r.source.fileName}》`);
            $content.find("ul").append($li);
        });
        showPopBox(x, y, $content);
    }
    e.stopPropagation();
});
$lack_label.click(function (e) {
    console.log($active_pop_box);
    if($(this).data("vis")) {
        let x = e.clientX;
        let y = e.clientY;
        let ref = $(this).data("ref");
        let $content = $($.parseHTML(`
        <div>
            <div style="font-size:larger ;color: #1a92d1; margin-bottom: 15px;">
                <i class="fa fa-files-o" style="margin-right: 7px;"></i>
                共${ref.length}条记录支持
            </div>
            <ul>
            </ul>
        </div>
        `));
        ref.forEach((r) => {
            let $li = $("<li />").text(`${r.str} —— 《${r.source}》`);
            $content.find("ul").append($li);
        });
        showPopBox(x, y, $content);
    }
    e.stopPropagation();
});
$btn_colleague.click(function (e) {
    let x = e.clientX;
    let y = e.clientY;
    let $content = $($.parseHTML(`
    <div>
        <div style="font-size: larger; color: #1a92d1; margin-bottom: 15px;">
            <i class="fa fa-files-o" style="margin-right: 7px;"></i>
            历届同事
        </div>
        <table style="line-height: 2rem;">
        </table>
    </div>
    `));
    $.get("php/getColleague.php", {id: showing_person_id}, function (res) {
        for(let i=0 ; i<res.length ; ++i) {
            let data = res[i];
            let colleagues = "";
            for(let j=0 ; j<res[i].colleagues.length ; ++j) {
                let p = res[i].colleagues[j];
                if(j) colleagues += ", ";
                colleagues += `<span class="badge white">${p.name}[${p.job}]</span>`
            }
            let $tr = $(`
                <tr>
                    <td style="min-width: 250px;"><span class="nowrap">${data['begin_time']}</span> -> <span class="nowrap">${data['end_time']}</span></td>
                    <td style="min-width: 200px">${data['place']}[${data['job']}]</td>
                    <td>${colleagues}</td>
                </tr>
            `);
            $content.find("table").append($tr);
        }
        if(res.length === 0) {
            $content.find("table").remove();
            $content.append($("<div/>").text("无信息"));
        }
        showPopBox(x, y, $content, "right",{"max-width": "1550px"});
    }, "json");
    e.stopPropagation();
});
$btn_family_net.click(function (e) {
    let x = e.clientX;
    let y = e.clientY;
    let $content = $($.parseHTML(`
    <div>
        <div style="font-size: larger; color: #1a92d1; margin-bottom: 15px;">
            <i class="fa fa-files-o" style="margin-right: 7px;"></i>
            亲属网
        </div>
        <table>
        </table>
    </div>
    `));
    $.get("php/getFamilyNet.php", {id: showing_person_id}, function (res) {
        for(let i=0 ; i<res.length ; ++i) {
            let data = res[i];
            let $tr = $(`
                <tr>
                    <td>${data[0]}</td>
                    <td>${data[1]}</td>
                    <td>${data[2]} ${data[3]}</td>
                </tr>
            `);
            $content.find("table").append($tr);
        }
        if(res.length === 0) {
            $content.find("table").remove();
            $content.append($("<div/>").text("无信息"));
        }
        showPopBox(x, y, $content);
    }, "json");
    e.stopPropagation();
});
$("#btn_abroad").click(function (e) {
    let x = e.clientX;
    let y = e.clientY;
    let $content = $($.parseHTML(`
    <div>
        <div style="font-size: larger; color: #1a92d1; margin-bottom: 15px;">
            <i class="fa fa-files-o" style="margin-right: 7px;"></i>
            出国境情况
        </div>
        <table>
            <tr>
                <td>时间</td><td>地点</td><td>事由</td>
            </tr>
        </table>
    </div>
    `));
    $.get("php/getAbroadInfo.php", {id: showing_person_id}, function (res) {
        for(let i=0 ; i<res.length ; ++i) {
            let data = res[i];
            let $tr = $(`
                <tr>
                    <td>${data[0]} --- ${data[1]}</td>
                    <td>${data[2]}</td>
                    <td>${data[3]}</td>
                </tr>
            `);
            $content.find("table").append($tr);
        }
        if(res.length === 0) {
            $content.find("table").remove();
            $content.append($("<div/>").text("无信息"));
        }
        showPopBox(x, y, $content);
    }, "json");
    e.stopPropagation();
});
$("#foot_col_mid_container").find(".item .label").click(function (e) {
    let x = e.clientX;
    let y = e.clientY;
    let person_l = $("#photo_col_left").find(".photo").data("person");
    let person_r = $("#photo_col_right").find(".photo").data("person");
    let name_l = "---", name_r = "---";
    if(person_l) name_l = person_l.name;
    if(person_r) name_r = person_r.name;
    let $content = $($.parseHTML(`
        <table>
            <tr>
                <td width="25%">${name_l}</td>
                <td width="50%" colspan="2">${$(this).text()}</td>
                <td width="25%">${name_r}</td>            
            </tr>
            <tr>
                <td colspan="2" width="50%"></td>
                <td colspan="2" width="50%"></td>
            </tr>
        </table>
    `));
    let data_left = $(this).data("ref_left"), data_right =  $(this).data("ref_right");
    let $cell_left = $content.find("tr:last-child").find("td:first-child");
    let $cell_right = $content.find("tr:last-child").find("td:last-child");
    if(data_left){
        data_left.forEach((label) => {
            let $div = $("<div/>");
            $div.append($("<h3/>").text(label.name));
            let $ref_container = $("<div/>");
            label.ref.forEach((r) => {
                let $single_ref = $("<p/>").text(`${r.sentence}`);
                $ref_container.append($single_ref);
            });
            $div.append($ref_container);
            $cell_left.append($div);
        });
    }
    if(data_right) {
        data_right.forEach((label) => {
            let $div = $("<div/>");
            $div.append($("<h3/>").text(label.name));
            let $ref_container = $("<div/>");
            label.ref.forEach((r) => {
                let $single_ref = $("<p/>").text(`${r.sentence}`);
                $ref_container.append($single_ref);
            });
            $div.append($ref_container);
            $cell_right.append($div);
        });
    }
    showPopBox(x, y, $content, "middle");
    e.stopPropagation();
});

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
                    group.addMember(person);
                    $cell.text(clipName(person.name, 4));
                    //生成一个box的node
                    //隐藏并丢到trash里
                    initBox(person.$box, $cell);
                    person.$box.hide().addClass("float");
                    $cell.data("person", person);
                    $box_trash.append(person.$box);
                }
                initCell($cell);
            }
            group.setOriginState();
            table_left.applyLine();
        }
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
                    group.addMember(person);
                    //生成一个box的node
                    //隐藏并丢到trash里
                    initBox(person.$box, $cell);
                    person.$box.hide().addClass("float");
                    $cell.data("person", person);
                    $box_trash.append(person.$box);
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
    }, "json");
});

/** 其他一些初始化 **/
$(document).ready(function () {
    //隐藏所有标签
    $de_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    $cai_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    $lack_label.css({"transform" : "scale(0)"}).data("vis", false);
});

