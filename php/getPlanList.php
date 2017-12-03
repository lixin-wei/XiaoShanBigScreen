<?php
include_once "./mysqlAll.php";//调用数据库处理函数


//获取所有plan
$db = new mysql();

$sql = "SELECT ID, name, json, date FROM bigscreen_plan";

$res = [];
$db->query($sql);
while($row = $db->fetch_assoc()) {
    array_push($res, $row);
}

echo json_encode($res);