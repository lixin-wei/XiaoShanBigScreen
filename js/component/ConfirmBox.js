
const ANIMATION_DUR = 200;

export class ConfirmBox {
    constructor (x, y, text, callbackOK = () => {}, callbackCancel = () => {}) {
        this.$node = $(`
            <div class="pop-box" style="max-width: 370px;">
                <div class="content beauty-scroll text-center">${text}</div>
                <div class="button-row">
                    <button class="btn green">确定</button>
                    <button class="btn blue">取消</button>                
                </div>
            </div>
        `);

        //先隐藏放到dom里，计算出大小
        this.$node.hide();
        this.$node.appendTo($("body"));
        this.$node = $(".pop-box:last-child");
        let box_left = x, box_top = y;

        //默认x居中，y居中
        box_left = x - this.$node.outerWidth()/2;
        box_top = y  - this.$node.outerHeight()/2;


        //记录一下绝对位置，供滚动时调整位置用
        this.absolute_left = box_left;
        this.absolute_top = box_top;

        //点击阻止
        this.$node.click(function (e) {
            e.stopPropagation();
        });
        let that = this;
        /** 有BUG，暂时取消 **/
        // 窗口滚动跟随
        // this.windowScrollHandler = function () {
        //     that.$node.css({
        //         top: that.absolute_top - $(window).scrollTop(),
        //         left: that.absolute_left - $(window).scrollLeft()
        //     });
        // };
        // $(window).bind("scroll", this.windowScrollHandler);
        // 全屏点击移除，也相当于点击了取消
        this.windowClickHandler = function () {
            callbackCancel();
            that.remove();
        };
        $(window).bind("click", this.windowClickHandler);

        //然后显示
        this.$node.css({
            top: box_top - $(window).scrollTop(),
            left: box_left - $(window).scrollLeft()
        }).slideDown(ANIMATION_DUR);

        //两个按钮的点击事件
        this.$node.find("button.btn.green").click(function (e) {
            that.remove();
            callbackOK();
            e.stopPropagation();
        });
        this.$node.find("button.btn.blue").click(function (e) {
            that.remove();
            callbackCancel();
            e.stopPropagation();
        });
    }

    remove() {
        if(this.$node) {
            let $temp = this.$node;
            //马上设成null，防止点太快出BUG
            this.$node = null;
            $temp.slideUp(ANIMATION_DUR, function () {
                $temp.remove();
            });
            $(window)
                .unbind("click", this.windowClickHandler);
        }
    }

}
