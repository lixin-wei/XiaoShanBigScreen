import * as G from "./include/Global";
import * as GroupBox from "./GroupBoxField";
import * as PopBox from "./component/PopBox";
import * as LineLayer from "./LineLayer";
import * as Helper from "./HelperFuncitions";
import * as PKStage from "./PKStageField";
import * as Data from "./DataController";
import * as Plan from "./PlanManageField";
import {Person} from "./class/Person";


/** info-box拖动 **/
let click_x = 0, click_y = 0;
let clickPageX = 0, clickPageY = 0;
let isMouseDown = false;
export let isTrackingMouse = false; //是否随鼠标移动，主要给goToList用，防止动画中途被鼠标拖走了
export function setIsTrackingMouse(val) {
    isTrackingMouse = val;
}
let $intendCell = null; //用户点下去的那个cell，打算想拖
const BOX_HEIGHT = 150;
const BOX_WIDTH = 600;
const TRASH_X = G.$box_list.offset().left;
const TRASH_Y = G.$box_list.offset().top;
let $boxTrash = $("#mid_col3_box_trash");
function isIntentToDragFrom(x, y) {
    return Helper.MhtDis(x, y, clickPageX, clickPageY) > 4;
}
//box list的动画控制函数
export function focusOn($ele) {
    $(".cell, .info-box").removeClass("active");
    if($ele) {
        $ele.addClass("active");
    }
}
export function setPersonInfo(person) {
    console.log(`person_id = ${person.ID}`);
    G.setShowingPersonID(person.ID);
    G.$person_info_container.find(".photo img").attr("src", G.PERSON_PHOTO_ROOT + person.photo);
    G.$person_info_container.find(".name").text(person.name);
    G.$person_info_container.find(".info1").text(person.getInfo());
    G.$person_info_container.find(".info2").text(person.job);

    //先隐藏所有标签
    G.$de_tree_label_list.add(G.$cai_tree_label_list).add(G.$lack_label).add(G.$achievement_label)
        .css({"transform" : "scale(0)"}).data("vis", false);
    $.ajax({
        url: G.PYTHON_SERVER_ROOT + "summary",
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
                        let i = Helper.getRandomInt(0, G.$de_tree_label_list.length - 1);
                        while(vis_a[i]) i = Helper.getRandomInt(0, G.$de_tree_label_list.length - 1);

                        $(G.$de_tree_label_list[i]).css({"transform": "scale(1)"}).data("vis", true).data("ref", label.ref);
                        $(G.$de_tree_label_list[i]).find("div").text(label.name.substr(0, 4));
                        x++;
                    }
                });
                OrangeLabels.forEach((label) => {
                    if(y < G.$cai_tree_label_list.length) {
                        let i = Helper.getRandomInt(0, G.$cai_tree_label_list.length - 1);
                        while(vis_b[i]) i = Helper.getRandomInt(0, G.$cai_tree_label_list.length - 1);
                        //设置成橙色
                        $(G.$cai_tree_label_list[i]).attr("class", "tree-label orange");
                        $(G.$cai_tree_label_list[i]).css({"transform": "scale(1)"}).data("vis", true).data("ref", label.ref);
                        $(G.$cai_tree_label_list[i]).find("div").text(label.name.substr(0, 4));
                        y++;
                    }
                });
                CAILabels.forEach((label) => {
                    if(y < G.$cai_tree_label_list.length) {
                        let i = Helper.getRandomInt(0, G.$cai_tree_label_list.length - 1);
                        while(vis_b[i]) i = Helper.getRandomInt(0, G.$cai_tree_label_list.length - 1);
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

                if(res["工作业绩"] && res["工作业绩"].labels.length) {
                    let list = res["工作业绩"].labels[0].ref;
                    let sentence_list = [];
                    list.forEach((ref) => {
                        sentence_list.push({str: ref.sentence, source: ref.source.fileName});
                    });
                    G.$achievement_label.data("ref", sentence_list);
                    G.$achievement_label.css({"transform": "scale(1)"}).data("vis", true);
                }

            }, 500);
        }
    });
}
export function allDown(mul = 1) {
    //list里原来的项目下移
    G.$box_list.find(".info-box").each(function () {
        $(this).animate({
            top: "+=" + BOX_HEIGHT*mul
        });
    });
}
export function allNextUp($box) {
    //list里在这个box之下的项目上移
    $box.nextAll().each(function () {
        $(this).animate({
            top: "-=" + BOX_HEIGHT
        });
    });
}
export function goToList($box, callback = ()=>{}) {
    $box.show();
    allDown();
    $box.animate({ //回到备选区位置
        top: TRASH_Y - $(window).scrollTop(),
        left: TRASH_X - $(window).scrollLeft(),
    }, function () { //放回容器内
        $box.css({
            top: 0,
            left: 0,
        });
        $box.removeClass("float");
        $box.prependTo(G.$box_list);
        callback();
    });
}

export function goToListWithoutAllDown($box, offset = 0) {
    $box.show();
    // allDown();
    $box.animate({ //回到备选区位置
        top: TRASH_Y - $(window).scrollTop() + BOX_HEIGHT * offset,
        left: TRASH_X - $(window).scrollLeft(),
    },function () { //放回容器内
        $box.css({
            top: BOX_HEIGHT * offset,
            left: 0,
        });
        $box.removeClass("float");
        $box.appendTo(G.$box_list);
    });
}

export function goOut($box) {
    let person = $box.data("person_obj");
    let $cellFrom = $box.data("cell_from");
    allNextUp($box);
    //如果是从格子里拖过来的，且原来位置没人，让他回去
    if($cellFrom && $cellFrom.data("person") === null) {
        //移除相对布局，要加上原来的top
        let originTop = parseInt($box.css("top").slice(0, -2));
        $box.addClass("float").css({
            left: TRASH_X - $(window).scrollLeft(),
            top: TRASH_Y - $(window).scrollTop() + originTop
        }).appendTo($boxTrash);
        //然后移回格子去
        $box.animate({
            left: Helper.getNodeCenter($cellFrom).x - $(window).scrollLeft(),
            top: Helper.getNodeCenter($cellFrom).y - $(window).scrollTop()
        }, function () {
            $cellFrom.data("person", person);
            $cellFrom.text(person.name);
            $box.hide();
        });
    }
    //否则直接删掉
    else {
        $box.animate({
            left: `+=${BOX_WIDTH}`
        }, function () {
            $box.remove();
        });
    }
}
//info box 相关事件响应
export function onMouseMoveInfoBox(e) { //InfoBox的拖出事件

    //加了个move时的位置判断，防止误触
    if(isMouseDown && !G.getFloatingPerson() && isIntentToDragFrom(e.pageX, e.pageY)) {
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
            isTrackingMouse = true;
            click_x = e.pageX - $(this).offset().left;
            click_y = e.pageY - $(this).offset().top;
            allNextUp($(this));
            $(this).appendTo(G.$box_trash);
        }
    }
}
export function onClickInfoBox() { //InfoBox的点击事件
    console.log("click");
    focusOn($(this));
    setPersonInfo($(this).data("person_obj"));
}

//cell 的相关事件响应
export function onMouseEnterCell() {
    G.setActiveCell($(this));
}
export function onMouseLeaveCell() {
    G.setActiveCell(null);
}
export function onMouseMoveCell(e) { //cell中的box拖出事件

}
export function onRightClickCell(e) {
    if(!$(this).data("person")) {
        $(this).removeClass("changed");
    }
    return false;
}
export function onClickCell() {
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
export function onMouseDownCell() {
    $intendCell = $(this);
}

//全局事件
$(window).contextmenu(function () {
    return false;
});
$(window).on("mouseup", function (e) {
    if(G.getFloatingPerson() && isTrackingMouse) {
        Plan.change();
        //如果当前鼠标下有cell，则填充
        if(G.getActiveCell()) {
            //如果是挤占式的，floatingPerson的清空要在动画完成后，hasGone用以标记
            let hasGone = false;
            if(G.getActiveCell().data("person")) { //如果当前cell已经有内容了
                //修改group
                G.getActiveCell().data("group").removeMember(G.getActiveCell().data("person").ID);
                GroupBox.update();
                //让这个box回备选区去
                hasGone = true;
                if(G.getActiveCell().hasClass("active")) {
                    focusOn(null);
                }
                G.getActiveCell().data("person").$box.css({
                    top: e.pageY - $(window).scrollTop(),
                    left: e.pageX - $(window).scrollLeft()
                });
                goToList(G.getActiveCell().data("person").$box, function () {
                    G.setFloatingPerson(null);
                });
                G.getActiveCell().data("person", null);
            }
            let $from = G.getFloatingPerson().$box.data("cell_from");
            let $to = G.getActiveCell();
            //去除已有的变动线
            if(G.getFloatingPerson().lineID !== undefined) {
                LineLayer.removeLine(G.getFloatingPerson().lineID);
            }
            //设置高亮
            if($from)$from.addClass("changed");
            if($to)$to.addClass("changed");
            if($from && $to && !$to.is($from)) {
                //加变动线
                G.getFloatingPerson().lineID = LineLayer.addLine(Helper.getNodeCenter($from), Helper.getNodeCenter($to));
            }
            //更新plan，设置当前格子的，原格子的null在拖出来的时候设置
            Data.updatePlan($to.data("group").ID, $to.data("jobID"), G.getFloatingPerson().ID);
            //设置姓名
            G.getActiveCell().text(Helper.clipString(G.getFloatingPerson().name, 3));
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
            if(!hasGone) {
                G.setFloatingPerson(null);
            }
        }
        //如果是拖到PK台
        else if(G.getActiveStage()) {
            let hasGone = false;
            //如果当前pk位已经有人了
            if(G.getActiveStage().data("person")) {
                //让这个box回备选区去
                hasGone = true;
                goToList(G.getActiveStage().data("person").$box, function () {
                    G.setFloatingPerson(null);
                });
                G.getActiveStage().data("person", null);
            }
            G.getFloatingPerson().$box.hide();
            G.getActiveStage().data("person", G.getFloatingPerson());
            if(G.getActiveStage().parent().attr("id") === "photo_col_left")
                PKStage.setLeft(G.getFloatingPerson());
            else
                PKStage.setRight(G.getFloatingPerson());
            if(!hasGone) {
                G.setFloatingPerson(null);
            }
            isTrackingMouse = false;

        }
        else { //否则让box回trash去
            let fltPerson = G.getFloatingPerson();
            goToList(fltPerson.$box, function () {
                G.setFloatingPerson(null);
            });
            let $cellFrom = fltPerson.$box.data("cell_from");
            if($cellFrom) {
                $cellFrom.addClass("changed");
                let group = $cellFrom.data("group");
                group.removeMember(fltPerson.ID);
            }
            GroupBox.update();
        }
    }
});
$(window).on("mousedown", function (e) {
    // console.log("mouse down");
    isMouseDown = true;
    clickPageX = e.pageX;
    clickPageY = e.pageY;
});
$(window).on("mouseup", function () {
    isMouseDown = false;
    isTrackingMouse = false;
    $intendCell = null;
});
$(window).on("mousemove", function (e) {

    //box跟随鼠标移动
    if (G.getFloatingPerson() && isTrackingMouse) {
        // console.log("box move");
        G.getFloatingPerson().$box.css({
            top: e.pageY - $(window).scrollTop() - click_y,
            left: e.pageX - $(window).scrollLeft() - click_x
        });
    }

    //从cell拽出box
    // console.log(`intendCell: ${$intendCell !== null}, floatingPerson: ${!G.getFloatingPerson()}, inIntend: ${isIntentToDragFrom(e.pageX, e.pageY)}`);
    /* 如果是拖出且当前格子有内容 */
    if($intendCell && !G.getFloatingPerson() && $intendCell.data("person") && isIntentToDragFrom(e.pageX, e.pageY)) {
        Plan.change();

        let person = $intendCell.data("person");
        let group = $intendCell.data("group");
        //修改plan
        Data.updatePlan(group.ID, $intendCell.data("jobID"), null);
        //拿出这个box并显示
        G.setFloatingPerson(person);
        $intendCell.data("person", null);
        isTrackingMouse = true;
        //清空格子
        $intendCell.text(G.CELL_EMPTY_ALPHA).removeClass("important");
        person.$box.show();
        //修改group
        group.removeMember(person.ID);
        GroupBox.update();
        //记录下从哪个格子拖出来的，高亮用
        // G.getFloatingPerson().$box.data("cell_from", $intendCell);
    }
});


//事件统一注册函数
export function initCell($cell) {
    $cell.click(onClickCell)
        .mousemove(onMouseMoveCell)
        .mouseleave(onMouseLeaveCell)
        .mouseenter(onMouseEnterCell)
        .contextmenu(onRightClickCell)
        .mousedown(onMouseDownCell);
}
export function initBox($box, $bind_cell = null, offset = 0) {
    $box.mousemove(onMouseMoveInfoBox)
        .click(onClickInfoBox);
    $box.find(".close").click(function (e) {
        // console.log("close clicked");
        goOut($box);
        e.stopPropagation();
    });
    //先隐藏并丢到trash里
    $box.hide().addClass("float");
    G.$box_trash.append($box);
    //设置初始位置与备选框平齐，以便有水平插入的动画效果
    $box.css({
        top: TRASH_Y - $(window).scrollTop() + $box.outerHeight() * offset,
        left: TRASH_X - $(window).scrollLeft() + $box.outerWidth() + 10,
    });
    if($bind_cell) {
        $box.data("cell_from", $bind_cell);
    }
}

export function addNewPerson(ID, score = null) {
    $.post("php/getPersonInfo.php", {IDList: [ID]}, function (map) {
        PopBox.remove();
        let data = map[ID];
        data['job'] = `${data['groupName'] || ""} ${data['jobName'] || ""}`;
        let p = new Person(data);
        if(score) {
            p.setScore(score);
        }
        initBox(p.$box);
        goToList(p.$box);
    }, "json");
}

/*
* [{
*   ID: xx,
*   score: xx
* }]
* */
export function addAGroupOfPersons(PersonList) {
    let IDList = [];
    PersonList.forEach((p) => {
        IDList.push(p.id);
    });
    $.post("php/getPersonInfo.php", {IDList: IDList}, function (map) {
        let i = 0;
        allDown(PersonList.length);
        PersonList.forEach((item) => {
            PopBox.remove();
            let data = map[item.id];
            data['job'] = `${data['groupName'] || ""} ${data['jobName'] || ""}`;
            let p = new Person(map[item.id]);
            if(item.score) {
                p.setScore(item.score);
            }
            initBox(p.$box, null, i);
            goToListWithoutAllDown(p.$box, i);
            i++;
        });
    }, "json");
}