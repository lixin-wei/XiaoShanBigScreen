<?php
include_once "./mysqlAll.php";//调用数据库处理函数


//以json字符串形式存下调度方案
$db = new mysql();

$json = $db->escape($_POST['json']);
$planName = $db->escape($_POST['planName']);
if(!$planName) {
    $planName = "未命名";
}
$sql = "INSERT INTO bigscreen_plan(name, json, date) VALUES ('$planName', '$json', now())";
$db->query($sql);
