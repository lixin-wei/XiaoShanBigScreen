<?php
include_once "./mysqlAll.php";//调用数据库处理函数

//输入调动方案ID，返回每个位置的人的ID，如果planID为-1，返回当前应用的方案
$planID = intval($_GET['ID']);
$db = new mysql();

$map = array();
if($planID == -1) {
    $sql = <<<SQL
    SELECT
        BMID AS group_id,
        GZID AS position_id,
        BH AS person_id
    FROM
        bmjg
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
else {
    $sql = <<<SQL
    SELECT json FROM bigscreen_plan WHERE ID = $planID
SQL;
    $map = json_decode($db->query($sql)->fetch_array()[0]);
}
echo json_encode($map);
