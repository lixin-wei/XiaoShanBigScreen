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
import * as LineLayer from "./LineLayer";


/** plan数据部分 **/
//计划表，[班子ID][职位ID] -> 人ID
export let curPlan = null;
export let originPlan = null;
export let personInfo = {}; // personID => Person
export let cellMap = {};
//整个职位表，用来建表格用
export let positionStc = null;
//调动记录
export let transLog = [];

export function updatePlan(groupID, posID, personID) {
    curPlan[groupID][posID] = personID;
    console.log(`update plan: (${groupID}, ${posID}) -> ${personID}`);
}

export function getPlanDiff() {
    //原计划也就是数据库中目前应用的计划
    let transLog = [];
    let oriJobs = {};
    let newJobs = {};
    let IDSet = new Set();
    //统计出原计划(personID) => [[groupID, jobID], ...]的映射
    Object.entries(originPlan).forEach(([i, row]) => {
        Object.entries(row).forEach(([j, ID]) => {
            if(ID !== null) {
                IDSet.add(ID);
                if(oriJobs[ID] === undefined) oriJobs[ID] = [];
                oriJobs[ID].push([i, j]);
            }
        })
    });
    //对于现计划的每一个人，如果他在原计划中没有，则是新加进来的，否则如果位置不一样，就加一条调动记录
    Object.entries(curPlan).forEach(([i, row]) => {
        Object.entries(row).forEach(([j, ID]) => {
            if(ID !== null) {
                IDSet.add(ID);
                //遍历所有原计划职务，只要有一个匹配，说明这个职位没变，把这个职位从oriJobs中删除
                //最后剩下的都是变动过的职位
                let hasFound = false;
                if(oriJobs[ID]) for(let x of oriJobs[ID]) {
                    if(x.equals([i,j])) {
                        hasFound = true;
                        break;
                    }
                }
                oriJobs[ID] = oriJobs[ID].filter((x) => !x.equals([i,j]));
                //如果没找到，记录下这个职位
                if(newJobs[ID] === undefined) newJobs[ID] = [];
                if(hasFound === false) {
                    newJobs[ID].push([i,j]);
                }
            }
        })
    });
    for(let ID of IDSet) {
        if(oriJobs[ID] === undefined) oriJobs[ID] = [];
        if(newJobs[ID] === undefined) newJobs[ID] = [];
    }
    //最后剩下的都是变过的职位，直接一个对一个调度即可
    //如果新职位多，from设成null，旧职位多，to设成null
    for(let ID of IDSet) {
        let mid = Math.min(oriJobs[ID].length, newJobs[ID].length);
        //先把公共部分一对一调度
        for(let i=0 ; i<mid ; ++i) {
            let ori = oriJobs[ID][i];
            let cur = newJobs[ID][i];
            let $from = cellMap[ori[0]][ori[1]];
            let $to = cellMap[cur[0]][cur[1]];
            transLog.push({
                $from: $from,
                $to: $to,
                who: personInfo[ID]
            })
        }
        //然后如果旧职位有多，看作撤职
        if(oriJobs[ID].length > newJobs[ID].length) {
            for(let i = mid ; i < oriJobs[ID].length ; ++i) {
                let ori = oriJobs[ID][i];
                let $from = cellMap[ori[0]][ori[1]];
                transLog.push({
                    $from: $from,
                    $to: null,
                    who: personInfo[ID]
                })
            }
        }
        //新职位有多，看作新任免
        else if(oriJobs[ID].length < newJobs[ID].length) {
            for(let i = mid ; i < newJobs[ID].length ; ++i) {
                let cur = newJobs[ID][i];
                let $to = cellMap[cur[0]][cur[1]];
                transLog.push({
                    $from: null,
                    $to: $to,
                    who: personInfo[ID]
                })
            }
        }
    }
    return transLog;
}

/** 初始数据填充 **/
let jobQueue = [];

export function switchPlan(plan) {
    Loading.setInfo("加载中");
    Loading.show();
    transLog = [];
    cellMap = {};
    jobQueue = [];
    LeftTable.clear();
    RightTable.clear();
    Charts.clear();
    LineLayer.clear();
    $("#mid_col3_body_list").empty();
    $("#mid_col3_box_trash").empty();

    // console.log(map);
    curPlan = plan;
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
        let titles = ["书记","镇长","人大主席","副书记","纪委书记","组织","宣传统战","文教","经济","城建","农业","人武","派出所长","不定","副主席","副主席"];
        for (let i=0 ; i<16 ; ++i) {
            LeftTable.addColTitleCell(titles[i]);
        }
        LeftTable.applyLine();
        //各个街镇的行
        for (let x=0 ; x<data_l.length ; ++x) {
            jobQueue.push(function () {
                LeftTable.newLine();
                let group = new Group(data_l[x].ID, data_l[x].name, data_l[x].desc);
                //街镇标题
                LeftTable.addRowTitleCell(data_l[x].name).click(BMCtl.onClickCell).data("group", group);
                for (let y=0 ; y<16 ; ++y) {
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
                    //存住(groupID, jobID) => $cell的映射，供后期查找用
                    if(!cellMap[groupID])cellMap[groupID] = {};
                    cellMap[groupID][jobID] = $cell;

                    if(pID !== null) {
                        p_data['groupID'] = groupID;
                        p_data['jobID'] = jobID;
                        p_data['job'] = `${data_l[x].name} ${data_l[x].items[y].name}`;
                        let person = new Person(p_data);
                        personInfo[pID] = person;
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
                    //存住(groupID, jobID) => $cell的映射，供后期查找用
                    if(!cellMap[groupID])cellMap[groupID] = {};
                    cellMap[groupID][jobID] = $cell;

                    if(pID !== null) {
                        p_data['groupID'] = groupID;
                        p_data['jobID'] = jobID;
                        p_data['job'] = `${data_r[x].name} ${data_r[x].items[y].name}`;
                        let person = new Person(p_data);
                        personInfo[pID] = person;
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
                //重新绘制调度线，高亮格子
                let transLog = getPlanDiff();
                for(let log of transLog) {
                    if(log.$from && log.$to) {
                        LineLayer.addLine(Helper.getNodeCenter(log.$from), Helper.getNodeCenter(log.$to));
                    }
                    if(log.$from) {
                        log.$from.addClass("changed");
                    }
                    if(log.$to) {
                        log.$to.addClass("changed");
                    }
                }
                LineLayer.show();
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

export function setToDefaultPlan() {
    Loading.show();
    Plan.setPlanName("现任方案");
    Loading.setInfo("获取调度计划中");
    $.get("php/getPlan.php", {ID: "-1"}, function (planMap) {
        //拷贝一份当作原计划表，供以后比较用
        originPlan = jQuery.extend(true, {}, planMap);
        switchPlan(planMap)
    }, "json");
}
$(document).ready(function () {
    Loading.show();
    //首先获取整个职位结构
    Loading.setInfo("获取职位结构中");
    $.get("php/getPositionStructure", {}, function (stcData) {
        positionStc = stcData;
        setToDefaultPlan();
    }, "json");
});
