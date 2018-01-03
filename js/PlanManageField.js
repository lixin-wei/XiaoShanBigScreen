import * as G from "./include/Global";
import * as Data from "./DataController";
window.$ = window.jQuery = require("jquery");
jQuery.fn.getHTML = function(s) {
    return (s)
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};
let moment = require("moment");
import * as PopBox from "./component/PopBox";


let $plan_name_box = $("#plan_name");

export function setPlanName(text) {
    $plan_name_box.text("当前方案：" + text);
}

export function change() {
    setPlanName("*新方案（未保存）");
}
function openList() {
    let box_top = $plan_name_box.offset().top + $plan_name_box.outerHeight();
    let box_left = $plan_name_box.offset().left + $plan_name_box.outerWidth()/2;

    let $content = $(`
        <ul class="file-list">
        </ul>
    `);
    $.get("php/getPlanList.php", {}, function (data) {
        data.forEach((item) => {
            let $li = $("<li/>").text(`${item.name}(${item.date})`);
            //切换方案
            $li.click(function () {
                $.getJSON("php/getPlan.php", {ID: item.ID}, function (res) {
                    Data.switchPlan(res);
                    PopBox.remove();
                    setPlanName(item.name);
                });
            });
            $content.append($li);
        });
        PopBox.show(box_left, box_top, $content, {
            position: {x: "center", y: "bottom"},
            css: {"max-width": "800px"},
            showClose: false
        });
    }, "json");

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
$("#plan_save").click(function (e) {
    let $content = $(`
        <div>
            <p class="text-center">
                <label>方案名：<input class="input text-large" /></label>
            </p>
            <div class="text-center">
                <button class="btn blue">保存</button>
            </div>
        </div>
    `);
    $content.find("div button").click(function () {
        let planName = $content.find("p input").val();
        $.post("php/savePlan", {planName: planName, json: JSON.stringify(Data.curPlan)}, () => {
            PopBox.remove();
            setPlanName(planName);
        });
    });
    PopBox.show(e.pageX, e.pageY, $content, {
        position: {x: "center", y: "bottom"},
        css: {width: "330px"},
        showClose: false
    });
    e.stopPropagation();
});

$("#plan_diff").click(function (e) {
    let $content = $(`
        <div>
            <div class="text-center" style="margin: 5px 0">
                <button class="btn light-blue">在新窗口打开</button>            
            </div>
            <table>
                <tr>
                    <td colspan="9">
                        干部任免方案 -- ${moment().format("YYYY-MM-DD")}
                    </td>
                </tr>
                <tr>
                    <td>编号</td>
                    <td>姓名</td>
                    <td>性别</td>
                    <td>出生年月</td>
                    <td>学历</td>
                    <td>政治面貌</td>
                    <td>现任职务</td>
                    <td>拟任免（提议）职务</td>
                    <td>备注</td>
                </tr>
            </table>
        </div>
    `);
    let i=1;
    let transLog = Data.getPlanDiff();
    transLog.forEach((log) => {
        let birthday = log.who.birthday.format("YYYY-MM")
        if(!log.who.birthday.isValid()) birthday = "";
        let fromStr = "无", toStr ="无";
        if(log.$from) {
            fromStr = log.$from.data("positionName");
        }
        if(log.$to) {
            toStr = log.$to.data("positionName");
        }
        let $tr = $(`
            <tr>
                <td>${i++}</td>
                <td>${log.who.name}</td>
                <td>${log.who.sex}</td>
                <td>${birthday}</td>
                <td>${log.who.eduBkg}</td>
                <td>${log.who.politicalStatus}</td>
                <td>${fromStr}</td>
                <td>${toStr}</td>
                <td></td>
            </tr>
        `);
        $content.find("table").append($tr);
    });
    $content.find("div button").click(function () {
        let output = $content.find("table").getHTML();
        let OpenWindow = window.open("content.html", "mywin", '');
        OpenWindow.dataFromParent = output; // dataFromParent is a variable in child.html
        OpenWindow.onload = function () {
            OpenWindow.init();
        }
    });
    PopBox.show(e.pageX, e.pageY, $content, {
        position: {x: "center", y: "bottom"},
        css: {"max-width": "1200px"},
        showClose: false
    });
    e.stopPropagation();
});