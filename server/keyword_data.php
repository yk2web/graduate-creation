<?php
include('config.php');
header('Content-Type:application/json');
$key=$_REQUEST['keyword'];
$link=mysqli_connect($db_url,$db_user,$db_pwd,$db_name,$db_port);
//$key='n';
if(!$key){
echo "err";
return ;
}
mysqli_query($link,'set names utf8');
$sql="select p_name from yg_product where  p_name like '%$key%'";
$result=mysqli_query($link,$sql);
$list=[];
while(true){
    $row=mysqli_fetch_assoc($result)['p_name'];
     if(!$row){
             break;
            }else{
            $list[]=$row;
            }
}
$list=array_unique($list);
echo json_encode($list);
