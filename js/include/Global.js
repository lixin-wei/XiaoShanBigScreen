window.$ = window.jQuery = require("jquery");
export const PERSON_PHOTO_ROOT = "images/photos/";
export const STREET_PHOTO_ROOT = "images/street/";
export const PYTHON_SERVER_ROOT = "http://localhost:5000/";
// export const PYTHON_SERVER_ROOT = "http://192.168.0.10:5000/";
export const CELL_EMPTY_ALPHA = "+";

export let $box_list = $("#mid_col3_body_list");
export let $box_trash = $("#mid_col3_box_trash");
export let $de_tree_label_list = $(".tree-label.purple");
export let $cai_tree_label_list = $(".tree-label.blue, .tree-label.orange");
export let $achievement_label = $("#tree_green_label_1");
export let $lack_label = $("#tree_grey_label_1");
export let $person_info_container = $("#foot_col3_photo_container");

//当前拖动中的人
export let floating_person = null;
export function setFloatingPerson(person) {
    floating_person = person;
}
export function getFloatingPerson() {
    return floating_person;
}

//选中的人
export let showing_person_id = null;
export function setShowingPersonID(ID) {
    showing_person_id = ID;
}
export function getShowingPersonID() {
    return showing_person_id;
}

//鼠标下的cell
export let $active_cell = null;
export function setActiveCell($cell) {
    $active_cell = $cell;
}
export function getActiveCell() {
    return $active_cell;
}

//鼠标下的PK台位
export let $active_stage = null;
export function setActiveStage($stage) {
    $active_stage = $stage;
}
export function getActiveStage() {
    return $active_stage
}
