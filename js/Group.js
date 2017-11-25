let moment = require('moment');
export class Group {
    constructor(id, name, desc) {
        this.id = id || -1;
        this.name = name || "";
        this.desc = desc || "";
        this.modify_times = 0;
        this.member = [];
    }
    //设置初始状态，供计算变化值用
    setOriginState() {
        this.origin_data = [
            this.getMemberNum(),
            this.getModifyDate(),
            this.getModifyTimes(),
            this.getEverageAge(),
            this.getBackMemberNum(),
            this.getNonCPCNum(),
            this.getFemaleNum()
        ];
        this.modify_times = 0;
    }
    addMember(person) {
        this.member.push(person);
        this.modify_times++
    }
    removeMember(id) {
        this.member = this.member.filter((p) => p.id !== id);
        this.modify_times++;
    }
    getMemberNum() {
        return this.member.length;
    }
    getModifyDate() {
        return new Date().toDateString();
    }
    getModifyTimes() {
        return this.modify_times;
    }
    getEverageAge() {
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