import * as G from "./include/Global";
import {Person} from "./class/Person";
import {Group} from "./class/Group";
import * as LeftTable from "./NormalTableController";
import * as RightTable from "./UnfixedTableController";
import * as Charts from "./ChartField";
import * as BMCtl from "./BoxMovementController";
import * as Helper from "./HelperFuncitions";
import * as Loading from "./Loadind";
import * as Plan from "./PlanManageField";


/** plan数据部分 **/
//计划表，[班子ID][职位ID] -> 人ID
export let planMap = null;
//整个职位表，用来建表格用
export let positionStc = null;
//人ID的vis映射，标记当前表里是不是已经有这个人了
export let personVis = {};
//调动记录
export let transLog = [];

export function updatePlan(groupID, posID, personID) {
    planMap[groupID][posID] = personID;
    console.log(`update plan: (${groupID}, ${posID}) -> ${personID}`);
}

/** 初始数据填充 **/
let jobQueue = [];

export function switchPlan(plan) {
    Loading.setInfo("加载中");
    Loading.show();
    transLog = [];
    personVis = {};
    jobQueue = [];
    LeftTable.clear();
    RightTable.clear();

    // console.log(map);
    planMap = plan;
    //汇总所有人，得到信息表
    let personIDList = [];
    Object.entries(plan).forEach(([i, row]) => {
        Object.entries(row).forEach(([j, id]) => {
            if(id !== null)personIDList.push(id);
        })
    });
    Loading.setInfo("获取人员数据中");
    $.post("php/getPersonInfo.php", {IDList: personIDList}, function (personInfoMap) {
        //开始填充，左表
        let data_l = positionStc['fixed'];
        LeftTable.newLine();
        LeftTable.addColTitleCell("---");
        for (let i=0 ; i<18 ; ++i) {
            if(i+1 === 5 || i+1 === 6 ) continue;
            LeftTable.addColTitleCell(data_l[0]['items'][i]['name']);
        }
        LeftTable.applyLine();
        //各个街镇的行
        for (let x=0 ; x<data_l.length ; ++x) {
            jobQueue.push(function () {
                LeftTable.newLine();
                let group = new Group(data_l[x].ID, data_l[x].name, data_l[x].desc);
                //街镇标题
                LeftTable.addRowTitleCell(data_l[x].name).click(BMCtl.onClickCell).data("group", group);
                for (let y=0 ; y<18 ; ++y) {
                    if(y+1 === 5 || y+1 === 6 ) continue;
                    let groupID = data_l[x].ID, jobID = data_l[x].items[y].ID;
                    let pID = plan[groupID][jobID];
                    let p_data = personInfoMap[pID];
                    let $cell = null;
                    //副主席-2去掉所有空职位
                    if(y === 16 && pID === null) {
                        $cell = LeftTable.addEmptyCell();
                    }
                    else {
                        $cell = LeftTable.addCell();
                    }
                    $cell.data("group", group);
                    $cell.data("jobID", jobID);
                    $cell.data("positionName", `${data_l[x].name} ${data_l[x].items[y].name}`);

                    if(pID !== null) {
                        personVis[pID] = true;
                        p_data['groupID'] = groupID;
                        p_data['jobID'] = jobID;
                        p_data['job'] = `${data_l[x].name} ${data_l[x].items[y].name}`;
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
                LeftTable.applyLine();
            });
        }
        //右表
        //对于每个单位
        let data_r = positionStc['unfixed'];
        console.log(data_r);
        for(let x=0 ; x<data_r.length ; ++x) {
            jobQueue.push(function () {
                //标题行
                let group = new Group(data_r[x].ID, data_r[x].name, data_r[x].desc);
                RightTable.newLine();
                RightTable.addTitleCell(Helper.clipString(data_r[x].name, 4)).click(BMCtl.onClickCell).data("group", group);

                //所有人
                for(let y=0 ; y<data_r[x].items.length ; ++y) {
                    let groupID = data_r[x].ID, jobID = data_r[x].items[y].ID;
                    let pID = plan[groupID][jobID];
                    let p_data = personInfoMap[pID];

                    let $cell = RightTable.addCell();
                    $cell.data("group", group);
                    $cell.data("jobID", jobID);
                    $cell.data("positionName", `${data_r[x].name} ${data_r[x].items[y].name}`);
                    BMCtl.initCell($cell);

                    if(pID !== null) {
                        personVis[pID] = true;
                        p_data['groupID'] = groupID;
                        p_data['jobID'] = jobID;
                        p_data['job'] = `${data_r[x].name} ${data_r[x].items[y].name}`;
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
            });
        }

        function run(i) {
            if(i >= jobQueue.length) {
                Charts.update();
                Loading.hide();
                return;
            }
            Loading.setInfo(`渲染数据中${i+1}/${jobQueue.length}`);
            setTimeout(function () {
                jobQueue[i]();
                run(i+1);
            });
        }
        run(0);
    }, "json")
}
$(document).ready(function () {
    Plan.setPlanName("现任方案");
    Loading.show();
    //首先获取整个职位结构
    Loading.setInfo("获取职位结构中");
    $.get("php/getPositionStructure", {}, function (stcData) {
        positionStc = stcData;
        //然后获取到当前的plan
        Loading.setInfo("获取调度计划中");
        $.get("php/getPlan.php", {ID: "-1"}, function (planMap) {
            switchPlan(planMap)
        }, "json");
    }, "json");
});
