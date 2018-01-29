<?php
include_once "./mysqlAll.php";//调用数据库处理函数
$db = new mysql();
$db2 = new mysql();
$groupID = intval($_GET['groupID']);
//jobName
$db->query("SELECT GZID as ID FROM bmjg WHERE BMID = $groupID");

$res = [];
while($row = $db->fetch_assoc()) {
//    var_dump($row);
    $db2->query("SELECT ZW_NAME FROM bmzw WHERE BMID = $groupID AND GZID = {$row['ID']}");
    $jobName = "";
    while($rr = $db2->fetch_assoc()) {
        $jobName .= $rr['ZW_NAME']. " ";
    }
    $row['jobName'] = $jobName;
    array_push($res, $row);
}

echo json_encode($res);
