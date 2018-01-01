import * as G from "./include/Global";

let $table = $("#table_left");
let $last_line = null;
export function applyLine () {
    if($last_line) {
        $table.append($last_line);
    }
    $last_line = null;
}
export function newLine () {
    applyLine();
    $last_line = $(`<div class='table-row' />`);
}
export function addCell(text) {
    if(!text) {
        text = G.CELL_EMPTY_ALPHA;
    }
    let $cell = $("<div class='cell' />").text(text);
    $last_line.append($cell);
    return $cell;
}
export function addRowTitleCell(text) {
    let $cell = $("<div class='cell title-row' />").text(text);
    $last_line.append($cell);
    return $cell;
}
export function addColTitleCell(text) {
    let $cell = $("<div class='cell title-col' />").text(text);
    $last_line.append($cell);
    return $cell;
}
export function addImportantCell(text) {
    let $cell = $("<div class='cell important' />").text(text);
    $last_line.append($cell);
    return $cell;
}
export function addEmptyCell() {
    let $cell = $("<div class='cell empty' />");
    $last_line.append($cell);
    return $cell;
}

export function clear() {
    $table.empty();
}