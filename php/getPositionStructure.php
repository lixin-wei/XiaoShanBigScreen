<?php
include_once "./mysqlAll.php";//调用数据库处理函数


//获取当前整个干部职务的结构
$db = new mysql();
$db2 = new mysql();

$res = array(
    "fixed" => [],
    "unfixed" => []
);

$sql = <<<SQL
SELECT
	BMID AS group_id,
	BM_NAME AS group_name,
	GZID AS position_id,
	bm.BM_FLAG AS group_flag,
	bm.BM_DESC AS `desc`
FROM
	bmjg
	LEFT JOIN bm ON bm.BM_ID = bmjg.BMID
WHERE bmjg.ISSHOW = 1
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
    //拼接当前格子所有职位
    $db2->query("SELECT ZW_NAME FROM bmzw WHERE BMID = {$row['group_id']} AND GZID = {$row['position_id']}");
    $position_name = "";
    while($rr = $db2->fetch_assoc()) {
        $position_name .= $rr['ZW_NAME'] . " ";
    }
    array_push($r['items'], array(
        "name" => $position_name,
        "ID" => $row['position_id']
    ));
}
if($lastFlag == 1) array_push($res['fixed'], $r);
else array_push($res['unfixed'], $r);

echo json_encode($res);
