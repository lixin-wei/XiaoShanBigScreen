let moment = require('moment');
export class Group {
    constructor(id, name, desc) {
        this.ID = id || -1;
        this.name = name || "";
        this.desc = desc || "";
        this.modifyDate = null;
        this.modify_times = 0;
        this.member = [];
    }
    //设置初始状态，供计算变化值用
    setOriginState() {
        this.origin_data = [
            this.getMemberNum(),
            this.getModifyDate(),
            this.geAverageAge(),
            this.getBackMemberNum(),
            this.getNonCPCNum(),
            this.getFemaleNum()
        ];
        this.modify_times = 0;
    }
    addMember(person) {
        //去掉市委干部
        if(person.flag === 1) return;
        this.member.push(person);
        this.modify_times++
    }
    removeMember(id) {
        this.member = this.member.filter((p) => p.ID !== id);
        this.modify_times++;
    }
    getMemberNum() {
        return this.member.length;
    }
    getModifyDate() {
        let ok = false;
        let res = moment("0000-01-01");
        this.member.forEach((p) => {
            if(p.recentJobTransferDate !== undefined && p.recentJobTransferDate.isAfter(res)) {
                res = p.recentJobTransferDate;
                ok = true;
            }
        });
        if(ok)return res.format("YYYY-MM");
        else return "无数据";
    }
    getModifyTimes() {
        return this.modify_times;
    }
    geAverageAge() {
        let res = 0;
        this.member.forEach((p) => {
            let m = moment(p.birthday);
            let dur = moment.duration({from: m, to: moment()});
            res += parseInt(dur.asYears());
        });
        return (res/this.getMemberNum()).toFixed(2);
    }
    getBackMemberNum() {
        return 0;
    }
    getNonCPCNum() {
        let res = 0;
        this.member.forEach((p) => {
            if(p.politicalStatus !== "中共党员")
                res++;
        });
        return res;
    }
    getFemaleNum() {
        let res = 0;
        this.member.forEach((p) => {
            if(p.sex === "女")
                res++;
        });
        return res;
    }
}