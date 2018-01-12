import * as G from "./include/Global";
import * as Data from "./DataController";
import * as Loading from "./Loadind";
import * as LineLayer from "./LineLayer";
import {ConfirmBox} from "./component/ConfirmBox";
window.$ = window.jQuery = require("jquery");
jQuery.fn.getHTML = function(s) {
    return (s)
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};
let moment = require("moment");
import * as PopBox from "./component/PopBox";

const CONFIRM_TEXT = "方案尚未保存，是否继续？";
let $plan_name_box = $("#plan_name");
let curPlanName = null, curPlanID = null, hasChanged = false;
let isBlocking = false; //当确认框弹出时设成true，防止重复弹出


//禁用和解禁所有按钮
function blockButtons() {
    isBlocking = true;
    $("#head_right_button_group").find("button").attr("disabled", "true");
}

function unblockButtons() {
    isBlocking = false;
    $("#head_right_button_group").find("button").removeAttr("disabled");
}
export function setPlanName(text) {
    $plan_name_box.text("当前方案：" + text);
}

//每次修改就调用
export function notifyChange() {
    hasChanged = true;
    //如果在默认方案上修改，是一个新方案
    if (curPlanName === null) {
        setPlanName("*新方案(未保存)");
    }
    else { //否则是更改一个现有方案S
        setPlanName(`*${curPlanName}(修改未保存)`);
    }
}

function openList() {
    if(isBlocking)return;
    let box_top = $plan_name_box.offset().top + $plan_name_box.outerHeight();
    let box_left = $plan_name_box.offset().left + $plan_name_box.outerWidth()/2;

    let $content = $(`
        <div>
            <button class="btn green block text-large">还原到现任方案</button>
            <hr>
            <ul class="file-list">
            </ul>        
        </div>
    `);
    $content.find("button").click(function (e) {
        function okEvent() {
            curPlanID = null;
            Data.setToDefaultPlan();
        }

        PopBox.remove();
        if(hasChanged) {
            blockButtons();
            new ConfirmBox(e.pageX, e.pageY, CONFIRM_TEXT, function () {
                okEvent();
                unblockButtons();
            }, function () {
                unblockButtons();
            });
        }
        else {
            okEvent();
        }
    });
    $.get("php/getPlanList.php", {}, function (data) {
        data.forEach((item) => {
            let $li = $("<li/>").html(`${item.name} <span class="text-grey text-mid">(${item.date})</span>`);
            //切换方案
            $li.click(function (e) {
                function okEvent() {
                    $.getJSON("php/getPlan.php", {ID: item.ID}, function (res) {
                        Data.switchPlan(res);
                        setPlanName(item.name);
                        curPlanName = item.name;
                        curPlanID = item.ID;
                        hasChanged = false;
                    });
                }
                
                PopBox.remove();
                if(hasChanged) {
                    blockButtons();
                    new ConfirmBox(e.pageX, e.pageY, CONFIRM_TEXT, function () {
                        okEvent();
                        unblockButtons();
                    }, function () {
                        unblockButtons();
                    });
                }
                else {
                    okEvent();
                }
            });
            $content.find("ul").append($li);
        });
        if(data.length === 0) {
            $content.find("ul").text("暂无方案");
        }
        PopBox.show(box_left, box_top, $content, {
            position: {x: "center", y: "bottom"},
            css: {"max-width": "800px", "min-width": "300px"},
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

function openSaveAsBox(e) {
    if(!isBlocking) {
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
            $.post("php/savePlan", {planName: planName, json: JSON.stringify(Data.curPlan)}, (insertID) => {
                PopBox.remove();
                setPlanName(planName);
                curPlanName = planName;
                curPlanID = parseInt(insertID);
                hasChanged = false;
            });
        });
        PopBox.show(e.pageX, e.pageY, $content, {
            position: {x: "center", y: "bottom"},
            css: {width: "330px"},
            showClose: false
        });
    }
}

$("#plan_save").click(function (e) {
    if (curPlanID !== null) {
        $.post("php/updatePlan", {planID: curPlanID, json: JSON.stringify(Data.curPlan)}, () => {
            PopBox.remove();
            setPlanName(curPlanName);
            hasChanged = false;
        });
    }
    else {
        openSaveAsBox(e);
    }
    e.stopPropagation();
});

$("#plan_save_as").click(function (e) {
    openSaveAsBox(e);
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
    if (transLog.length === 0) {
        $content = $(`<div class="text-large text-center">暂无调动记录</div>`);
    }
    $content.find("div button").click(function () {
        let output = $content.find("table").getHTML();
        let newWindow = window.open();
        let styleSheet = "<style>table td {border: 1px solid black; text-align: center;}</style>"
        newWindow.document.write(styleSheet + output);
    });
    PopBox.show(e.pageX, e.pageY, $content, {
        position: {x: "center", y: "bottom"},
        css: {"max-width": "1200px", "min-width": "600px"},
        showClose: false
    });
    e.stopPropagation();
});

$("#plan_apply").click(function (e) {
    if(!isBlocking) {
        blockButtons();
        new ConfirmBox(e.pageX, e.pageY + 100, "此操作是修改性操作，将会修改数据库中的现任方案，无法撤销。<br/>应用以后，所有的调度线、任免方案，都会以这份计划为基准来重新计算，是否继续？", function () {
            Loading.setInfo("写入数据中");
            Loading.show();
            LineLayer.hide();
            $.post("php/applyPlan.php", {plan: JSON.stringify(Data.curPlan)}, function (res) {
                if(res["result"]) {
                    Loading.setInfo("更新成功");
                    setTimeout(() => {
                        hasChanged = false;
                        curPlanID = null;
                        Data.setToDefaultPlan();
                    }, 700);
                }
                else {
                    Loading.setInfo("更新失败");
                    setTimeout(() => {
                        LineLayer.show();
                        Loading.hide();
                    }, 700);
                }
            }, "json");
            unblockButtons();
        }, function () {
            unblockButtons();
        });
    }
    e.stopPropagation();
});
