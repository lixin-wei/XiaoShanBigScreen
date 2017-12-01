import * as G from "./include/Global";
import * as PopBox from "./component/PopBox";
let curGroup = null;
export function getGroupID() {
    if(curGroup){
        return curGroup.id;
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
    let $items_r = $("#detail_container_right").find(".row div:last-child span");
    //首先清空
    $items_l.each(function () {
        $(this).find("span").text("");
    });
    $items_r.each(function () {
        $(this).text("");
    });
    let $desc = $("#group_description");
    let $photo = $("#group_photo").find("img");
    $desc.text("");
    //设置名字、照片和描述
    curGroup = group;
    $("#group_name").text(group.name);
    if(group.id<=21) {
        $photo.attr("src", G.STREET_PHOTO_ROOT + group.id);
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
        // $($items[1]).find("div:last-child span.text-green").text("/" + group.getModifyDate());
        $($items_l[2]).find("span.text-green").text(" / " + group.getModifyTimes());
        $($items_l[3]).find("span.text-green").text(" / " + group.geAverageAge());
        $($items_l[4]).find("span.text-green").text(" / " + group.getBackMemberNum());
        $($items_l[5]).find("span.text-green").text(" / " + group.getNonCPCNum());
        $($items_l[6]).find("span.text-green").text(" / " + group.getFemaleNum());
    }
    //右边的评价
    $.post("http://localhost:5000/team", {teamID: group.id}, function (data) {
        console.log(data);

        if(data["一把手作用"])
            $($items_r[0]).text(data["一把手作用"].labels[0].name);
        else
            $($items_r[0]).text("无材料");

        if(data["团队协作"])
            $($items_r[1]).text(data["团队协作"].labels[0].name);
        else
            $($items_r[1]).text("无材料");

        if(data["整体战斗力"])
            $($items_r[2]).text(data["整体战斗力"].labels[0].name);
        else
            $($items_r[2]).text("无材料");

        if(data["存在问题"]) {
            data["存在问题"].labels.forEach((label) => {
                $($items_r[3]).append(
                    $("<div class='text-blue'/>")
                        .text(label.name)
                        // .data("ref", label.ref)
                        //问题标签点击显示来源
                        .click(function (e) {
                            let $content = $("<ul class='ref-list'/>");
                            label.ref.forEach((r) => {
                                $content.append("<li/>").text(r.source.fileName);
                            });
                            PopBox.show(e.pageX, e.pageY, $content);
                            e.stopPropagation();
                        })
                );
            });
        }
        else
            $($items_r[3]).text("无材料");
    }, "json");
}

