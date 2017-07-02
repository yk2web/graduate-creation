<?php
 namespace Qiniu;
    require_once __DIR__ . '\autoload.php';
    header('Access-Control-Allow-Origin:*');
    require_once("\Qiniu\Auth.php");
    require_once("\Qiniu\Zone.php");
    require_once("Qiniu\Http\Client.php");
    require_once("\Qiniu\Http\Request.php");
    require_once("\Qiniu\Http\Response.php");
    require_once("\Qiniu\Http\Error.php");
     //require_once("\Qiniu\Storage\UploadManager.php");
//    use Qiniu\Auth ;
//    use Qiniu\Storage\UploadManager;
    $accessKey = '5OVe7ClhMA45-hmrDrgSZ1JefnrjmTPpHDoCHDcs';
    $secretKey = 'YSTacMxEi24rMKbLy2F-vu53Qgf6rac8WTX78tHW';
    $auth = new Auth($accessKey, $secretKey);
    $bucket = 'ctguyk19940317';
   // $policy = array(
        //'callbackUrl' => 'http://onx4pbf7p.bkt.clouddn.com',
        //'callbackBody' => "name=3123&&toid=12"
     //   );
    $token =  $auth->uploadToken($bucket,NULL, 3600, null);
    echo json_encode($token);
