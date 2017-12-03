import * as G from "./include/Global";

window.$ = window.jQuery = require("jquery");
import * as PopBox from "./component/PopBox";


let $plan_name_box = $("#plan_name");

function openList() {
    let box_top = $plan_name_box.offset().top + $plan_name_box.outerHeight();
    let box_left = $plan_name_box.offset().left + $plan_name_box.outerWidth()/2;

    let $content = $(`
        <ul class="file-list">
        </ul>
    `);
    $.get("php/getPlanList.php", {}, function (data) {
        data.forEach((item) => {
            $content.append($("<li/>").text(`${item.name}(${item.date})`));
        });
        $content.find("li").mousemove(function () {
            $(this).addClass("active");
        }).mouseout(function () {
            $(this).removeClass("active");
        });
        PopBox.show(box_left, box_top, $content, {
            position: {x: "center", y: "bottom"},
            css: {"max-width": "540px"},
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
            <p>
                <label>方案名：<input /></label>
            </p>
            <div class="text-center">
                <button class="btn blue">保存</button>
            </div>
        </div>
    `);
    $content.find("div button").click(function () {
        let planName = $content.find("p input").val();
        $.post("php/savePlan", {planName: planName, json: JSON.stringify(G.planMap)}, () => {
            PopBox.remove();
        });
    });
    PopBox.show(e.pageX, e.pageY, $content, {
        position: {x: "center", y: "bottom"},
        css: {width: "240px"},
        showClose: false
    });
    e.stopPropagation();
});

$("#plan_diff").click(function (e) {
    let $content = $(`
        <table>
            <tr>
                <td colspan="8">干部任免方案</td>
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
            </tr>
        </table>
    `);
    let i=1;
    G.transLog.forEach((log) => {
        let $tr = $(`
            <tr>
                <td>${i++}</td>
                <td>${log.who.name}</td>
                <td>${log.who.sex}</td>
                <td>${log.who.birthday.format("YYYY-MM")}</td>
                <td>${log.who.eduBkg}</td>
                <td>${log.who.politicalStatus}</td>
                <td>${log.from}</td>
                <td>${log.to}</td>
            </tr>
        `);
        $content.append($tr);
    });
    PopBox.show(e.pageX, e.pageY, $content, {
        position: {x: "left", y: "bottom"},
        css: {"max-width": "1200px"},
        showClose: false
    });
    e.stopPropagation();
});