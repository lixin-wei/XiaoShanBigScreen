<?php
include_once "./mysqlAll.php";//调用数据库处理函数


//var_dump($_POST);
$IDList = $_POST['IDList'];
$db = new mysql();

$IDListStr = implode(",", $IDList);

$sql = <<<SQL
SELECT
	gbryqd.BH AS ID,
	CSNY AS birthday,
	XW AS eduBkg,
	gbryqd.XM AS `name`,
	ZP AS photo,
	ZZMM AS politicalStatus,
	XB AS sex,
	MAX( grjl.QSSJ ) AS recentJobTransferDate, #从个人简历表里获取最近一次经历的时间，作为最近调度时间
	FLAG AS flag,
	bm.BM_NAME AS groupName,
	#bmjg.zw_Name AS jobName,
	bmjg.BMID AS teamID,
	bmjg.GZID AS jobID 
FROM
	gbryqd
	LEFT JOIN grjl ON gbryqd.BH = grjl.BH
	LEFT JOIN bmjg ON gbryqd.BH = bmjg.BH
	LEFT JOIN bm ON bmjg.BMID = bm.BM_ID
WHERE
	gbryqd.BH IN ( $IDListStr ) 
GROUP BY
	gbryqd.BH, bmjg.BMID, bmjg.GZID, bm.BM_NAME
SQL;


$db->query($sql);

$res = array();
while($row = $db->fetch_assoc()) {
    $row['flag'] = intval($row['flag']);
    $res[$row['ID']] = $row;
}

echo json_encode($res);
