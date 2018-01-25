window.$ = window.jQuery = require("jquery");
let echarts = require("echarts");
let moment = require("moment");
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
                {value:0, name:'男'},
                {value:0, name:'女'},
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
        data: ['博士','硕士、研究生',"大学","大专及以下"],
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
                {value:0, name:'博士'},
                {value:0, name:'硕士、研究生'},
                {value:0, name:'大学'},
                {value:0, name:'大专及以下'},
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
        data: ['1964.12之前','1965.1-1969.12',"1970.1-1974.12","1975.1-1979.12", "1980.01之后"],
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
                {value:0, name:'1964.12之前'},
                {value:0, name:'1965.1-1969.12'},
                {value:0, name:'1970.1-1974.12'},
                {value:0, name:'1975.1-1979.12'},
                {value:0, name:'1980.01之后'},
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
                {value:0, name:'中共党员'},
                {value:0, name:'其他'},
            ],
            label : {
                normal: {
                    show: false
                }
            }
        }
    ]
};


let chart_sex = echarts.init(document.getElementById("chart_sex"));
let chart_edu = echarts.init(document.getElementById("chart_edu"));
let chart_age = echarts.init(document.getElementById("chart_age"));
let chart_grp = echarts.init(document.getElementById("chart_grp"));

export function update() {
    chart_sex.setOption(option_chart_sex);
    chart_edu.setOption(option_chart_edu);
    chart_age.setOption(option_chart_age);
    chart_grp.setOption(option_chart_grp);
}
export function clear() {
    option_chart_sex.series[0].data[0].value = 0;
    option_chart_sex.series[0].data[1].value = 0;

    option_chart_edu.series[0].data[0].value = 0;
    option_chart_edu.series[0].data[1].value = 0;
    option_chart_edu.series[0].data[2].value = 0;
    option_chart_edu.series[0].data[3].value = 0;

    option_chart_age.series[0].data[0].value = 0;
    option_chart_age.series[0].data[1].value = 0;
    option_chart_age.series[0].data[2].value = 0;
    option_chart_age.series[0].data[3].value = 0;
    option_chart_age.series[0].data[4].value = 0;

    option_chart_grp.series[0].data[0].value = 0;
    option_chart_grp.series[0].data[1].value = 0;
}
update();

export function addPerson(person) {
    let data = option_chart_sex.series[0].data;
    //性别统计
    if(person.sex === "男") {
        data[0].value++;
    }
    else {
        data[1].value++;
    }
    //教育背景统计
    let edu = person.eduBkg;
    data = option_chart_edu.series[0].data;
    if(edu.indexOf("博士") !== -1) {
        data[0].value++;
    }
    else if(edu.indexOf("硕士") !== -1 || edu.indexOf("研究生") !== -1) {
        data[1].value++;
    }
    else if(edu.indexOf("学士") !== -1 || edu.indexOf("大学") !== -1) {
        data[2].value++;
    }
    else {
        data[3].value++;
    }
    //年龄统计
    let bir = person.birthday;
    data = option_chart_age.series[0].data;
    if(bir.isBefore(moment("1964-12-01"))) {
        data[0].value++;
    }
    else if(bir.isBefore(moment("1969-12-01"))) {
        data[1].value++;
    }
    else if(bir.isBefore(moment("1974-12-01"))) {
        data[2].value++;
    }
    else if(bir.isBefore(moment("1979-12-01"))) {
        data[3].value++;
    }
    else {
        data[4].value++;
    }
    //党派统计
    if(person.politicalStatus === "中共党员") {
        option_chart_grp.series[0].data[0].value++;
    }
    else {
        option_chart_grp.series[0].data[1].value++;
    }
}

export function removePerson(person) {
    let data = option_chart_sex.series[0].data;
    //性别统计
    if(person.sex === "男") {
        data[0].value--;
    }
    else {
        data[1].value--;
    }
    //教育背景统计
    let edu = person.eduBkg;
    data = option_chart_edu.series[0].data;
    if(edu.indexOf("博士") !== -1) {
        data[0].value--;
    }
    else if(edu.indexOf("硕士") !== -1 || edu.indexOf("研究生") !== -1) {
        data[1].value--;
    }
    else if(edu.indexOf("学士") !== -1 || edu.indexOf("大学") !== -1) {
        data[2].value--;
    }
    else {
        data[3].value--;
    }
    //年龄统计
    let bir = person.birthday;
    data = option_chart_age.series[0].data;
    if(bir.isBefore(moment("1964-12-01"))) {
        data[0].value--;
    }
    else if(bir.isBefore(moment("1969-12-01"))) {
        data[1].value--;
    }
    else if(bir.isBefore(moment("1974-12-01"))) {
        data[2].value--;
    }
    else if(bir.isBefore(moment("1979-12-01"))) {
        data[3].value--;
    }
    else {
        data[4].value--;
    }
    //党派统计
    if(person.politicalStatus === "中共党员") {
        option_chart_grp.series[0].data[0].value--;
    }
    else {
        option_chart_grp.series[0].data[1].value--;
    }
}