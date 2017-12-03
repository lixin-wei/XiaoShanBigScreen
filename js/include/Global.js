window.$ = window.jQuery = require("jquery");
export const PERSON_PHOTO_ROOT = "images/photos/";
export const STREET_PHOTO_ROOT = "images/street/";
export const PERSON_INFO_API_URL = "http://localhost:5000/summary";


export let $box_list = $("#mid_col3_body_list");
export let $box_trash = $("#mid_col3_box_trash");
export let $de_tree_label_list = $(".tree-label.purple");
export let $cai_tree_label_list = $(".tree-label.blue, .tree-label.orange");
export let $lack_label = $("#tree_grey_label_1");
export let $person_info_container = $("#foot_col3_photo_container");
export let floating_person = null;
export let showing_person_id = null;
export let $active_cell = null;
export let $active_stage = null;


//计划表，[班子ID][职位ID] -> 人ID
export let planMap = null;
//整个职位表，用来建表格用
export let positionStc = null;

//调动记录
export let transLog = [];