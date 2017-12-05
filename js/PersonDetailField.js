import * as G from "./include/Global";
import * as PopBox from "./component/PopBox";
let moment = require("moment");
G.$de_tree_label_list.add(G.$cai_tree_label_list).click(function (e) {
    if($(this).data("vis")) {
        let x = e.pageX;
        let y = e.pageY;
        let ref = $(this).data("ref");
        let $content = $($.parseHTML(`
        <div>
            <div style="font-size:larger ;color: #1a92d1; margin-bottom: 15px;">
                <i class="fa fa-files-o" style="margin-right: 7px;"></i>
                共${ref.length}条记录支持
            </div>
            <ul class="ref-list">
            </ul>
        </div>
        `));
        ref.forEach((r) => {
            let $li = $("<li />").text(`${r.sentence} —— 《${r.source.fileName}》`);
            $content.find("ul").append($li);
        });
        PopBox.show(x, y, $content);
    }
    e.stopPropagation();
});
G.$lack_label.click(function (e) {
    if($(this).data("vis")) {
        let x = e.pageX;
        let y = e.pageY;
        let ref = $(this).data("ref");
        let $content = $($.parseHTML(`
        <div>
            <div style="font-size:larger ;color: #1a92d1; margin-bottom: 15px;">
                <i class="fa fa-files-o" style="margin-right: 7px;"></i>
                共${ref.length}条记录支持
            </div>
            <ul class="ref-list">
            </ul>
        </div>
        `));
        ref.forEach((r) => {
            let $li = $("<li />").text(`${r.str} —— 《${r.source}》`);
            $content.find("ul").append($li);
        });
        PopBox.show(x, y, $content);
    }
    e.stopPropagation();
});

$("#btn_colleague").click(function (e) {
    let x = e.pageX;
    let y = e.pageY;
    let $content = $($.parseHTML(`
    <div>
        <div style="font-size: larger; color: #1a92d1; margin-bottom: 15px;">
            <i class="fa fa-files-o" style="margin-right: 7px;"></i>
            历届同事
        </div>
        <table style="line-height: 2.5rem;">
        </table>
    </div>
    `));
    $.get("php/getColleague.php", {ID: G.getShowingPersonID()}, function (res) {
        for(let i=0 ; i<res.length ; ++i) {
            let data = res[i];
            let colleagues = "";
            for(let j=0 ; j<res[i].colleagues.length ; ++j) {
                let p = res[i].colleagues[j];
                if(j) colleagues += ", ";
                let jobStr = p.jobs.join("、");
                colleagues += `<span class="badge white">${p.name}[${jobStr}]</span>`
            }
            let begin_time = data['begin_time'] || "未知";
            let end_time = data['end_time'] || "至今";
            let $tr = $(`
                <tr>
                    <td style="min-width: 250px;"><span class="nowrap">${begin_time}</span> -> <span class="nowrap">${end_time}</span></td>
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
        PopBox.show(x, y, $content, {
            position: {x: "right", y: "top"},
            css: {"max-width": "1550px"}
        });
    }, "json");
    e.stopPropagation();
});
$("#btn_family_net").click(function (e) {
    let x = e.pageX;
    let y = e.pageY;
    let $content = $($.parseHTML(`
    <div>
        <div style="font-size: larger; color: #1a92d1; margin-bottom: 15px;">
            <i class="fa fa-files-o" style="margin-right: 7px;"></i>
            亲属网
        </div>
        <table>
            <tr>
                <td>称谓</td><td>姓名</td><td>现任职务</td>
            </tr>
        </table>
    </div>
    `));
    $.get("php/getFamilyNet.php", {ID: G.getShowingPersonID()}, function (res) {
        for(let i=0 ; i<res.length ; ++i) {
            let data = res[i];
            let $tr = $(`
                <tr>
                    <td>${data[0]}</td>
                    <td>${data[1]}</td>
                    <td>${data[2]}</td>
                </tr>
            `);
            $content.find("table").append($tr);
        }
        if(res.length === 0) {
            $content.find("table").remove();
            $content.append($("<div/>").text("无信息"));
        }
        PopBox.show(x, y, $content);
    }, "json");
    e.stopPropagation();
});
$("#btn_abroad").click(function (e) {
    let x = e.pageX;
    let y = e.pageY;
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
    $.get("php/getAbroadInfo.php", {ID: G.getShowingPersonID()}, function (res) {
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
        PopBox.show(x, y, $content);
    }, "json");
    e.stopPropagation();
});

$("#btn_house_info").click(function (e) {
    let x = e.pageX;
    let y = e.pageY;
    let $content = $($.parseHTML(`
    <div>
        <div style="font-size: larger; color: #1a92d1; margin-bottom: 15px;">
            <i class="fa fa-files-o" style="margin-right: 7px;"></i>
            房产情况
        </div>
        <table>
            <tr>
                <td>序号</td><td>地址</td><td>类别</td><td>面积(平方米)</td><td>交易价格(万元)</td><td>交易时间</td>
            </tr>
        </table>
    </div>
    `));
    $.get("php/getHouseInfo.php", {ID: G.getShowingPersonID()}, function (res) {
        for(let i=0 ; i<res['house'].length ; ++i) {
            let data = res['house'][i];
            let $tr = $(`
                <tr>
                    <td>${i+1}</td>
                    <td>${data['address'] || "-"}</td>
                    <td>${data['type'] || "-"}</td>
                    <td>${data['area'] || "-"}</td>
                    <td>${data['price'] || "-"}</td>
                    <td class="nowrap">${data['time'] || "-"}</td>
                </tr>
            `);
            $content.find("table").append($tr);
        }
        for(let i=0 ; i<res['garage'].length ; ++i) {
            let data = res['garage'][i];
            let $tr = $(`
                <tr>
                    <td>*</td>
                    <td>${data['address'] || "-"}</td>
                    <td>${data['type'] || "-"}</td>
                    <td>${data['area'] || "-"}</td>
                    <td>${data['price'] || "-"}</td>
                    <td class="nowrap">${data['time'] || "-"}</td>
                </tr>
            `);
            $content.find("table").append($tr);
        }
        if(res['house'].length === 0 && res['garage'].length === 0) {
            $content.find("table").remove();
            $content.append($("<div/>").text("无信息"));
        }
        PopBox.show(x, y, $content, {
            position: {x: "right", y: "top"},
            css: {
                "max-width" : "1000px"
            }
        });
    }, "json");
    e.stopPropagation();
});