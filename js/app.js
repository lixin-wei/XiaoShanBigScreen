window.$ = window.jQuery = require("jquery");
import {NormalTableController} from "./NormalTableController";
import {UnfixedTableController} from "./UnfixedTableController";
import {chartController} from "./ChartController";
import {LineLayer} from "./LineLayer";
import {Person} from "./Person";
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
$(document).on("ready", function () {
    resizeLineLayer();
    resetOrigin();
});
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
let $person_info_container = $("#foot_col3_photo_container");
let floating_person = null;
let $active_cell = null;
let click_x = 0, click_y = 0;
let isMouseDown = false;
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
    $person_info_container.find(".photo").attr("src", `images/mans/${person.photo}`);
    $person_info_container.find(".name").text(person.name);
    $person_info_container.find(".info1").text(person.getInfo());
    $person_info_container.find(".info2").text(person.job);

    //先隐藏所有标签
    $de_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    $cai_tree_label_list.css({"transform" : "scale(0)"}).data("vis", false);
    $.ajax({
        url: "http://localhost:5000/summary",
        crossDomain: true,
        dataType: "json",
        data: {id: person.ID},
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
        //记录下从哪个格子拖出来的，高亮用
        floating_person.$box.data("from", $(this));
    }
}
function onRightClickCell(e) {
    if(!$(this).data("person")) {
        $(this).removeClass("changed");
    }
    return false;
}
function onClickCell() {
    let p = $(this).data("person");
    if(p) {
        focusOn($(this));
        setPersonInfo(p);
    }
    console.log($(this).width());
}

//事件统一注册函数
function setEventForCell($cell) {
    $cell.click(onClickCell)
        .mousemove(onMouseMoveCell)
        .mouseleave(onMouseLeaveCell)
        .mouseenter(onMouseEnterCell)
        .contextmenu(onRightClickCell);
}
function setEventForBox($box) {
    $box.mousemove(onMouseMoveInfoBox)
        .click(onClickInfoBox);
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
            let $from = floating_person.$box.data("from");
            let $to = $active_cell;
            //设置高亮
            $from.addClass("changed");
            $to.addClass("changed");
            //加变动线
            lineLayer.addLine(getNodeCenter($from), getNodeCenter($to));
            //设置姓名
            $active_cell.text(clipName(floating_person.name, 3));
            //把person附加到cell上
            $active_cell.data("person", floating_person);
            //隐藏box
            floating_person.$box.hide();

        }
        else { //否则让box回去
            goToList(floating_person.$box);
            floating_person.$box.data("from").addClass("changed");
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
        $active_pop_box.remove();
        $active_pop_box = null;
    }
}
function showPopBox(x, y, $content) {
    removePopBox();
    let $popBox = $($.parseHTML(`
        <div class="pop-box"></div>
    `));
    $popBox.append($content);
    //先隐藏放到dom里，计算出大小
    $popBox.hide();
    $popBox.appendTo($("body"));
    $popBox = $(".pop-box");

    //然后显示
    $popBox.css({
        position: "fixed",
        top: y - $popBox.outerHeight() - 20,
        left: x + 20
    }).show();

    $active_pop_box = $popBox;
}
$(window).on("scroll click", function () {
    removePopBox();
});
$("div.tree-label").click(function (e) {
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
            let $li = $("<li />").text(r.sentence);
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
        <div style="font-size: medium; color: #1a92d1; margin-bottom: 15px;">
            <i class="fa fa-files-o" style="margin-right: 7px;"></i>
            历届同事
        </div>
        <table style="margin-bottom: 15px;" align="center">
            <tr>
                <td>张三</td>
                <td>这是单位</td>
                <td>这是职务</td>
            </tr>
            <tr>
                <td>张三</td>
                <td>这是单位</td>
                <td>这是职务</td>
            </tr>
            <tr>
                <td>张三</td>
                <td>这是单位</td>
                <td>这是职务</td>
            </tr>
        </table>
        <div class="text-center">
            <button class="btn blue"><i class="fa fa-search"></i>查看全部</button>
        </div>
    `));
    showPopBox(x, y, $content);
    e.stopPropagation();
});
$btn_family_net.click(function (e) {
    let x = e.clientX;
    let y = e.clientY;
    let $content = $($.parseHTML(`
        <div style="font-size: medium; color: #1a92d1; margin-bottom: 15px;">
            <i class="fa fa-files-o" style="margin-right: 7px;"></i>
            亲属网
        </div>
        <table style="margin-bottom: 15px;" align="center">
            <tr>
                <td>父亲</td>
                <td>张三</td>
                <td>这是职务</td>
            </tr>
            <tr>
                <td>母亲</td>
                <td>张三</td>
                <td>这是职务</td>
            </tr>
            <tr>
                <td>儿子</td>
                <td>张三</td>
                <td>这是职务</td>
            </tr>
        </table>
        <div class="text-center">
            <button class="btn blue"><i class="fa fa-search"></i>查看全部</button>
        </div>
    `));
    showPopBox(x, y, $content);
    e.stopPropagation();
});


/** 初始数据填充 **/

let normalTableController = new NormalTableController();
let unfixedTableController1 = new UnfixedTableController($("#table_right1"));
let unfixedTableController2 = new UnfixedTableController($("#table_right2"));
let unfixedTableController3 = new UnfixedTableController($("#table_right3"));
let unfixedTableController4 = new UnfixedTableController($("#table_right4"));
let unfixedTableController5 = new UnfixedTableController($("#table_right5"));
$(document).ready(function () {
    //人员表数据
    //左边表格
    $.get("../blog3/ajax/dp_leaderJson.php?BM=1", function (data) {
        data = data[0];
        console.log(data);
        //第一行的职位标题
        normalTableController.newLine();
        normalTableController.addColTitleCell("---");
        for (let i=0 ; i<16 ; ++i) {
            normalTableController.addColTitleCell(data.colTitle[i]);
        }
        normalTableController.applyLine();
        //各个街镇的行
        for (let i=0 ; i<20 ; ++i) {
            normalTableController.newLine();
            //街镇标题
            normalTableController.addRowTitleCell(data.rows[i].rowTitle);
            for (let j=0 ; j<16 ; ++j) {
                let p_data = data.rows[i].items[j];
                let $cell = normalTableController.addCell();
                if(p_data.ID !== -1) {
                    let person = new Person(p_data);
                    $cell.text(clipName(person.name, 4));
                    //生成一个box的node
                    //隐藏并丢到trash里
                    setEventForBox(person.$box);
                    person.$box.hide().addClass("float");
                    $cell.data("person", person);
                    $box_trash.append(person.$box);
                }
                setEventForCell($cell);
            }
            normalTableController.applyLine();
        }
    }, "json");
    //右边表格
    function insertToTable(data, l, r, unfixedTableController) {
        //对于每个单位
        for(let x=l ; x<=r ; ++x) {
            //标题行
            unfixedTableController.newLine();
            unfixedTableController.addTitleCell(clipName(data[x].rowTitle, 7));

            //所有人
            for(let i=0 ; i<data[x].items.length ; ++i) {
                let p_data = data[x].items[i];
                let person = new Person(p_data);
                let $cell = unfixedTableController.addCell(clipName(person.name, 3));
                setEventForCell($cell);

                if(person.ID !== -1) {
                    //生成一个box的node
                    //隐藏并丢到trash里
                    setEventForBox(person.$box);
                    person.$box.hide().addClass("float");
                    $cell.data("person", person);
                    $box_trash.append(person.$box);
                }
            }
            unfixedTableController.applyLine();
        }
    }

    $.get("../blog3/ajax/dp_leaderJson.php?BM=2", function (data) {
        data = data[0].rows;
        console.log(data);
        insertToTable(data, 0, 11, unfixedTableController1);
        insertToTable(data, 12, 30, unfixedTableController2);
        insertToTable(data, 31, 47, unfixedTableController3);
        insertToTable(data, 48, 63, unfixedTableController4);
        insertToTable(data, 64, 76, unfixedTableController5);
    }, "json");
});

