import * as G from "./Statics";
export class GroupBoxController {
    constructor() {
        this.$node = $("#foot_col2");
        this.group = null;
    }
    update() {
        if(this.group) {
            this.setGroup(this.group);
        }
    }
    setGroup(group) {
        this.group = group;
        $("#group_name").text(group.name);
        //设置照片和描述
        if(group.id<=21) {
            $("#group_photo").find("img").attr("src", G.STREET_PHOTO_ROOT + group.id)
            $("#group_description").text(group.desc);
        }
        else {
            $("#group_photo").find("img").attr("src", G.STREET_PHOTO_ROOT + "default");
        }

        let $items = $("#detail_container_left").find(".row");
        //首先清空
        for(let i=0 ; i<$items.length ; ++i) {
            $($items[i]).find("div:last-child span.text-blue").text("");
            $($items[i]).find("div:last-child span.text-green").text("");
        }
        //初始值
        for(let i=0 ; i<$items.length ; ++i) {
            $($items[i]).find("div:last-child span.text-blue").text(group.origin_data[i]);
        }
        //修改后的值
        if(group.modify_times) {
            $($items[0]).find("div:last-child span.text-green").text(" / " + group.getMemberNum());
            // $($items[1]).find("div:last-child span.text-green").text("/" + group.getModifyDate());
            $($items[2]).find("div:last-child span.text-green").text(" / " + group.getModifyTimes());
            $($items[3]).find("div:last-child span.text-green").text(" / " + group.getEverageAge());
            $($items[4]).find("div:last-child span.text-green").text(" / " + group.getBackMemberNum());
            $($items[5]).find("div:last-child span.text-green").text(" / " + group.getNonCPCNum());
            $($items[6]).find("div:last-child span.text-green").text(" / " + group.getFemaleNum());
        }
    }
}