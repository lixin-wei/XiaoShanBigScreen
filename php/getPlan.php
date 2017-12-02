<?php
include_once "./mysqlAll.php";//调用数据库处理函数

//输入调动方案ID，返回每个位置的人的ID，如果planID为-1，返回当前应用的方案
$planID = $_GET['ID'];
$db = new mysql();

$map = array();
if($planID == -1) {
    $sql = <<<SQL
    SELECT
        zw_BMID AS group_id,
        zw_BMMC as group_name,
        zw_Order AS position_id,
        zw_Name AS position_name,
        zw_PersonID AS person_id
    FROM
        bmzw
    ORDER BY
        group_id,
        position_id
SQL;
    $db->query($sql);
    while($row = $db->fetch_assoc()) {
        if(!isset($map[$row['group_id']])) $map[$row['group_id']] = array();
        $map[$row['group_id']][$row['position_id']] = $row['person_id'];
    }
}
echo json_encode($map);