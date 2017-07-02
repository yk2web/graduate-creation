/**
 * Created by yk on 2017/4/14.
 */
//vedio
$(function () {
    var moviePlay=function(){
        var videoList = $('.video-list');
        var loadUrl = "./template/temp_play.html";
        videoList.on('click', function (e) {
            e.preventDefault();
            $('#temp-container').load(loadUrl);
        });
    }
   $('#temp-vedio').ready(moviePlay);
    console.log('playStart')
});
//app
$();

//upload
$();

//play
$();

//main
$();

//login
$();

//connect
