import * as G from "./include/Global";
import * as PopBox from "./component/PopBox";
import * as PKStage from "./PKStageField";
let curGroup = null;
export function getGroupID() {
    if(curGroup) {
        return curGroup.ID;
    }
    return null;
}
export function update() {
    if(curGroup) {
        setGroup(curGroup);
    }
}

export function setGroup(group) {
    let $items_l = $("#detail_container_left").find(".row div:last-child");
    let $container_right = $("#detail_container_right");
    let $items_r = $container_right.find(".row div:last-child div");
    let $problem_item = $container_right.find(".row:last-child div:last-child");
    //首先清空
    PKStage.clearJobChooser();
    $items_l.each(function () {
        $(this).find("span").text("");
    });
    $items_r.each(function () {
        $(this).text("");
    });
    $problem_item.empty();
    let $desc = $("#group_description");
    let $photo = $("#group_photo").find("img");
    $desc.text("");
    //设置名字、照片和描述
    curGroup = group;
    $("#group_name").text(group.name);
    if(group.ID<=21) {
        $photo.attr("src", G.STREET_PHOTO_ROOT + group.ID);
        $desc.text(group.desc);
    }
    else {
        $photo.attr("src", G.STREET_PHOTO_ROOT + "default");
    }
    //初始值
    for(let i=0 ; i<$items_l.length ; ++i) {
        $($items_l[i]).find("span.text-blue").text(group.origin_data[i]);
    }
    //修改后的值
    if(group.modify_times) {
        $($items_l[0]).find("span.text-green").text(" / " + group.getMemberNum());
        // $($items_l[1]).find("span.text-green").text("/" + group.getModifyDate());
        $($items_l[2]).find("span.text-green").text(" / " + group.geAverageAge());
        $($items_l[3]).find("span.text-green").text(" / " + group.getBackMemberNum());
        $($items_l[4]).find("span.text-green").text(" / " + group.getNonCPCNum());
        $($items_l[5]).find("span.text-green").text(" / " + group.getFemaleNum());
    }
    //右边的评价
    function setPopUpBox($node, label) {
        //问题标签点击显示来源
        $node.click(function (e) {
            let $content = $(`
                <div>
                    <div style="font-size: larger; color: #1a92d1; margin-bottom: 15px;">
                        <i class="fa fa-files-o" style="margin-right: 7px;"></i>
                        依据
                    </div>
                    <ul class='ref-list'/>
                </div>
            `);
            let ok = false;
            label.ref.forEach((r) => {
                if(r.sentence && r.source.fileName) {
                    $content.find("ul").append("<li/>").text(`${r.sentence} —— ${r.source.fileName}`);
                    ok = true;
                }
            });
            if(!ok) {
                $content.find("ul").replaceWith("<div>无材料</div>");
            }
            PopBox.show(e.pageX, e.pageY, $content);
            e.stopPropagation();
        })
    }

    $.get("http://localhost:5000/team", {id: group.ID}, function (data) {
        console.log(data);

        let indexes = ["一把手作用", "团队协作", "整体战斗力"];
        for(let i=0 ; i<indexes.length ; ++i) {
            let index = indexes[i];
            if(data[index]) {
                let $node = $($items_r[i]), label = data[index].labels[0];
                $node.text(label.name);
                $node.off("click");
                setPopUpBox($node, label);
            }
            else {
                $($items_r[i]).text("无材料");
            }
        }

        $problem_item.empty();
        if(data["存在问题"]) {
            data["存在问题"].labels.forEach((label) => {
                let $refItem = $("<div class='text-blue hover-white'/>").text(label.name).css({
                        "margin-bottom": "0.5rem"
                    });
                setPopUpBox($refItem, label);
                $($problem_item).append($refItem);
            });
        }
        else
            $($problem_item).append($("<div class='text-blue hover-white'/>").text("无材料"));
    }, "json");
}

