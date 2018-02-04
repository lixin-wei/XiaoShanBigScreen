<?php
include_once "./mysqlAll.php";//调用数据库处理函数
//ini_set("display_errors", "off");
$db = new mysql();
$id = intval($_GET['ID']);


//先获取到所有经历过的地点
$db->select("grjl", "QSSJ, ZZSJ, JLDD, JLSQ", "BH = $id", "QSSJ");
$experiences = [];
while($row = $db->fetch_assoc()) {
    //去掉在校经历和在家待业
    if(
        strpos($row['JLSQ'], "学习") === false
        && strpos($row['JLSQ'], "培训") === false
        && strpos($row['JLSQ'], "进修") === false
        && strpos($row['JLSQ'], "学生") === false
        && strpos($row['JLSQ'], "学员") === false
        && strpos($row['JLDD'], "在家") === false
    ) {
        array_push($experiences, $row);
    }
}


$res = [];
$sql_set = [];
//对于每条经历，找出时间区间内的所有同事
foreach ($experiences as $exp) {
    $condition1 = $exp['ZZSJ'] ? "(QSSJ IS NOT NULL AND QSSJ>\"{$exp['ZZSJ']}\")" : "0";
    $condition2 = $exp['QSSJ'] ? "(ZZSJ IS NOT NULL AND ZZSJ<\"${exp['QSSJ']}\")" : "0";

    $sql = <<<SQL
        SELECT grjl.BH, gbryqd.XM, JLSQ
        FROM grjl
        LEFT JOIN gbryqd ON grjl.BH = gbryqd.BH
        WHERE NOT($condition1 OR $condition2) AND JLDD = '{$exp['JLDD']}'
        ORDER BY QSSJ
SQL;
    $db->query($sql);
    array_push($sql_set, $db->getLastSQL());
    $jobList = array();
    //对当前地点，与其时间有交集的，所有人的经历
    while($row = $db->fetch_assoc()) {
        //排除自己
        if($row['BH'] == $id) continue;
        $name = $row['XM'];
        $job = $row['JLSQ'];
        //统计期间所有职务
        if(!isset($jobList[$name])) $jobList[$name] = [];
        array_push($jobList[$name], $job);
    }
    $colleagues = [];
    foreach ($jobList as $name => $jobs) {
        array_push($colleagues, array(
            "name" => $name,
            "jobs" => $jobs
        ));
    }
    if(count($jobList) != 0) {
        $item = array (
            "begin_time" => $exp['QSSJ'],
            "end_time" => $exp['ZZSJ'],
            "place" => $exp['JLDD'],
            "job" => $exp['JLSQ'],
            "colleagues" => $colleagues
        );
        array_push($res, $item);
    }
}

$return = array(
    "res" => $res,
    //"debug" => $experiences,
    //"debug2" => $sql_set
);
echo json_encode($return);
