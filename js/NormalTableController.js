export class NormalTableController {
    constructor () {
        this.$table = $("#table_left");
        this.$last_line = null;
    }
    applyLine () {
        if(this.$last_line) {
            this.$table.append(this.$last_line);
        }
        this.$last_line = null;
    }
    newLine () {
        this.applyLine();
        this.$last_line = $(`<div class='table-row' />`);
    }
    addCell(text) {
        let $cell = $("<div class='cell' />").text(text);
        this.$last_line.append($cell);
        return $cell;
    }
    addRowTitleCell(text) {
        let $cell = $("<div class='cell title-row' />").text(text);
        this.$last_line.append($cell);
        return $cell;
    }
    addColTitleCell(text) {
        let $cell = $("<div class='cell title-col' />").text(text);
        this.$last_line.append($cell);
        return $cell;
    }
}
