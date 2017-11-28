import * as G from "./include/Global";
import * as PopBox from "./component/PopBox";

G.$de_tree_label_list.add(G.$cai_tree_label_list).click(function (e) {
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
        PopBox.show(x, y, $content);
    }
    e.stopPropagation();
});
G.$lack_label.click(function (e) {
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
        PopBox.show(x, y, $content);
    }
    e.stopPropagation();
});
$("#btn_colleague").click(function (e) {
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
    $.get("php/getColleague.php", {id: G.showing_person_id}, function (res) {
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
        PopBox.show(x, y, $content, "right",{"max-width": "1550px"});
    }, "json");
    e.stopPropagation();
});
$("#btn_family_net").click(function (e) {
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
    $.get("php/getFamilyNet.php", {id: G.showing_person_id}, function (res) {
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
        PopBox.show(x, y, $content);
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
    $.get("php/getAbroadInfo.php", {id: G.showing_person_id}, function (res) {
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