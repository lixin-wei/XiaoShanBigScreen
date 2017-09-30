"use strict";

var chart_sex = echarts.init(document.getElementById("chart_sex"));
var chart_edu = echarts.init(document.getElementById("chart_edu"));
var chart_age = echarts.init(document.getElementById("chart_age"));
var chart_grp = echarts.init(document.getElementById("chart_grp"));

var option_chart_sex = {
    color: ["#007dc5", "#00c505"],
    textStyle: {
        color: "white"
    },
    title: {
        text: '性别结构',
        top: "bottom",
        left: "62%",
        textStyle: {
            color: "white",
            fontWeight: "normal",
            align: "center"
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        top: "middle",
        data: ['男', '女'],
        textStyle: {
            color: "white"
        }
    },
    series: [{
        name: '性别',
        type: 'pie',
        radius: '65%',
        center: ['75%', '40%'],
        data: [{ value: 627, name: '男' }, { value: 154, name: '女' }],
        label: {
            normal: {
                show: false
            }
        }
    }]
};
var option_chart_edu = {
    color: ["#00c505", "#ff6c00", "#ce00f3", "#007dc5"],
    textStyle: {
        color: "white"
    },
    title: {
        text: '学历结构',
        top: "bottom",
        left: "62%",
        textStyle: {
            color: "white",
            fontWeight: "normal",
            align: "center"
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        top: "middle",
        data: ['研究生', '硕士', "大学", "大专及以下"],
        textStyle: {
            color: "white"
        }
    },
    series: [{
        name: '学历',
        type: 'pie',
        radius: '65%',
        center: ['75%', '40%'],
        data: [{ value: 65, name: '研究生' }, { value: 87, name: '硕士' }, { value: 42, name: '大学' }, { value: 75, name: '大专及以下' }],
        label: {
            normal: {
                show: false
            }
        }
    }]
};
var option_chart_age = {
    color: ["#fffc00", "#ff6c00", "#ce00f3", "#007dc5", "#00c505"],
    textStyle: {
        color: "white"
    },
    title: {
        text: '年龄结构',
        top: "bottom",
        left: "62%",
        textStyle: {
            color: "white",
            fontWeight: "normal",
            align: "center"
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        top: "middle",
        data: ['1694.12之前', '1965.1-1969.12', "1970.1-1974.12", "1975.1-1979.12", "1980.01之后"],
        textStyle: {
            color: "white"
        }
    },
    series: [{
        name: '出生年月',
        type: 'pie',
        radius: '65%',
        center: ['75%', '40%'],
        data: [{ value: 156, name: '1694.12之前' }, { value: 238, name: '1965.1-1969.12' }, { value: 185, name: '1970.1-1974.12' }, { value: 143, name: '1975.1-1979.12' }, { value: 59, name: '1980.01之后' }],
        label: {
            normal: {
                show: false
            }
        }
    }]
};
var option_chart_grp = {
    color: ["#007dc5", "#00c505"],
    textStyle: {
        color: "white"
    },
    title: {
        text: '党派结构',
        top: "bottom",
        left: "62%",
        textStyle: {
            color: "white",
            fontWeight: "normal",
            align: "center"
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        top: "middle",
        data: ["中共党员", "其他"],
        textStyle: {
            color: "white"
        }
    },
    series: [{
        name: '党派',
        type: 'pie',
        radius: '65%',
        center: ['75%', '40%'],
        data: [{ value: 755, name: '中共党员' }, { value: 26, name: '其他' }],
        label: {
            normal: {
                show: false
            }
        }
    }]
};

chart_sex.setOption(option_chart_sex);
chart_edu.setOption(option_chart_edu);
chart_age.setOption(option_chart_age);
chart_grp.setOption(option_chart_grp);
//# sourceMappingURL=index.js.map