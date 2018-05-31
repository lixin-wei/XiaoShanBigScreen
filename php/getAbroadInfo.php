<?php
include_once "./mysqlAll.php";//调用数据库处理函数
$db = new mysql();
$id = intval($_GET['ID']);
$db->select("grygsxbg_yscgqk", "QSRQ, ZZRQ, SDGJ, SY", "BH = $id");

$res = [];

while($row = $db->fetch_row()) {
    array_push($res, $row);
}

echo json_encode($res);
