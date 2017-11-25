<?php
include_once "./mysqlAll.php";//调用数据库处理函数
//ini_set("display_errors", "off");
$db = new mysql();
$id = intval($_GET['id']);


//先获取到所有经历过的地点
$db->select("grjl", "QSSJ, ZZSJ, JLDD, JLSQ", "BH = $id", "QSSJ");
$experiences = [];
while($row = $db->fetch_assoc()) {
    //去掉在校经历
    if(strpos($row['JLSQ'], "学习") === false && strpos($row['JLSQ'], "培训") === false && strpos($row['JLSQ'], "学生") === false)
        array_push($experiences, $row);
}


$res = [];
//对于每条经历，找出时间区间内的所有同事
foreach ($experiences as $exp) {
    $condition1 = $exp['ZZSJ'] ? "QSSJ>\"{$exp['ZZSJ']}\"" : "1";
    $condition2 = $exp['QSSJ'] ? "ZZSJ<\"${exp['QSSJ']}\"" : "1";

    $db->select("grjl", "XM, JLSQ", "NOT($condition1 OR $condition2) AND JLDD = \"{$exp['JLDD']}\"");
    $item = array(
        "begin_time" => $exp['QSSJ'],
        "end_time" => $exp['ZZSJ'],
        "place" => $exp['JLDD'],
        "job" => $exp['JLSQ'],
        "colleagues" => []
    );
    while($row = $db->fetch_assoc()) {
        array_push($item['colleagues'], array(
            "name" => $row['XM'],
            "job" => $row['JLSQ']
        ));
    }
    array_push($res, $item);
}

echo json_encode($res);