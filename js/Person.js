import {getRandomInt} from "./HelperFuncitions";

export class Person {
    constructor(data) {
        this.ID = data.ID || -1;
        this.birthday = data.birthday || "0000-00-00";
        this.eduBkg = data.eduBkg || "";
        this.job = data.job || "";
        this.jobID = data.jobID || "";
        this.name = data.name || "";
        this.photo = data.photo || "";
        this.politicalStatus = data.politicalStatus || "";
        this.positionID = data.positionID || "";
        this.sex = data.sex || "";
        this.$box = this.generateInfoBoxNode();
    }
    generateInfoBoxNode() {
        let $node = $(`
                    <div class="info-box">
                        <img class="photo" src="images/mans/${this.photo}" />
                        <div class="name">${this.name}</div>
                        <div class="job">${this.job}</div>
                        <div class="info">${this.getInfo()}</div>
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
        `);
        $node.data("person_obj", this);
        return $node;
    }
    getInfo() {
        return `${this.sex} ${this.birthday.substr(0,4)} ${this.politicalStatus}`;
    }
    updateInfo() {
        this.$box.find(".name").text(this.name);
        this.$box.find(".job").text(this.job);
        this.$box.find(".info").text(this.getInfo());
    }
    setName(name) {
        this.name = name;
        this.updateInfo();
    }
    setJob(job) {
        this.job = job;
        this.updateInfo();
    }
    setSex(sex) {
        this.sex = sex;
        this.updateInfo();
    }
    setBirthday(bir) {
        this.birthday = bir;
        this.updateInfo();
    }
    setPoliStatus(ps) {
        this.politicalStatus = ps;
        this.updateInfo();
    }
    getBox() {
        return this.$box;
    }
}