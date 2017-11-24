<?php
include_once "./mysqlAll.php";//调用数据库处理函数
ini_set("display_errors", "off");
$db = new mysql();
$id = intval($_GET['id']);


//先获取到所有经历过的地点
$db->select("grjl", "distinct JLDD", "BH = $id");
$places = [];
while($row = $db->fetch_row()) {
    array_push($places, $row[0]);
}

$jobs = array();
$names = array();
$pls = array();
//对于每个地点，找出所有同事
foreach ($places as $place) {
    $db->select("grjl", "BH,XM,JLDD,JLSQ", "JLDD = '$place'");
    while($row = $db->fetch_assoc()) {
        if($row['BH'] != $id) {
            if($jobs[$row['BH']])$jobs[$row['BH']] .= ", ";
            $jobs[$row['BH']] .= $row['JLSQ'];
            $pls[$row['BH']] = $row['JLDD'];
            $names[$row['BH']] = $row['XM'];
        }
    }
}
$res = [];
foreach ($names as $id => $name) {
    array_push($res, array(
        "name" => $name,
        "place" => $pls[$id],
        "jobs" => $jobs[$id]
    ));
}
echo json_encode($res);