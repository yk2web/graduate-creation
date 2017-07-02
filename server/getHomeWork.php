<?php
 header('Content-Type:application/json');
 header('Access-Control-Allow-Origin:*');
 include('config.php');
  $user=$_REQUEST['user'];
  $question=$_REQUEST['question'];
  $answer=$_REQUEST['answer'];
  $finishDate=$_REQUEST['finishDate'];
  $link=mysqli_connect($db_url,$db_user,$db_pwd,$db_name,$db_port);
    mysqli_query($link,'set names utf8');
    if($user&&$question&&$answer){
    $sql="insert into homework values(null,'$user','$finishDate','$question','$answer')";
    $result=mysqli_query($link,$sql);
    $row=mysqli_affected_rows($link);
    if($row){
    echo "作业提交成功！";
    }else{
       echo '信息插入失败!';
    }
}
mysqli_close($link);