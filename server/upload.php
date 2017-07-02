<?php
header('Access-Control-Allow-Origin:*');
if(!empty($_FILES['file'])){
    $fileinfo = $_FILES['file'];
   // var_dump($fileinfo);
    $destination = "C:/xampp/htdocs/vedioJs/video5.18.4.js/fileup/data/";
    $destination = $destination.basename($_FILES['file']['name']);
   // var_dump($destination );
    move_uploaded_file($fileinfo['tmp_name'],$destination);
    echo  json_encode($fileinfo);
}
