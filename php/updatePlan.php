<?php
include_once "./mysqlAll.php";//调用数据库处理函数


//更新调度方案
$db = new mysql();

$json = $db->escape($_POST['json']);
$planID = intval($db->escape($_POST['planID']));

$sql = "UPDATE bigscreen_plan set json = '$json', date = NOW() WHERE ID = $planID";
$db->query($sql);
