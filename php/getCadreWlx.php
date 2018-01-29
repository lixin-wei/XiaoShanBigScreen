<?php
include_once "mysqlAll.php";
$BMID=$_REQUEST["BMID"];
$GZID=$_REQUEST["GZID"];

createJson($BMID,$GZID);

function getGwID($BMID,$GZID){
    $db = new mysql;
    $db->select("bmzw","ID","BMID=$BMID AND GZID=$GZID AND ISSET=1");
//    echo $db->getLastSQL();
    $result=$db->fetch_array();
    return $result;
}

function createJson($BMID,$GZID){
    $gwID=getGwID($BMID,$GZID);
//    var_dump($gwID);
    $gwSetting=getGwSetting($gwID["ID"]);
//    var_dump($gwSetting);
    $arr1=array();
    $arr2=array();
    $arr3=array();
    $arr4=array();
    $arr5=array();
    $arr6=array();
    $arrYX1=array();
    $arrYX2=array();

    $arrTemp1=array();

    if($gwSetting["gw_Setting"]!==null) {
        $arrOut1 = explode("f%g%f", $gwSetting["gw_Setting"]);
        //var_dump($arrOut1);
        foreach ($arrOut1 as $key1 => $value1) {
            $arrTemp2 = array();
            $arrOut2 = explode("=>", $value1);
            $arrOut3 = explode(";", $arrOut2[3]);
            $arrTemp4 = array();
            if (count($arrOut3) == 1 && strpos($arrOut2[3], "[") === false && strpos($arrOut2[3], ":") === false) {
                $arrTemp2 = array($arrOut2[2] => $arrOut2[3]);
            } else {
                foreach ($arrOut3 as $value3) {
                    $arrout4 = explode("_", $value3);
                    if (count($arrout4) === 2) {
                        $arrTemp5 = array();
                        $arrout41 = explode(":", $arrout4[0]);
                        $arrout42 = explode(":", $arrout4[1]);
                        $tempstr = str_replace("]", "", str_replace("[", "", $arrout41[1]));
                        $arrout6 = explode(",", $tempstr);
                        $arrTemp6 = array();
                        foreach ($arrout6 as $value5) {
                            array_push($arrTemp6, (int)$value5);
                        }

                        $arrTemp5 = array($arrout41[0] => $arrTemp6, $arrout42[0] => str_replace("(", "", str_replace(")", "", $arrout42[1])));
                        unset($arrTemp6);
                        array_push($arrTemp4, $arrTemp5);
                        unset($arrTemp5);
                    } else {
                        $arrTemp5 = array();
                        foreach ($arrout4 as $key4 => $value4) {
                            //echo $key4;
                            $arrout5 = explode(":", $value4);
                            if (count($arrout5) > 1) {
                                if (strpos($arrout5[1], "[") !== false) {
                                    $tempstr = str_replace("]", "", str_replace("[", "", $arrout5[1]));
                                    $arrout6 = explode(",", $tempstr);
                                    $arrTemp6 = array();
                                    foreach ($arrout6 as $value5) {
                                        array_push($arrTemp6, (int)$value5);
                                    }
                                    $arrTemp5 = array($arrout5[0] => $arrTemp6);
                                    unset($arrTemp6);
                                } elseif (strpos($arrout5[1], ",") !== false) {
                                    $tempstr = str_replace(")", "", str_replace("(", "", $arrout5[1]));
                                    $arrTemp5 = array($arrout5[0] => $tempstr);
                                } else {
                                    $arrTemp5 = array($arrout5[0] => (int)$arrout5[1]);

                                }
                                array_push($arrTemp4, $arrTemp5);
                            } else {
                                array_push($arrTemp5, $arrout5[0]);
                                array_push($arrTemp4, $arrTemp5);
                            }
                        }
                        unset($arrTemp5);
                    }
                }
                if ($arrOut2[5] != "") {
                    $arrTemp5 = array("上限" => (int)$arrOut2[5]);
                    array_push($arrTemp4, $arrTemp5);
                }
                unset($arrTemp5);
                $arrTemp2[$arrOut2[2]] = $arrTemp4;
            }

            if ($arrOut2[4] != "")
                $arrTemp2["权重"] = (int)$arrOut2[4];
            //print_r($arrTemp2);
            unset($arrTemp4);


            switch ($arrOut2[1]) {
                case "确定型":
                    array_push($arr1, $arrTemp2);
                    break;
                case "界限型":
                    array_push($arr2, $arrTemp2);
                    break;
                case "排除型":
                    array_push($arr3, $arrTemp2);
                    break;
                case "映射型（单项）":
                    array_push($arr4, $arrTemp2);
                    break;
                case "映射型（累计）":
                    array_push($arr5, $arrTemp2);
                    break;
                case "分值型":
                    array_push($arr6, $arrTemp2);
                    break;
                default:
                    break;
            }
            unset($arrTemp2);
            //}
        }
        //print_r($arrTemp2);
        if ($arr1 != NULL)
            $arrYX1["确定型"] = $arr1;
        if ($arr2 != NULL)
            $arrYX1["界限型"] = $arr2;
        if ($arr3 != NULL)
            $arrYX1["排除型"] = $arr3;
        if ($arr4 != NULL)
            $arrYX2["映射型（单项）"] = $arr4;
        if ($arr5 != NULL)
            $arrYX2["映射型（累计）"] = $arr5;
        if ($arr6 != NULL)
            $arrYX2["分值型"] = $arr6;
        //$gwSetArr=json_encode($str,JSON_UNESCAPED_UNICODE);
        //print_r($gwSetArr);

        $gwSetArr = array();
        $gwSetArr["硬性"] = $arrYX1;
        $gwSetArr["优选"] = $arrYX2;
        //print_r($gwSetArr);
        //$gwSetArr=json_encode($gwSetArr,JSON_UNESCAPED_UNICODE);

        //$gwSetArr=array();

    }else{
        $gwSetArr = array();
    }
        $bmSetting = getBMSetting($BMID);
        $gw_DP_Value = $gw_DP_Min = $gw_DP_Max = $gw_XB_Value = $gw_XB_Min = $gw_XB_Max = "";
        if (isset($bmSetting)) {
            foreach ($bmSetting as $index => $value) {
                if ($value["TJ_Desc"] == "中共党员" || $value["TJ_Desc"] == "其他党派") {
                    $gw_DP_Value = $value["TJ_Desc"];
                    $gw_DP_Min = $value["TJ_MinNum"];
                    $gw_DP_Max = $value["TJ_MaxNum"];
                } else {
                    $gw_XB_Value = $value["TJ_Desc"];
                    $gw_XB_Min = $value["TJ_MinNum"];
                    $gw_XB_Max = $value["TJ_MaxNum"];
                }
            }
        }
        $arrDP = array("党派人数" => array($gw_DP_Value => array((int)$gw_DP_Min, (int)$gw_DP_Max)));
        $arrXB = array("性别人数" => array($gw_XB_Value => array((int)$gw_XB_Min, (int)$gw_XB_Max)));
        $arrBM = array();
        array_push($arrBM, $arrDP);
        array_push($arrBM, $arrXB);
        $arrBmyq = array("部门编号" => (int)$BMID, "班子要求" => array("硬性" => array("界限型" => $arrBM)), "岗位要求" => $gwSetArr);

        $gwSetArr = json_encode($arrBmyq, JSON_UNESCAPED_UNICODE);
        print_r($gwSetArr);
}

function getBMSetting($BMID){
    $db=new mysql;
    $db->select("setting_bm","*","BMID=$BMID","",false);
    $result=array();
    while($row = $db->fetch_array()){
		//print_r($row);
        array_push($result,$row);
    }
    return $result;
}
function getGwSetting($gwID){
    $db=new mysql;
    //var_dump($gwID);
    $db->select("bmzw LEFT JOIN setting_gw ON ID=gw_ID","ID,BMID,ZW_NAME,gw_Setting","gw_ID=$gwID","ID=$gwID",false);
    $result=$db->fetch_array();
    return $result;
}

?>