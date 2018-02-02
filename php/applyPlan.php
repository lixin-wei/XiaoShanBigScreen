<?php
include_once "./mysqlAll.php";//调用数据库处理函数


//更新调度方案
$db = new mysql();

$plan = json_decode($_POST['plan']);

$has_error = false;
$ok = false;
$sql_set = [];
foreach ($plan as $i => $row) {
    foreach ($row as $j => $pid) {
        if($pid == null) $pid = "NULL";
        $sql = "UPDATE bmjg set BH = $pid WHERE BMID = $i AND GZID = $j";
        array_push($sql_set, $sql);
        $db->query($sql);
        if($db->has_error())break;
        $ok = true;
    }
    if($db->has_error())break;
}

$res = array(
    "result" => !$db->has_error() && $ok,
    //"debug_plan" => $plan,
    //"debug_sql" => $sql_set
);

echo json_encode($res);
