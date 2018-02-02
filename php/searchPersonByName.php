<?php
include_once "./mysqlAll.php";//调用数据库处理函数
$db = new mysql();

$res = [];

if(isset($_GET['name'])) {
    $name = $db->escape(trim($_GET['name']));
    if($name) {
        $db->select("gbryqd", "BH as ID, XM as name, XB as sex, CSNY as birthday", "XM is not null and (flag != 1 OR flag IS NULL) AND XM like '%$name%'", "", FALSE);

        while($row = $db->fetch_assoc()) {
            array_push($res, $row);
        }
    }
}

echo json_encode($res);
