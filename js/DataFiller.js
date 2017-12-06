import * as G from "./include/Global";
import {Person} from "./class/Person";
import {Group} from "./class/Group";
import {NormalTableController} from "./NormalTableController";
import * as RightTable from "./UnfixedTableController";
import * as Charts from "./ChartField";
import * as BMCtl from "./BoxMovementController";
import * as Helper from "./HelperFuncitions";

/** 初始数据填充 **/
let table_left = new NormalTableController();
$(document).ready(function () {
    //首先获取整个职位结构
    $.get("php/getPositionStructure", {}, function (positionStc) {
        // G.positionStc = positionStc;
        //然后获取到当前的plan
        $.get("php/getPlan.php", {ID: "-1"}, function (planMap) {
            // console.log(map);
            // G.planMap = planMap;
            //汇总所有人，得到信息表
            let personIDList = [];
            Object.entries(planMap).forEach(([i, row]) => {
                Object.entries(row).forEach(([j, id]) => {
                    if(id !== null)personIDList.push(id);
                })
            });
            $.post("php/getPersonInfo.php", {IDList: personIDList}, function (personInfoMap) {
                //开始填充，左表
                let data = positionStc['fixed'];
                table_left.newLine();
                table_left.addColTitleCell("---");
                for (let i=0 ; i<18 ; ++i) {
                    if(i+1 === 5 || i+1 === 6 ) continue;
                    table_left.addColTitleCell(data[0]['items'][i]['name']);
                }
                table_left.applyLine();
                //各个街镇的行
                for (let x=0 ; x<data.length ; ++x) {
                    table_left.newLine();
                    let group = new Group(data[x].ID, data[x].name, data[x].desc);
                    //街镇标题
                    table_left.addRowTitleCell(data[x].name).click(BMCtl.onClickCell).data("group", group);
                    for (let y=0 ; y<18 ; ++y) {
                        if(y+1 === 5 || y+1 === 6 ) continue;
                        let groupID = data[x].ID, jobID = data[x].items[y].ID;
                        let pID = planMap[groupID][jobID];
                        let p_data = personInfoMap[pID];
                        let $cell = null;
                        //副主席-2去掉所有空职位
                        if(y === 16 && pID === null) {
                            $cell = table_left.addEmptyCell();
                        }
                        else {
                            $cell = table_left.addCell();
                        }
                        $cell.data("group", group);
                        $cell.data("positionName", `${data[x].name} ${data[x].items[y].name}`);

                        if(pID !== null) {
                            G.personVis[pID] = true;
                            p_data['groupID'] = groupID;
                            p_data['jobID'] = jobID;
                            p_data['job'] = `${data[x].name} ${data[x].items[y].name}`;
                            let person = new Person(p_data);
                            //如果是市委干部，特别颜色标注，且不计入图表的统计
                            if(person.flag === 1) {
                                $cell.addClass("important");
                            }
                            else {
                                Charts.addPerson(person);
                            }
                            group.addMember(person);
                            $cell.text(Helper.clipString(person.name, 4));
                            //生成一个box的node
                            //隐藏并丢到trash里
                            BMCtl.initBox(person.$box, $cell);
                            $cell.data("person", person);
                        }
                        BMCtl.initCell($cell);
                    }
                    group.setOriginState();
                    table_left.applyLine();
                }
                //右表
                //对于每个单位
                data = positionStc['unfixed'];
                console.log(data);
                for(let x=0 ; x<data.length ; ++x) {
                    //标题行
                    let group = new Group(data[x].ID, data[x].name, data[x].desc);
                    RightTable.newLine();
                    RightTable.addTitleCell(Helper.clipString(data[x].name, 4)).click(BMCtl.onClickCell).data("group", group);

                    //所有人
                    for(let y=0 ; y<data[x].items.length ; ++y) {
                        let groupID = data[x].ID, jobID = data[x].items[y].ID;
                        let pID = planMap[groupID][jobID];
                        let p_data = personInfoMap[pID];

                        let $cell = RightTable.addCell();
                        $cell.data("group", group);
                        $cell.data("positionName", `${data[x].name} ${data[x].items[y].name}`);
                        BMCtl.initCell($cell);

                        if(pID !== null) {
                            G.personVis[pID] = true;
                            p_data['groupID'] = groupID;
                            p_data['jobID'] = jobID;
                            p_data['job'] = `${data[x].name} ${data[x].items[y].name}`;
                            let person = new Person(p_data);
                            //如果是市委干部，特别颜色标注，且不计入图表的统计
                            if(person.flag === 1) {
                                $cell.addClass("important");
                            }
                            else {
                                Charts.addPerson(person);
                            }
                            $cell.text(Helper.clipString(person.name, 3));
                            group.addMember(person);
                            //生成一个box的node
                            //隐藏并丢到trash里
                            BMCtl.initBox(person.$box, $cell);
                            $cell.data("person", person);
                        }
                    }
                    group.setOriginState();
                    RightTable.applyLine();
                    RightTable.finishBlock();
                }
                Charts.update();
            }, "json")
        }, "json");
    }, "json");
});
