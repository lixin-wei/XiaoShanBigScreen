<?php
include_once "./mysqlAll.php";//调用数据库处理函数
$db = new mysql();
$groupID = intval($_GET['groupID']);
$db->select("bmzw", "zw_Order as ID, zw_Name as jobName", "zw_BMID = $groupID");

$res = [];
while($row = $db->fetch_assoc()) {
//    var_dump($row);
    array_push($res, $row);
}

echo json_encode($res);