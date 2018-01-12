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
        $sql = "UPDATE bmzw set zw_PersonID = $pid WHERE zw_BMID = $i AND zw_Order = $j";
        array_push($sql_set, $sql);
        if($db->query($sql) === false) {
            $has_error = true;
        }
        $ok = true;
    }
}

$res = array(
    "result" => !$has_error && $ok,
    //"debug_plan" => $plan,
    //"debug_sql" => $sql_set
);

echo json_encode($res);
