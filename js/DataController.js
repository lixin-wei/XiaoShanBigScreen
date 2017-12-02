import * as G from "include/Global";
import {NormalTableController} from "./NormalTableController";
import * as RightTable from "./UnfixedTableController";
import * as Charts from "./ChartField";
import {clipName} from "./HelperFuncitions";

/** 初始数据填充 **/
let table_left = new NormalTableController();
$(document).ready(function () {
    //首先获取整个职位结构
    $.get("php/getPositionStructure", {}, function (positionStc) {
        G.positionStc = positionStc;
        //然后获取到当前的plan
        $.get("php/getPlan.php", {ID: "-1"}, function (map) {
            // console.log(map);
            G.planMap = map;
            //汇总所有人，得到信息表
            let personIDList = [];
            Object.entries(G.planMap).forEach(([i, row]) => {
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
                for (let x=0 ; x<20 ; ++x) {
                    table_left.newLine();
                    let group = new Group(data[x].ID, data[x].name, data[x].desc);
                    //街镇标题
                    table_left.addRowTitleCell(data[x].name).click(onClickCell).data("group", group);
                    for (let y=0 ; y<18 ; ++y) {
                        if(y+1 === 5 || y+1 === 6 ) continue;
                        let groupID = data[x].ID, jobID = data[x].items[y].ID;
                        let pID = G.planMap[groupID][jobID];
                        let p_data = personInfoMap[pID];
                        let $cell = table_left.addCell();
                        $cell.data("group", group);
                        if(pID !== null) {
                            p_data['groupID'] = groupID;
                            p_data['jobID'] = jobID;
                            p_data['job'] = `${data[x].name} ${data[x].items[y].name}`;
                            let person = new Person(p_data);
                            Charts.addPerson(person);
                            group.addMember(person);
                            $cell.text(clipName(person.name, 4));
                            //生成一个box的node
                            //隐藏并丢到trash里
                            initBox(person.$box, $cell);
                            person.$box.hide().addClass("float");
                            $cell.data("person", person);
                            G.$box_trash.append(person.$box);
                        }
                        initCell($cell);
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
                    RightTable.addTitleCell(clipName(data[x].name, 4)).click(onClickCell).data("group", group);

                    //所有人
                    for(let y=0 ; y<data[x].items.length ; ++y) {
                        let groupID = data[x].ID, jobID = data[x].items[y].ID;
                        let pID = G.planMap[groupID][jobID];
                        let p_data = personInfoMap[pID];

                        let $cell = RightTable.addCell();
                        $cell.data("group", group);
                        initCell($cell);

                        if(pID !== null) {
                            p_data['groupID'] = groupID;
                            p_data['jobID'] = jobID;
                            p_data['job'] = `${data[x].name} ${data[x].items[y].name}`;
                            let person = new Person(p_data);
                            $cell.text(clipName(person.name, 3));
                            group.addMember(person);
                            Charts.addPerson(person);
                            //生成一个box的node
                            //隐藏并丢到trash里
                            initBox(person.$box, $cell);
                            person.$box.hide().addClass("float");
                            $cell.data("person", person);
                            G.$box_trash.append(person.$box);
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