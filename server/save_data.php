<?php
 header('Content-Type:application/json');
 header('Access-Control-Allow-Origin:*');
 include('config.php');
  $user=$_REQUEST['user'];
  $name=$_REQUEST['name'];
  $addTime=$_REQUEST['time'];
  $type=$_REQUEST['type'];
  $img=$_REQUEST['videoImg'];
  $sort=$_REQUEST['sortName'];
  $infor=$_REQUEST['infor'];
  $hash=$_REQUEST['hash'];
  $size=$_REQUEST['size'];
  $output =array();
  $link=mysqli_connect($db_url,$db_user,$db_pwd,$db_name,$db_port);
  mysqli_query($link,'set names utf8');
  if(empty($name)){
  echo '[]';
  return;
  }
//获取文件类型
// var_dump(substr(strrchr($name,"."),1));
   $file_type= substr(strrchr($name,"."),1);
         if($file_type=='mp4'||$file_type=='rmvb'||$file_type=='mkv'){
            $sql="select * from video where Video_hash='$hash'";
             $result=mysqli_query($link,$sql);
                $list=mysqli_fetch_assoc($result);
                if(!$list){
                        $sql="insert into video values(null,'$name','$type','$sort','','$size','$hash','$infor','$user','$addTime','0','0','1')";
                }else{
                echo "file has exits";
                 return ;
                      }
            }else{
               $sql="select * from apps where app_hash='$hash'";
                $result=mysqli_query($link,$sql);
                   $list=mysqli_fetch_assoc($result);
                   if(!$list){
                     $sql="insert into apps values(null,'$name','$type','$sort',''  ,'$size','$hash','$infor','$user','$addTime','0','0','1')";
                   }else{
                     echo "file has exits";
                     return ;
                   }
            }
            $result=mysqli_query($link,$sql);
            $uid=mysqli_insert_id($link);
            if($result!=false){
            	$output['msg']='succ';
            	$output['uid']=$uid;
            	echo json_encode($output);
            }else{
            	$output['msg']='err';
            	$output['sql']="INSERT...";
            	echo json_encode($output);
            }
mysqli_close($link);

