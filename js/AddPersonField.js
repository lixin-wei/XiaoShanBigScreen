import * as G from "./include/Global";
import * as PopBox from "./component/PopBox";
import * as GroupBox from "./GroupBoxField";
import * as BMCtl from "./BoxMovementController";
import {Person} from "./class/Person";

window.$ = window.jQuery = require("jquery");

$("#btnAddPerson").click(function (e) {
    let $content = $(`
    <div>
        <label>搜索姓名：</label>
        <hr />
        <ul class="file-list beauty-scroll" style="max-height: 600px; transition: all 0.5s;"></ul>
    </div>
    `);
    let $input = $('<input type="text" class="input text-large" />');
    $input.keydown(function (e) {
        if(e.keyCode === 13) {
            let str = $input.val();
            $content.find("ul").empty();
            $.getJSON("php/searchPersonByName.php", {name: str}, function (res) {
                $content.find("ul").empty();
                //搜出人名，加到列表里
                res.forEach((person) => {
                    //已经在表里的人不允许添加
                    if(!G.personVis[person.ID]) {
                        let $li = $('<li class="hover-white" />').text(`${person.name} ${person.sex} ${person.birthday}`);
                        //点击人名项，添加相应的box
                        $li.click(function () {
                            BMCtl.addNewPerson(person.ID);
                        });
                        $content.find("ul").append($li);
                    }
                });
            });
        }
    });
    $content.find("label").append($input);
    PopBox.show(e.pageX, e.pageY, $content, {
        position: {x: "left", y: "bottom"},
        css: {"max-height": "700px", "font-size": "large"}
    });
    e.stopPropagation();
});

$("#btnMatch").click(function (e) {
    let x = $(this).offset().left + $(this).outerWidth()/2;
    let y = $(this).offset().top + $(this).outerHeight()/2;
    let groupID = GroupBox.getGroupID();
    if(groupID === null) {
        let $content = $("<div class='text-center' />").text("请先选择领导班子");
        PopBox.show(x, y, $content, {
            position: {x: "center", y: "middle"},
            css: {width: "300px"},
            showClose: false
        });
    }
    else {
        let $content = $("<ul class='file-list'/>");
        $.get("php/getJobList.php", {groupID: GroupBox.getGroupID()}, function (res) {
            res.forEach((job) => {
                let $li = $("<li/>").text(job.jobName);
                $li.click(function () {
                    PopBox.remove();
                    function sleep (time) {
                        return new Promise((resolve) => setTimeout(resolve, time));
                    }
                    $.getJSON("http://localhost:5000/recmdJob", {teamID: groupID, jobID: job.ID}, function (data) {
                        // console.log(data);
                        //先把所有资料卡里的匹配度隐藏
                        $(".info-box").find(".last-row div:last-child").hide();
                        data = data.personList;
                        //找出分数最大值，计算百分制分数
                        let maxScore = 0;
                        data.forEach((item) => {
                            maxScore = Math.max(item.score, maxScore);
                        });
                        function insert(i) {
                            let pID = data[i].id;
                            // if(!G.personVis[pID]) {
                                BMCtl.addNewPerson(data[i].id, (data[i].score / maxScore).toFixed(2) * 100);
                            // }
                            sleep(700).then(() => {
                                if(i - 1 >= 0) {
                                    insert(i - 1);
                                }
                            });
                        }
                        if(data.length) {
                            //倒着来，分数高的最后放
                            insert(data.length - 1);
                        }
                    })
                });
                $content.append($li);
            });
            PopBox.show(x, y, $content, {
                position: {x: "center", y: "bottom"},
                css: {width: "300px"},
                showClose: false
            });

        }, "json");
    }
    e.stopPropagation();
});