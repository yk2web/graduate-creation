<?php
header('Content-Type:application/json');
header('Access-Control-Allow-Origin:*');
include('config.php');
//$key=$_REQUEST[key];
 $output=array();
//if(!$key){
//    $output[]="no movie";
//    return $output;
//}
$link=mysqli_connect($db_url,$db_user,$db_pwd,$db_name,$db_port);
mysqli_query($link,'set names utf8');
$sql="select * from video where video_check='1'";
$result=mysqli_query($link,$sql);
while(true){
$movie=mysqli_fetch_assoc($result);
if(!$movie){
    //echo '视频库文件为空';
     break;
        }
    else{
      $output[]=$movie;
    }
}
echo json_encode($output);
mysqli_close($link);
