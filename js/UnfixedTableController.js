
let $tableSet = $("#mid_col2").find("div[id^=mid_col2] .table-container");
let curTable = 0;
let $lastLine = null;
let row = 0, col = 0, MAX_ROW = 23, MAX_COL = 7;
let isPad = false;
export function applyLine () {
    // console.log(`row: ${row }`);
    if(curTable >= $tableSet.length) {
        col = 0;
        return;
    }
    if($lastLine) {
        //补齐当前行
        while(col < MAX_COL) {
            addDisabledCell();
        }
        // console.log(`curTable: ${curTable}`);
        $($tableSet[curTable]).append($lastLine);
    }
    col = 0;
    row++;
    if(row === MAX_ROW) {
        row = 0;
        curTable++;
    }
    $lastLine = null;
}
export function finishBlock () {
    isPad = false;
}
export function newLine () {
    if($lastLine) applyLine();
    $lastLine = $(`<div class='table-row' />`);
    if(isPad) {
        addEmptyCell();
    }
}
export function addCellWithClass(text, class_str, col_weight = 1) {
    if(col >= MAX_COL) {
        newLine();
    }
    col += col_weight;
    let $cell = $(`<div class='${class_str}' />`).text(text);
    $lastLine.append($cell);
    return $cell;
}
export function  addCell(text) {
    return addCellWithClass(text, "cell thin");
}
export function  addTitleCell(text) {
    isPad = true;
    return addCellWithClass(text, "cell thin title-row", 1);
}
export function addDisabledCell() {
    return addCellWithClass("", "cell thin disabled");
}
export function addEmptyCell() {
    return addCellWithClass("", "cell thin empty");
}