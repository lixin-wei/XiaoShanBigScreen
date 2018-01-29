<?php
include_once "./mysqlAll.php";//调用数据库处理函数
session_start();

if(!isset($_SESSION['username'])) exit(0);

//以json字符串形式存下调度方案
$db = new mysql();

$json = $db->escape($_POST['json']);
$planName = $db->escape($_POST['planName']);
if(!$planName) {
    $planName = "未命名";
}

$sql = "INSERT INTO bigscreen_plan(name, json, date) VALUES ('$planName', '$json', now())";
$db->query($sql);

$plan_id = $db->insert_id();

//顺便给自己加一条从属关系
$db->query("INSERT INTO plan_belong (PLAN_ID, USERNAME) VALUES ($plan_id, '{$_SESSION['username']}')");

echo $plan_id;