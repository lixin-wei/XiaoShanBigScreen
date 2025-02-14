<?php
//session_start();
//if(!isset($_SESSION['username'])) {
//    echo "请先登录！";
//    exit(0);
//}

include_once "php/mysqlAll.php";//调用数据库处理函数
$db = new mysql();

$db->query("SELECT `key`, `value` FROM config");

$config = array();

while($row = $db->fetch_assoc()) {
    $config[$row['key']] = $row['value'];
}


?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <title></title>
    <!--<link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">-->
    <link rel="stylesheet" href="lib/font-awesome/scss/font-awesome.css">
    <link rel="stylesheet" href="scss/index.css">
</head>
<body class="noselect">
<div id="main_container">
    <div id="loadingLayer" class="flex justify-content-center align-items-center">
        <i class="fa fa-circle-o-notch fa-3x fa-fw"></i>
        <div></div>
    </div>
    <div id="head">
        <div id="system_title">
            <?php echo $config['SYSTEM_TITLE']?>
        </div>
        <div id="head_right_button_group">
            <div id="plan_name">*当前计划：2017秋模拟调动A计划</div>
            <span>
                <input type="checkbox" id="cb_line_layer" checked />
                <label for="cb_line_layer">显示调度线</label>
            </span>
            <button id="plan_save" class="btn shine-blue large"><i class="fa fa-save"></i>保存方案</button>
            <button id="plan_save_as" class="btn shine-blue large"><i class="fa fa-files-o"></i>方案另存为</button>
            <button id="plan_diff" class="btn shine-blue large"><i class="fa fa-file-o"></i>任免方案</button>
<!--            <button id="plan_share" class="btn shine-blue large"><i class="fa fa-share"></i>分享方案</button>-->
            <img src="images/splitter.png" alt="" height="40">
            <button id="plan_apply" class="btn green large"><i class="fa fa-upload"></i>应用方案</button>
            <img src="images/splitter.png" alt="" height="40">
<!--            <button class="btn shine-blue large"><i class="fa fa-backward"></i>退回首页</button>-->
        </div>
    </div>
    <div id="mid">
        <!--div.table-row>div.cell.title-col*8>{列标题}-->
        <!--(div.table-row>(div.cell.title-row>{行标题})+(div.cell*16)>{测试文本})*21-->
        <div id="mid_col1">
            <div class="table-container" id="table_left">
            </div>
        </div>
        <div id="mid_col2">
            <div id="mid_col2_col1">
                <div class="table-container" id="table_right1">
                </div>
            </div>
            <div id="mid_col2_col2">
                <div class="table-container" id="table_right2">
                </div>
            </div>
            <div id="mid_col2_col3">
                <div class="table-container" id="table_right3">
                </div>
            </div>
            <div id="mid_col2_col4">
                <div class="table-container" id="table_right4">
                </div>
            </div>
            <div id="mid_col2_col5">
                <div class="table-container" id="table_right5">
                </div>
            </div>
            <div id="mid_col2_col6">
                <div class="table-container" id="table_right6">
                </div>
            </div>
        </div>
        <div id="mid_col3">
            <div id="mid_col3_header">
                <div class="title-bar vertical orange"></div>
                <?php echo $config['CANDIDATE_FIELD_TITLE']?>
                <div id="mid_col3_header_right">
                    <button class="btn orange large" id="btnMatch"><i class="fa fa-group"></i>智能选配</button>
                    <button class="btn green large" id="btnAddPerson"><i class="fa fa-plus"></i>添加候选人</button>
                </div>
            </div>
            <div id="mid_col3_body">
                <div id="mid_col3_body_list" class="beauty-scroll">
                </div>
                <div id="mid_col3_box_trash">

                </div>
            </div>
        </div>
    </div>
    <div id="foot">
        <div id="foot_col1">
            <div id="foot_col1_title_row">
                <div id="foot_col1_title_box">
                    全区干部构成结构图
                </div>
            </div>
            <div id="chart_container">
                <div id="chart_sex" style="width: 320px; height: 160px; display: inline-block;"></div>
                <div id="chart_edu" style="width: 320px; height: 160px; display: inline-block;"></div>
                <div id="chart_age" style="width: 320px; height: 160px; display: inline-block;"></div>
                <div id="chart_grp" style="width: 320px; height: 160px; display: inline-block;"></div>
            </div>
        </div>
        <div id="foot_col2">
            <div id="foot_col2_header">
                <div class="title-bar horizontal green"></div>
                <div class="text-vertical content-center width-fill"><?php echo $config['GROUP_FIELD_TITLE']?></div>
            </div>
            <div class="photo photo-square" id="group_photo">
                <img src="" alt="" class="fit-height">
            </div>
            <div id="group_name"></div>
            <div id="group_description">
            </div>
            <div class="legend-box flex flex-column justify-content-center">
                <div class="text-blue flex align-items-center"><img src="images/dot-blue.png" alt="img">替换前</div>
                <div class="text-green flex align-items-center"><img src="images/dot-green.png" alt="img">替换后</div>
            </div>
            <div id="detail_container_left" class="flex flex-column space-content-between">
                <div class="row">
                    <div class="col-5 text-right">班子成员数：</div>
                    <div class="col-7"><span class="text-blue"></span><span class="text-green"></span></div>
                </div>
                <div class="row">
                    <div class="col-5 text-right">最近调动时间：</div>
                    <div class="col-7"><span class="text-blue"></span><span class="text-green"></span></div>
                </div>
                <!--<div class="row">-->
                    <!--<div class="col-5 text-right">最近调动人数：</div>-->
                    <!--<div class="col-7"><span class="text-blue"></span><span class="text-green"></span></div>-->
                <!--</div>-->
                <div class="row">
                    <div class="col-5 text-right">平均年龄：</div>
                    <div class="col-7"><span class="text-blue"></span><span class="text-green"></span></div>
                </div>
                <div class="row">
                    <div class="col-5 text-right">后备干部：</div>
                    <div class="col-7"><span class="text-blue"></span><span class="text-green"></span></div>
                </div>
                <div class="row">
                    <div class="col-5 text-right">党外干部：</div>
                    <div class="col-7"><span class="text-blue"></span><span class="text-green"></span></div>
                </div>
                <div class="row">
                    <div class="col-5 text-right">女干部：</div>
                    <div class="col-7"><span class="text-blue"></span><span class="text-green"></span></div>
                </div>
            </div>
            <div id="detail_container_right">
                <div class="row flex space-content-between">
                    <div class="col-5 text-right">一把手作用：</div>
                    <div class="col-7"><div class="text-blue hover-white"></div></div>
                </div>
                <div class="row flex space-content-between">
                    <div class="col-5 text-right">团队协作：</div>
                    <div class="col-7"><div class="text-blue hover-white"></div></div>
                </div>
                <div class="row flex space-content-between">
                    <div class="col-5 text-right">整体战斗力：</div>
                    <div class="col-7"><div class="text-blue hover-white"></div></div>
                </div>
                <!--<div class="row flex space-content-between">-->
                    <!--<div class="col-5 text-right">违法违纪：</div>-->
                    <!--<div class="col-7"><span class="text-blue"></span></div>-->
                <!--</div>-->
                <!--<div class="row flex space-content-between">-->
                    <!--<div class="col-5 text-right">通查通报：</div>-->
                    <!--<div class="col-7"><span class="text-blue"></span></div>-->
                <!--</div>-->
                <div class="row flex space-content-between">
                    <div class="col-5 text-right">存在问题：</div>
                    <div class="col-7"></div>
                </div>
            </div>
        </div>
        <div id="foot_col3">
            <div id="foot_col3_header">
                <div class="title-bar horizontal blue"></div>
                <div class="text-vertical content-center width-fill"><?php echo $config['PERSON_DETIAL_FIELD_TITLE']?></div>
            </div>
            <div id="foot_col3_photo_container" class="flex flex-column space-content-around align-items-center">
                <div class="photo photo-large">
                    <img src="" alt="">
                </div>
                <div class="name"></div>
                <div class="info1"></div>
                <div class="info2"></div>
                <div class="flex space-content-around">
                    <button class="btn light-blue" id="btn_family_net"><i class="fa fa-object-group"></i>亲属网</button>
                    <button class="btn light-blue" id="btn_colleague"><i class="fa fa-user-circle-o"></i>历届同事</button>
                </div>
                <div class="flex space-content-around">
                    <button class="btn light-blue" id="btn_abroad"><i class="fa fa-plane"></i>出境情况</button>
                    <button class="btn light-blue" id="btn_house_info"><i class="fa fa-home"></i>房产情况</button>
                </div>
            </div>
            <img src="images/splitter.png" alt="img" id="splitter">
            <img src="images/tree-blue.png" alt="img" id="tree_blue">
            <img src="images/tree-green.png" alt="img" id="tree_green">
            <div class="tree-label purple" id="tree_purple_label_1">
                <div class="tree-label-content">担当克难</div>
            </div>
            <div class="tree-label purple" id="tree_purple_label_2">
                <div class="tree-label-content">担当克难</div>
            </div>
            <div class="tree-label purple" id="tree_purple_label_3">
                <div class="tree-label-content">担当克难</div>
            </div>
            <div class="tree-label purple" id="tree_purple_label_4">
                <div class="tree-label-content">担当克难</div>
            </div>
            <div class="tree-label purple" id="tree_purple_label_5">
                <div class="tree-label-content">担当克难</div>
            </div>
            <div class="tree-label purple" id="tree_purple_label_6">
                <div class="tree-label-content">担当克难</div>
            </div>
            <div class="tree-label purple" id="tree_purple_label_7">
                <div class="tree-label-content">担当克难</div>
            </div>
            <div class="tree-label purple" id="tree_purple_label_8">
                <div class="tree-label-content">担当克难</div>
            </div>
            <div class="tree-label purple" id="tree_purple_label_9">
                <div class="tree-label-content">担当克难</div>
            </div>
            <div class="tree-label purple" id="tree_purple_label_10">
                <div class="tree-label-content">担当克难</div>
            </div>

            <div class="tree-label blue" id="tree_blue_label_1">
                <div class="tree-label-content">综合素质</div>
            </div>
            <div class="tree-label blue" id="tree_blue_label_2">
                <div class="tree-label-content">综合素质</div>
            </div>
            <div class="tree-label blue" id="tree_blue_label_3">
                <div class="tree-label-content">综合素质</div>
            </div>
            <div class="tree-label blue" id="tree_blue_label_4">
                <div class="tree-label-content">综合素质</div>
            </div>
            <div class="tree-label blue" id="tree_blue_label_5">
                <div class="tree-label-content">综合素质</div>
            </div>
            <div class="tree-label blue" id="tree_blue_label_6">
                <div class="tree-label-content">综合素质</div>
            </div>

            <div class="tree-label orange" id="tree_orange_label">
                <div class="tree-label-content">建设</div>
            </div>

            <div class="tree-label grey" id="tree_grey_label_1">
                <div class="tree-label-content">不足</div>
            </div>

            <div class="tree-label green" ID="tree_green_label_1">
                <div class="tree-label-content">工作业绩</div>
            </div>
            <!--<div class="tree-label green" ID="tree_green_label_2">-->
                <!--<div class="tree-label-content">纪检</div>-->
            <!--</div>-->

            <div id="label_de">徳</div>
            <div id="label_cai">才</div>
            <!--<div ID="label_buzu">不足</div>-->
            <!--<div ID="label_shiyigangwei">适宜岗位</div>-->
        </div>
        <div id="foot_col4">
            <div id="foot_col4_header">
                <div class="title-bar horizontal red"></div>
                <div class="text-vertical content-center width-fill"><?php echo $config['PK_FIELD_TITLE']?></div>
            </div>
            <div class="photo-col" id="photo_col_left">
                <div class="photo">
                    <img src="" alt="">
                </div>
                <div class="photo-col-name">---</div>
                <button class="btn blue"><i class="fa fa-file-text"></i>个人信息</button>
                <!--<button class="btn blue"><i class="fa fa-edit"></i>配置本岗位</button>-->
                <button class="btn light-blue"><i class="fa fa-trash"></i>离开PK</button>
            </div>
            <!--顶部pk条 start-->
            <div id="score_left"></div>
            <div class="total-bar total-bar-revert" id="total_bar_left">
                <div class="total-bar-thumb" style="width: 100%"></div>
            </div>
            <img src="images/pk.png" alt="pk" id="img_pk">

            <div id="score_right"></div>
            <div class="total-bar" id="total_bar_right">
                <div class="total-bar-thumb" style="width: 100%"></div>
            </div>
            <div class="person-detail" id="person_detail_left"></div>
            <div class="person-detail" id="person_detail_right"></div>
            <!--顶部pk条 end-->
            <!--工作业绩  个性特点  群众基础  分类考核  不足与风险  能力类型  专业特长  工作作风  适宜岗位-->
            <div id="foot_col4_job" class="text-blue">
                选择岗位
            </div>
            <div id="foot_col_mid_container">
                <div class="item">
                    <div class="col-left"></div>
                    <div class="label">工作业绩</div>
                    <div class="col-right"></div>
                </div>
                <div class="item">
                    <div class="col-left"></div>
                    <div class="label">个性特点</div>
                    <div class="col-right"></div>
                </div>
                <div class="item">
                    <div class="col-left"></div>
                    <div class="label">群众基础</div>
                    <div class="col-right"></div>
                </div>
                <div class="item">
                    <div class="col-left"></div>
                    <div class="label">分类考核</div>
                    <div class="col-right"></div>
                </div>
                <div class="item">
                    <div class="col-left"></div>
                    <div class="label">能力类型</div>
                    <div class="col-right"></div>
                </div>
                <div class="item">
                    <div class="col-left"></div>
                    <div class="label">专业特长</div>
                    <div class="col-right"></div>
                </div>
                <div class="item">
                    <div class="col-left"></div>
                    <div class="label">工作作风</div>
                    <div class="col-right"></div>
                </div>
                <div class="item">
                    <div class="col-left"></div>
                    <div class="label">适宜岗位</div>
                    <div class="col-right"></div>
                </div>
                <div class="item">
                    <div class="col-left"></div>
                    <div class="label">不足与风险</div>
                    <div class="col-right"></div>
                </div>
            </div>
            <div class="photo-col" id="photo_col_right">
                <div class="photo">
                    <img src="" alt="">
                </div>
                <div class="photo-col-name">---</div>
                <button class="btn blue"><i class="fa fa-file-text"></i>个人信息</button>
                <!--<button class="btn blue"><i class="fa fa-edit"></i>配置本岗位</button>-->
                <button class="btn light-blue"><i class="fa fa-trash"></i>离开PK</button>
            </div>
        </div>
    </div>
</div>
<canvas id="line_layer"></canvas>
<script src="dist/app.js"></script>
</body>
</html>
