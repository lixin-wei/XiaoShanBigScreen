<?php
include_once "./mysqlAll.php";//调用数据库处理函数
$db = new mysql();
$id = intval($_GET['id']);
//房产地址、房产性质、房产交易价格
$db->select("grygsxbg_fcqk", "FCJTDZ as address, FCXZ as type, FCJYJG as price", "BH = $id");

$res = [];
while($row = $db->fetch_assoc()) {
//    var_dump($row);
    if(strpos($row['type'], "车库") === false && strpos($row['type'], "车位") === false) {
        array_push($res, $row);
    }
}

echo json_encode($res);