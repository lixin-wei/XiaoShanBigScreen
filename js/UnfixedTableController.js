export class UnfixedTableController {
    constructor ($table, max_col = 7) {
        this.$table = $table;
        this.$lastLine = null;
        this.max_col = max_col;
        this.col = 0;
        this.is_pad = false;
    }
    applyLine () {
        if(this.$last_line) {
            //补齐当前行
            while(this.col < this.max_col) {
                this.addDisabledCell();
            }
            this.$table.append(this.$last_line);
        }
        this.$last_line = null;
        this.col = 0;
    }
    finishBlock () {
        this.is_pad = false;
    }
    newLine () {
        this.applyLine();
        this.$last_line = $(`<div class='table-row' />`);
        if(this.is_pad) {
            this.addDisabledCell();
        }
    }
    addCellWithClass(text, class_str, col_weight = 1) {
        if(this.col >= this.max_col) {
            this.newLine();
        }
        this.col += col_weight;
        let $cell = $(`<div class='${class_str}' />`).text(text);
        this.$last_line.append($cell);
        return $cell;
    }
    addCell(text) {
        return this.addCellWithClass(text, "cell thin");
    }
    addTitleCell(text) {
        this.is_pad = true;
        return this.addCellWithClass(text, "cell thin title-row", 1);
    }
    addDisabledCell() {
        return this.addCellWithClass("", "cell thin disabled");
    }
}
