<?php
include_once "./mysqlAll.php";//调用数据库处理函数
session_start();

//获取所有plan
$db = new mysql();


$sql = <<<SQL
SELECT ID, name, json, date
FROM plan_belong LEFT JOIN bigscreen_plan
ON plan_belong.PLAN_ID = bigscreen_plan.ID
WHERE plan_belong.USERNAME = '{$_SESSION['username']}'
ORDER BY date DESC
SQL;

$res = [];
$db->query($sql);
while($row = $db->fetch_assoc()) {
    array_push($res, $row);
}

echo json_encode($res);
