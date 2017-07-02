/**
 * Created by yk on 2017/4/14.
 */
const tempRouter = {
    main: "./template/temp_main.html",
    movie: "./template/temp_vedio.html",
    app: "./template/temp_app.html",
    connect: "./template/temp_connect.html",
    upload: "./template/temp_upload.html",
    play:"./template/temp_play.html"
};

$(function(){
    var loadMoiveList=function(){}
    var loadAppList=function(){}
    var loadMainList=function(){}
    var loadConnectList=function(){}
    var loadUploadList=function(){}

    var container=$("#temp-container");
    $('.temp-list').on('click', function (e) {
        e.preventDefault();
        container.html('');
        var that = $(this);
        console.log(that.attr('data-to'));
        var dataUrl=that.attr('data-to');
        console.log(tempRouter[dataUrl]);
        container.load(tempRouter[dataUrl]);
        $(document).ready(function(){
        })
    })

});

//$("#temp-container").load('');