<?php
include_once "./mysqlAll.php";//调用数据库处理函数


//获取当前整个干部职务的结构
$db = new mysql();

$res = array(
    "fixed" => [],
    "unfixed" => []
);

$sql = <<<SQL
SELECT
	zw_BMID AS group_id,
	zw_BMMC as group_name,
	zw_Order AS position_id,
	zw_Name AS position_name,
	bm.BM_FLAG AS group_flag,
	bm.BM_DESC AS `desc`
FROM
	bmzw
	LEFT JOIN bm ON bm.BM_ID = bmzw.zw_BMID
ORDER BY
	group_id,
	position_id
SQL;

$db->query($sql);
$r = null;
$lastGroupID = -1;
$lastFlag = 1;
while($row = $db->fetch_assoc()) {
    if($row['group_id'] != $lastGroupID) {
        if(!is_null($r)) {
            if($lastFlag == 1) array_push($res['fixed'], $r);
            else array_push($res['unfixed'], $r);
        }
        $lastGroupID = $row['group_id'];
        $lastFlag = $row['group_flag'];
        //新班子
        $r = array(
            "name" => $row['group_name'],
            "ID" => $row['group_id'],
            "desc" => $row['desc'],
            "items" => []
        );
    }
    //新position
    array_push($r['items'], array(
        "name" => $row['position_name'],
        "ID" => $row['position_id']
    ));
}

echo json_encode($res);