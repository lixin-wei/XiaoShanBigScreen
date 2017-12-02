<?php
include_once "./mysqlAll.php";//调用数据库处理函数


$IDList = json_decode($_POST['IDList']);
$db = new mysql();

$IDListStr = implode(",", $IDList);
$sql = "SELECT * FROM gbryqd WHERE BH in ($IDListStr)";

$res = $db->query($sql);

$return = [];
while($row = $res->fetch_assoc()) {
    array_push($return, $row);
}

echo json_encode($return);
