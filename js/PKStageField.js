import * as G from "./include/Global";
import * as PopBox from "./component/PopBox";
import * as GroupBox from "./GroupBoxField";
import * as Helper from "./HelperFuncitions";
import * as BMCtl from "./BoxMovementController";
const index_list = ["工作业绩",  "个性特点",  "群众基础",  "分类考核",  "能力类型",  "专业特长",  "工作作风",  "适宜岗位", "不足和风险点"];
let $container = $("#foot_col4");

let leftPerson = null, rightPerson = null;
export function setPerson(person, dir) {
    let $photo_col = $container.find(`#photo_col_${dir}`);
    $photo_col.find(".photo img").attr("src", G.PERSON_PHOTO_ROOT + person.photo);
    $photo_col.find(".photo-col-name").text(person.name);
    $(`#person_detail_${dir}`).text(`${person.sex} ${person.birthday.format("YYYY-MM")} ${person.politicalStatus} ${person.eduBkg}`);
    let $items = $("#foot_col_mid_container").find(".item");
    $items.find(`.col-${dir}`).empty();
    clearJobChooser();
    if(dir === "left") leftPerson = person;
    else rightPerson = person;
    $.ajax({
        url: G.PERSON_INFO_API_URL,
        crossDomain: true,
        method: "GET",
        dataType: "json",
        data: {id: person.ID},
        success: function (res) {
            let items = $("#foot_col_mid_container").find(".item");
            for(let i=0 ; i<index_list.length ; ++i) {
                let $item = $(items[i]);
                let index = index_list[i];
                //设置指标名称，清空来源数据
                $item.find(".label").text(index_list[i]).data(`ref_${dir}`, null);
                //清空badge
                $item.find(`.col-${dir}`).empty();
                //如果有这个标签，填充指标标签
                if(res.hasOwnProperty(index)) {
                    let labels = res[index].labels;
                    //给指标附上来源的数据
                    $item.find(".label").data(`ref_${dir}`, labels);
                    //如果是不足和风险，截一些字显示
                    if(i === index_list.length - 1) {
                        //控制在3个以内
                        labels[0].ref.every((r, index) => {
                            let $badge = $("<span class='badge'/>");
                            $badge.text(Helper.clipString(r.sentence, 5));
                            $item.find(`.col-${dir}`).append($badge);
                            return index<3;
                        });
                    }
                    //否则生成一个个badge
                    else {
                        for(let j = 0 ; j<labels.length ; ++j){
                            let label = labels[j];
                            let $badge = $("<span class='badge'/>");
                            $badge.text(label.name);
                            $item.find(`.col-${dir}`).append($badge);
                        }
                    }
                }
            }
        }
    });
}
export function setLeft(person) {
    setPerson(person, "left");
}
export function setRight(person) {
    setPerson(person, "right");
}
export function clearLeft() {
    let $photo_col = $container.find("#photo_col_left");
    $photo_col.find(".photo img").attr("src", "");
    $photo_col.find(".photo-col-name").text("---");
    $("#person_detail_left").text("");
    let $items = $("#foot_col_mid_container").find(".item");
    $items.find(".col-left").empty();
    $items.find(".label").data("ref_left", null);
    clearJobChooser();
    leftPerson = null;
}
export function clearRight() {
    let $photo_col = $container.find("#photo_col_right");
    $photo_col.find(".photo img").attr("src", "");
    $photo_col.find(".photo-col-name").text("---");
    $("#person_detail_right").text("");
    let $items = $("#foot_col_mid_container").find(".item");
    $items.find(".col-right").empty();
    $items.find(".label").data("ref_right", null)
    clearJobChooser();
    rightPerson = null;
}

$("#foot_col_mid_container").find(".item .label").click(function (e) {
    let x = e.pageX;
    let y = e.pageY;
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
    PopBox.show(x, y, $content, {
        position: {x: "center", y: "top"}
    });
    e.stopPropagation();
});

let $job_chooser = $("#foot_col4_job");
export function clearBar() {
    $("#total_bar_left").find(".total-bar-thumb").css({width: `0%`}).text("");
    $("#total_bar_right").find(".total-bar-thumb").css({width: `0%`}).text("");
}
export function clearJobChooser() {
    clearBar();
    $job_chooser.text("选择岗位");
}
$job_chooser.click(function (e) {
    let x = $(this).offset().left + $(this).outerWidth()/2;
    let y = $(this).offset().top + $(this).outerHeight()/2;
    if(GroupBox.getGroupID() === null) {
        let $content = $("<div class='text-center' />").text("请先选择领导班子");
        PopBox.show(x, y, $content, {
            position: {x: "center", y: "middle"},
            css: {width: "300px"},
            showClose: false
        });
    }
    else if(!(leftPerson && rightPerson)) {
        let $content = $("<div class='text-center' />").text("请在左右各放置一人");
        PopBox.show(x, y, $content, {
            position: {x: "center", y: "middle"},
            css: {width: "300px"},
            showClose: false
        });
    }
    else {
        let $content = $("<ul class='file-list'/>");
        $.get("php/getJobList.php", {groupID: GroupBox.getGroupID()}, function (res) {
            res.forEach((job) => {
                let $li = $("<li/>").text(job.jobName);
                $li.click(function () {
                    $job_chooser.text(job.jobName);
                    PopBox.remove();
                    //获取左右两个人的分数
                    $.getJSON("http://localhost:5000/recmdScore", {teamID: GroupBox.getGroupID(), jobID: job.ID, personID: leftPerson.ID}, function (res) {
                        let scoreLeft = res['score'];
                        $.getJSON("http://localhost:5000/recmdScore", {teamID: GroupBox.getGroupID(), jobID: job.ID, personID: rightPerson.ID}, function (res) {
                            clearBar();
                            let scoreRight = res['score'];
                            //设置PK比分条
                            $("#total_bar_left").find(".total-bar-thumb").css({width: `${scoreLeft}%`}).text(`${scoreLeft}`);
                            $("#total_bar_right").find(".total-bar-thumb").css({width: `${scoreRight}%`}).text(`${scoreRight}`);
                        });
                    })
                });
                $content.append($li);
            });
            PopBox.show(x, y, $content, {
                position: {x: "center", y: "middle"},
                css: {width: "300px"},
                showClose: false
            });

        }, "json");
    }

    e.stopPropagation();
});


//PK台的相关事件
$container.find(".photo-col .photo")
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
                clearLeft();
            else
                clearRight();
        }
    });
let $stage_btn_left = $("#photo_col_left").find(".btn");
let $stage_btn_right = $("#photo_col_right").find(".btn");
//PK台的各种按钮
$($stage_btn_left[0]).on("mousedown click", function (e) {
    let $photo = $("#photo_col_left").find(".photo");
    let person = $photo.data("person");
    BMCtl.setPersonInfo(person);
    e.stopPropagation();
});
//离开PK台，左
$($stage_btn_left[1]).on("mousedown click", function (e) {
    let $photo = $("#photo_col_left").find(".photo");
    let person = $photo.data("person");
    if(person) {
        BMCtl.goToList(person.$box);
        clearLeft();
        $photo.data("person", null);
    }
    e.stopPropagation();
});
$($stage_btn_right[0]).on("mousedown click", function (e) {
    let $photo = $("#photo_col_right").find(".photo");
    let person = $photo.data("person");
    BMCtl.setPersonInfo(person);
    e.stopPropagation();
});
//离开PK台，右
$($stage_btn_right[1]).on("mousedown click", function (e) {
    let $photo = $("#photo_col_right").find(".photo");
    let person = $photo.data("person");
    if(person) {
        BMCtl.goToList(person.$box);
        clearRight();
        $photo.data("person", null);
    }
    e.stopPropagation();
});