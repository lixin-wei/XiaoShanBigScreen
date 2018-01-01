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
	bmzw.zw_BMMC AS groupName,
	bmzw.zw_Name AS jobName,
	bmzw.zw_BMID AS teamID,
	bmzw.zw_Order AS jobID 
FROM
	gbryqd
	LEFT JOIN grjl ON gbryqd.BH = grjl.BH
	LEFT JOIN bmzw ON gbryqd.BH = bmzw.zw_PersonID 
WHERE
	gbryqd.BH IN ( $IDListStr ) 
GROUP BY
	gbryqd.BH, bmzw.zw_BMID, bmzw.zw_Order, bmzw.zw_BMMC, bmzw.zw_Name
SQL;


$db->query($sql);

$res = array();
while($row = $db->fetch_assoc()) {
    $row['flag'] = intval($row['flag']);
    $res[$row['ID']] = $row;
}

echo json_encode($res);
