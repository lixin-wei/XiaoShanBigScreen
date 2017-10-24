//图表相关
let chart_sex = echarts.init(document.getElementById("chart_sex"));
let chart_edu = echarts.init(document.getElementById("chart_edu"));
let chart_age = echarts.init(document.getElementById("chart_age"));
let chart_grp = echarts.init(document.getElementById("chart_grp"));

let option_chart_sex = {
    color : ["#007dc5", "#00c505"],
    textStyle : {
        color: "white"
    },
    title : {
        text: '性别结构',
        top : "bottom",
        left : "62%",
        textStyle : {
            color: "white",
            fontWeight: "normal",
            align : "center"
        }
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        top: "middle",
        data: ['男','女'],
        textStyle : {
            color: "white"
        }
    },
    series : [
        {
            name: '性别',
            type: 'pie',
            radius : '65%',
            center: ['75%', '40%'],
            data:[
                {value:627, name:'男'},
                {value:154, name:'女'},
            ],
            label : {
                normal: {
                    show: false
                }
            }
        }
    ]
};
let option_chart_edu = {
    color : ["#00c505", "#ff6c00", "#ce00f3", "#007dc5"],
    textStyle : {
        color: "white"
    },
    title : {
        text: '学历结构',
        top : "bottom",
        left : "62%",
        textStyle : {
            color: "white",
            fontWeight: "normal",
            align : "center"
        }
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        top: "middle",
        data: ['研究生','硕士',"大学","大专及以下"],
        textStyle : {
            color: "white"
        }
    },
    series : [
        {
            name: '学历',
            type: 'pie',
            radius : '65%',
            center: ['75%', '40%'],
            data:[
                {value:65, name:'研究生'},
                {value:87, name:'硕士'},
                {value:42, name:'大学'},
                {value:75, name:'大专及以下'},
            ],
            label : {
                normal: {
                    show: false
                }
            }
        }
    ]
};
let option_chart_age = {
    color : ["#fffc00", "#ff6c00", "#ce00f3", "#007dc5", "#00c505"],
    textStyle : {
        color: "white"
    },
    title : {
        text: '年龄结构',
        top : "bottom",
        left : "62%",
        textStyle : {
            color: "white",
            fontWeight: "normal",
            align : "center"
        }
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        top: "middle",
        data: ['1694.12之前','1965.1-1969.12',"1970.1-1974.12","1975.1-1979.12", "1980.01之后"],
        textStyle : {
            color: "white"
        }
    },
    series : [
        {
            name: '出生年月',
            type: 'pie',
            radius : '65%',
            center: ['75%', '40%'],
            data:[
                {value:156, name:'1694.12之前'},
                {value:238, name:'1965.1-1969.12'},
                {value:185, name:'1970.1-1974.12'},
                {value:143, name:'1975.1-1979.12'},
                {value:59, name:'1980.01之后'},
            ],
            label : {
                normal: {
                    show: false
                }
            }
        }
    ]
};
let option_chart_grp = {
    color : ["#007dc5", "#00c505"],
    textStyle : {
        color: "white"
    },
    title : {
        text: '党派结构',
        top : "bottom",
        left : "62%",
        textStyle : {
            color: "white",
            fontWeight: "normal",
            align : "center"
        }
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        top: "middle",
        data: ["中共党员", "其他"],
        textStyle : {
            color: "white"
        }
    },
    series : [
        {
            name: '党派',
            type: 'pie',
            radius : '65%',
            center: ['75%', '40%'],
            data:[
                {value:755, name:'中共党员'},
                {value:26, name:'其他'},
            ],
            label : {
                normal: {
                    show: false
                }
            }
        }
    ]
};

chart_sex.setOption(option_chart_sex);
chart_edu.setOption(option_chart_edu);
chart_age.setOption(option_chart_age);
chart_grp.setOption(option_chart_grp);

//info-box拖动
let $box_list = $("#mid_col3_body_list");
let $box_trash = $("#mid_col3_box_trash");
let $tree_label_list = $(".tree-label");
let $person_info_container = $("#foot_col3_photo_container");
let $active_box = null;
let $active_cell = null;
let click_x = 0, click_y = 0;
let isMouseDown = false;
const BOX_HEIGHT = 150;
const TRASH_X = $box_list.offset().left;
const TRASH_Y = $box_list.offset().top;
function focusOn($ele) {
    $(".cell, .info-box").removeClass("active");
    if($ele) {
        $ele.addClass("active");
    }
}
function setPersonInfo($box) {
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
function allDown() {
    //list里原来的项目下移
    $box_list.find(".info-box").each(function () {
        $(this).animate({
            top: "+=" + BOX_HEIGHT
        });
    });
}
function allNextUp($box) {
    //list里在这个box之下的项目上移
    $box.nextAll().each(function () {
        $(this).animate({
            top: "-=" + BOX_HEIGHT
        });
    });
}
function goToList($box) {
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

//box的拖出事件
function onMouseMoveInfoBox(e) {
    if(isMouseDown && !$active_box) {
        let maxQueueCnt = 0;
        $box_list.find(".info-box").each(function () {
            maxQueueCnt = Math.max(maxQueueCnt, $(this).queue());
        });
        //等待动画队列完成，防止点太快出bug
        if(maxQueueCnt === 0) {
            $(this).css({
                top: $(this).offset().top - $(window).scrollTop(),
                left: $(this).offset().left - $(window).scrollLeft(),
            }).addClass("float");
            $active_box = $(this);
            click_x = e.pageX - $(this).offset().left;
            click_y = e.pageY - $(this).offset().top;
            allNextUp($(this));
            $(this).appendTo($box_trash);
        }
    }
}

//box的点击事件
function onClickInfoBox() {
    focusOn($(this));
    setPersonInfo($(this));
}
$(window).on("mouseup", function () {
    if($active_box) {
        //如果当前鼠标下有cell，则填充
        if($active_cell) {
            if($active_cell.data("box")) { //如果当前cell已经有内容了
                //让这个box回备选区去
                if($active_cell.hasClass("active")) {
                    focusOn(null);
                }
                goToList($active_cell.data("box"));
                $active_cell.data("box", null);
            }
            //设置姓名
            $active_cell.text($active_box.find(".name").text());
            //把box附加到cell上
            $active_cell.data("box", $active_box);
            //隐藏box
            $active_box.hide();
        }
        else { //否则让box回去
            goToList($active_box);
        }
        $active_box = null;
    }
}).on("mousedown", function () {
    isMouseDown = true;
}).on("mouseup", function () {
    isMouseDown = false;
});

$(".cell:not(.title-row):not(.title-col)").on("mouseenter", function () {
    $active_cell = $(this);
}).on("mouseleave", function () {
    $active_cell = null;
}).on("mousemove", function () { //cell中的box拖出事件
    //如果是拖出且当前格子有内容
    if(isMouseDown && !$active_box && $(this).data("box")) {
        //拿出这个box并显示
        $active_box = $(this).data("box");
        $(this).data("box", null);
        $(this).text("");
        $active_box.show();
    }
}).on("click", function () { //点击事件
    if($(this).data("box")) {
        let $box = $(this).data("box");
        focusOn($(this));
        setPersonInfo($box);
    }
});

//box跟随鼠标移动
$(window).on("mousemove", function (e) {
    // console.log(e.offsetX);
    if ($active_box) {
        $active_box.css({
            top: e.pageY - $(window).scrollTop() - click_y,
            left: e.pageX - $(window).scrollLeft() - click_x
        });
    }
});

$(document).ready(function () {
    for(let i=0; i<=30; ++i) {
        let $box = $($.parseHTML(`
                        <div class="info-box">
                        <img class="photo" src="images/mans/man${i%6}.png" />
                        <div class="name">姓名${i}</div>
                        <div class="info">男 ${i}岁 党员</div>
                        <div class="job">戴村·党支部书记</div>
                        <div class="close">
                            <i class="fa fa-close"></i>
                        </div>
                        <div class="last-row">
                            <button class="btn blue"><i class="fa fa-file-text"></i>个人资料卡</button>
                            <div>
                                匹配度:
                                <div class="percent-bar">
                                    <div class="thumb">50%</div>
                                </div>
                            </div>
                        </div>
                    </div>
        `));
        $box.css({
            top: BOX_HEIGHT * i,
        });
        $box.on("mousemove", onMouseMoveInfoBox);
        $box.on("click", onClickInfoBox);
        $box_list.append($box);
    }
});
