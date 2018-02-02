import * as G from "../include/Global";
import {getRandomInt} from "../HelperFuncitions";

let moment = require("moment");
export class Person {
    constructor(data) {
        this.ID = data.ID || -1;
        this.flag = data.flag || 0;
        this.birthday = moment(data.birthday) || moment("1800-00-00");
        this.eduBkg = data.eduBkg || "";
        this.job = data.job || "";
        this.jobID = data.jobID || "";
        this.name = data.name || "";
        this.photo = data.photo || "";
        this.politicalStatus = data.politicalStatus || "";
        this.positionID = data.positionID || "";
        this.sex = data.sex || "";
        if(data.recentJobTransferDate) {
            this.recentJobTransferDate = moment(data.recentJobTransferDate);
        }
        this.$box = this.generateInfoBoxNode();
    }
    generateInfoBoxNode() {
        let $node = $(`
                    <div class="info-box">
                        <div class="photo">
                            <img data-src="${G.PERSON_PHOTO_ROOT + this.photo}" />
                        </div>
                        <div class="name">${this.name}</div>
                        <div class="job">${this.job}</div>
                        <div class="info">${this.getInfo()}</div>
                        <div class="close">
                            <i class="fa fa-close"></i>
                        </div>
                        <div class="last-row">
                            <button class="btn blue"><i class="fa fa-file-text"></i>个人资料</button>
                            <div style="display: none;">
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
    loadImg() {
        let $img = this.$box.find("img");
        if($img.attr("data-src")) {
            $img.attr("src", $img.attr("data-src"));
            $img.removeAttr("data-src");
        }
    }
    setScore(score) {
        score = score.toFixed(2);
        this.$box.find("div.last-row div:last-child").show()
            .find("div.percent-bar .thumb").css({width: `${score}%`}).text(`${score}%`);
    }
    getInfo() {
        if(this.flag === 1) {
            return "市管干部";
        }
        return `${this.sex} ${this.birthday.format("YYYY-MM")} ${this.politicalStatus}`;
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