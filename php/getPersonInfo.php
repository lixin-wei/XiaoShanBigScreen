<?php
include_once "./mysqlAll.php";//调用数据库处理函数


//var_dump($_POST);
$IDList = $_POST['IDList'];
$db = new mysql();

$IDListStr = implode(",", $IDList);

//TODO: 现任职务改成动态生成
$sql = <<<SQL
SELECT 
  BH as ID,
  CSNY as birthday,
  XW as eduBkg,
  XM as name,
  ZP as photo,
  ZZMM as politicalStatus,
  XB as sex
FROM gbryqd 
WHERE BH in ($IDListStr)
SQL;


$db->query($sql);

$res = array();
while($row = $db->fetch_assoc()) {
    $res[$row['ID']] = $row;
}

echo json_encode($res);
