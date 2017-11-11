class InfoBoxController {
    constructor() {
        this.$box_list = $("#mid_col3_body_list");
        this.$box_trash = $("#mid_col3_box_trash");
        this.$tree_label_list = $(".tree-label");
        this.$person_info_container = $("#foot_col3_photo_container");
        this.$active_box = null;
        this.$active_cell = null;
        this.click_x = 0;
        this.click_y = 0;
        this.isMouseDown = false;
        this.BOX_HEIGHT = 150;
        this.TRASH_X = $box_list.offset().left;
        this.TRASH_Y = $box_list.offset().top;
    }
    focusOn($ele) {
        $(".cell, .info-box").removeClass("active");
        if($ele) {
            $ele.addClass("active");
        }
    }
    setPersonInfo($box) {
        $person_info_container.find(".photo").attr("src", $box.find(".photo").attr("src"));
        $person_info_container.find(".name").text($box.find(".name").text());
        $person_info_container.find(".info1").text($box.find(".info").text());
        $person_info_container.find(".info2").text($box.find(".job").text());
        $tree_label_list.each(function () {
            if(parseInt((Math.random() * 100), 10)%2) {
                $(this).css({
                    transform: "scale(0)"
                });
            }
            else {
                $(this).css({
                    transform: ""
                });
            }
        });
    }
    allDown() {
        //list里原来的项目下移
        $box_list.find(".info-box").each(function () {
            $(this).animate({
                top: "+=" + BOX_HEIGHT
            });
        });
    }
    allNextUp($box) {
        //list里在这个box之下的项目上移
        $box.nextAll().each(function () {
            $(this).animate({
                top: "-=" + BOX_HEIGHT
            });
        });
    }
    goToList($box) {
        $box.show();
        allDown();
        $box.animate({ //回到原来位置
            top: TRASH_Y - $(window).scrollTop(),
            left: TRASH_X - $(window).scrollLeft(),
        },function () { //放回容器内
            $box.css({
                top: 0,
                left: 0,
            });
            $box.removeClass("float");
            $box.prependTo($box_list);
        });
    }
}