<?php
	include_once "./mysqlAll.php";//调用数据库处理函数
	$BM_FLAG=$_REQUEST['BM'];
	function clear_arr(&$t){//清除数组内的全部元素（此处用作清除暂存数组内容用）
		while($t){
			array_pop($t);
			}
		}
	$arrZJ=array();
	$tempColTitle=array();
	if($BM_FLAG==1){
		
		$db = new mysql;
		$db->select("bmzw","zw_Name","zw_BMID=1 and zw_Order!=5 and zw_Order!=6","",False);
		$nums=$db->db_num_rows();
		$i=0;
		while($i<$nums){
			$temp=$db->fetch_row();
			array_push($tempColTitle,$temp[0]);
			$i=$i+1;
		}
	}
	
	$tempRows=array();
	$tempItems=array();
	$tempFlags=array();
	$tempRowTitle;
	$db = new mysql;
	if($BM_FLAG==1)
	$db->select("bm LEFT JOIN bmzw on BM_ID=zw_BMID LEFT JOIN gbryqd ON zw_PersonID = BH","BM_ID,BM_NAME,zw_Order,zw_Name,BH,XM,XRZW,XB,CSNY,XLZC,ZZMM,ZP,BM_DESC","BM_FLAG=$BM_FLAG and zw_Order<>5 and zw_Order<>6","BM_ID,zw_Order",FALSE);
	else
	$db->select("bm LEFT JOIN bmzw on BM_ID=zw_BMID LEFT JOIN gbryqd ON zw_PersonID = BH","BM_ID,BM_NAME,zw_Order,zw_Name,BH,XM,XRZW,XB,CSNY,XLZC,ZZMM,ZP,BM_DESC","BM_FLAG=$BM_FLAG","BM_ID,zw_Order",FALSE);
	
	
	$nums=$db->db_num_rows();
	$k=0;
	$flag=0;
	$zjName="";
	$desc ="";
	while($k<$nums){
		$temp=$db->fetch_row();
		if($flag!=0 && $flag!=$temp[0]){
			$tempRowTitle=$zjName;
			array_push($tempRows,array(
				"rowTitle"=>$tempRowTitle,
                "groupID" => $flag,
				"desc" => $desc,
				"items"=>$tempItems
			));
			clear_arr($tempItems);
		}
		$flag=$temp[0];
		$zjName=$temp[1];
        $desc = $temp[12];
		if($temp[4]!=null){
		  clear_arr($tempFlags);
		  array_push($tempFlags,array(1,2,3));//根据实际情况调整
		  array_push($tempItems,array(
			  "ID"=>$temp[4],
			  "name"=>$temp[5],
			  "sex"=>$temp[7],
			  "birthday"=>$temp[8],
			  "politicalStatus"=>$temp[10],
			  "positionID"=>$temp[0],
			  "jobID"=>$temp[2],
			  "job"=>$temp[3],
			  "eduBkg"=>$temp[9],
			  "photo"=>$temp[11],
			  "flags"=>$tempFlags
		  ));
		}else{
		  array_push($tempItems,array(
			  "ID"=>-1
		  ));
		}
		//echo json_encode($tempItems,JSON_UNESCAPED_UNICODE);
		//echo"---";
		$k=$k+1;
	}

	
	array_push($arrZJ,array(
		"colTitle"=>$tempColTitle,
		"rows"=>$tempRows
    ));
	echo json_encode($arrZJ,JSON_UNESCAPED_UNICODE);
?>