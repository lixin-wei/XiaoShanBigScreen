<?php
include_once "./mysqlAll.php";//调用数据库处理函数
$db = new mysql();

$db->query("SELECT `key`, `value` FROM config");

$json = array();
$json['data'] = array();

while($row = $db->fetch_assoc()) {
    $json['data'][$row['key']] = $row['value'];
}

echo json_encode($json);
