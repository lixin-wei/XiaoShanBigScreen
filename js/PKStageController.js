import * as G from "./Statics";
const index_list = ["工作业绩",  "个性特点",  "群众基础",  "分类考核",  "不足与风险",  "能力类型",  "专业特长",  "工作作风",  "适宜岗位"];
export class PKStageController {
    constructor() {
        this.$container = $("#foot_col4");
    }
    setPerson(person, dir) {
        let $photo_col = this.$container.find(`#photo_col_${dir}`);
        $photo_col.find(".photo img").attr("src", G.PERSON_PHOTO_ROOT + person.photo);
        $photo_col.find(".photo-col-name").text(person.name);
        $(`#person_detail_${dir}`).text(`${person.sex} ${person.birthday} ${person.politicalStatus} ${person.eduBkg}`);
        let $items = $("#foot_col_mid_container").find(".item");
        $items.find(`.col-${dir}`).empty();
        $.ajax({
            url: G.PERSON_INFO_API_URL,
            crossDomain: true,
            dataType: "json",
            data: {id: person.ID},
            success: function (res) {
                let items = $("#foot_col_mid_container").find(".item");
                for(let i=0 ; i<index_list.length ; ++i) {
                    let $item = $(items[i]);
                    let index = index_list[i];
                    //设置指标名称
                    $item.find(".label").text(index_list[i]);
                    if(res.hasOwnProperty(index)) {
                        let labels = res[index].labels;
                        //填充指标标签
                        for(let j = 0 ; j<labels.length ; ++j){
                            let label = labels[j];
                            let $badge = $("<span class='badge'/>");
                            $badge.text(label.name);
                            $item.find(`.col-${dir}`).append($badge);
                        }
                    }
                }
            }
        });
    }
    setLeft(person) {
        this.setPerson(person, "left");
    }
    setRight(person) {
        this.setPerson(person, "right");
    }
    clearLeft() {
        let $photo_col = this.$container.find("#photo_col_left");
        $photo_col.find(".photo img").attr("src", "");
        $photo_col.find(".photo-col-name").text("---");
        $("#person_detail_left").text("");
        let $items = $("#foot_col_mid_container").find(".item");
        $items.find(".col-left").empty();
    }
    clearRight() {
        let $photo_col = this.$container.find("#photo_col_right");
        $photo_col.find(".photo img").attr("src", "");
        $photo_col.find(".photo-col-name").text("---");
        $("#person_detail_right").text("");
        let $items = $("#foot_col_mid_container").find(".item");
        $items.find(".col-right").empty();
    }
}
