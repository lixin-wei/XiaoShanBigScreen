<?php
include_once "./mysqlAll.php";//调用数据库处理函数
$db = new mysql();
$id = intval($_GET['id']);
//房产地址、房产性质、房屋建筑面积、房产交易价格
$db->select("grygsxbg_fcqk", "FCJTDZ as address, FCXZ as type, FWJZMJ as area, FCJYJG as price, FCJYSJ as time", "BH = $id");

$res = array(
    "house" => [],
    "garage" => []
);
while($row = $db->fetch_assoc()) {
//    var_dump($row);
    if(strpos($row['type'], "车库") === false && strpos($row['type'], "车位") === false && strpos($row['type'], "储藏间") === false) {
        array_push($res['house'], $row);
    }
    else {
        array_push($res['garage'], $row);
    }
}

echo json_encode($res);