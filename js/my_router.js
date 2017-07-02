/**
 * Created by yk on 2017/4/9.
 */

// 各个vue实例

var container = new Vue({
    el: "#container",
    data: {
        tempShow: true,
        yunTie: '',
        userName: ''
    },
    watch: {
        tempShow(){
            return this.tempShow;
        }
    },
    methods: {
        changeTemp: function (key) {
            var list = [temp_app, temp_connect, temp_vedio, temp_upload, temp_main, temp_play];
            if (key == temp_upload) {
                this.getLogin();
                // confirm('用户没有登录，登陆后在操作');
                // return ;
            }
            for (var i = 0; i < list.length; i++) {
                //console.log(key.toString());
                //  console.log(list[i]);
                if (key != list[i]) {
                    list[i].showObj.tempShow = false;
                    list[i].showObj.styleObj.display = 'none';
                }
            }
            //key.showObj.tempShow = !key.showObj.tempShow;
            //key.showObj.styleObj.display = key.showObj.tempShow == true ? 'block' : 'none';
            key.showObj.styleObj.display = 'block';
            key.showObj.tempShow = true;
            console.log(key.showObj.tempShow);
            console.log(key.showObj.styleObj.display);
            //执行各个片段的方法
            this.tepMethod(key);
        },
        tepMethod: function (key) {
            switch (key) {
                case temp_main:
                    break;
                case temp_play:
                    break;
                case temp_vedio:
                    temp_vedio.getMovies();
                    break;
                case temp_app:
                    temp_app.gridApk = [];
                    temp_app.gridExe = [];
                    temp_app.gridOther = [];
                    temp_app.getApp();
                    break;
                case temp_connect:
                    break;
                case temp_upload:
                    temp_upload.ajaxToken();
                default :
                    break;

            }
        },
        getLogin: function () {
            var that = this;
            var login_status = $('.user-info').length;
            console.log($('.user-info').length);
            console.log(login_status);
            if (login_status > 0) {
                this.userName = $('.nickname').html('123');
                return true;
            } else {
                var tie = $('.tie-quick-login').html();
                that.yunTie = tie;
                return false;
            }
        }

    }
})

var temp_main = new Vue({
    el: '#temp-main',
    data: {
        showObj: {
            tempShow: true,
            animation: '',
            styleObj: {
                display: 'block'

            }
        }
    },
    watch: {
        'showObj': container.changeTemp
    },
    methods: {}
});

var cloudTieConfig = '';
var temp_vedio = new Vue({
    el: '#temp-vedio',
    data: {
        showObj: {
            tempShow: false,
            animation: '',
            styleObj: {
                display: 'none'
            }
        },
        gridData: [],
        location: 'http://onx4pbf7p.bkt.clouddn.com/',
        img: '?vframe/jpg/offset/2'
    },
    watch: {
        'showObj': container.changeTemp
    },
    methods: {
        getMovies: function () {
            this.$nextTick(function () {
                this.$http.get('server/video_data.php').then(function (res) {
                    console.log(res.data);
                    if (res.data.length == 0) {
                        alert('很抱歉视频库为空');
                    } else {
                        this.gridData = res.data;
                    }
                })
            })
        },
        playVedio: function (infor, container) {
            container.changeTemp(temp_play);
            console.log(infor);
            temp_play.videoData = infor;
            temp_play.playUrl(temp_play.videoData);

            temp_play.cloudTie(infor.video_hash)
        },
        downLoadVedio: function (fileName) {
            if (confirm('确认下载文件?')) {
                var elemIF = document.createElement("iframe");
                elemIF.src = this.location + fileName + '?attname=';
                elemIF.style.display = "none";
                document.body.appendChild(elemIF);
            }
        }
    }
});

//播放页
var temp_play = new Vue({
    el: '#temp-play',
    data: {
        showObj: {
            tempShow: false,
            animation: '',
            styleObj: {
                display: 'none'
            }
        },
        modalHomeShow: '',
        answerShow: false,
        videoData: '',
        url: 'http://onx4pbf7p.bkt.clouddn.com/',
        img: '?vframe/jpg/offset/2',
        poster: '',
        timer: '',
        questionList: '',
        answerList: '',
        videoTime: 0,
        questions: [{name: '数学', qs: "一个人花8块钱买了一只鸡,9块钱卖掉了,然后他觉得不划算,花10块钱又买回来了,11块卖给另外一个人.问他赚了多少?"},
            {name: '数学', qs: "假设有一个池塘,里面有无穷多的水.现有2个空水壶,容积分别为5升和6升.问题是如何只用这2个水壶从池塘里取得3升的水."},
            {name: '语文', qs: "翻译:乃发廪十六万石，米价为平。明年召拜户部尚书。文凝厚雍粹，居常抑抑。"},
            {
                name: '化学', qs: "将a moL／L的Na2CO3溶液与b mol／L的NaHCO3溶液等体积混合，所得溶液中粒子浓度间的关系及相关判断不正确的是(     )。" +
            "A．c(Na+)+c(H+)>c(CO32-)+c(HCO3-)+c(OH-)" +
            "B．c(Na+)>c(CO32-)+c(HCO3-)+c(H2CO3)" +
            "C.若c(Na+)>c(HCO3-)>c(CO32-)>c(OH-)>c(H+)，则一定a&lt;b" +
            "若c(CO32-)+2c(OH-)＝2c(H+)+c(HCO3-)+3c(H2CO3)，则可确定a＝b"
            },
            {name: '物理', qs: '把酒精擦在手臂上感觉凉，这是因为酒精在_______________时要_____________热.(填“吸”或“放”)'}
        ],
        question: '',
        homeUrl: './server/getHomework.php',
        homeFromPhp: {
            homeReplyFlg: false,
            homeReply: ''
        },
        hasAnswered: true
    },
    methods: {
        changeTemp: function (key) {
            var that = this;

            var moviePlayer = that.playUrl();
            container.changeTemp(key);
            this.pauseM(moviePlayer);

        },
        playUrl: function (movieObj) {
            this.question = this.questions[Math.floor(Math.random() * (this.questions.length))];
            console.log(this.question);
            var that = this;
            var dataUrl = this.url;
            var myPlayer = videojs('video-js', {
                "controls": true,
                "autoplay": false,
                "preload": "auto",
                "loop": false,
                controlBar: {
                    //captionsButton: false,
                    //chaptersButton: false,
                    //playbackRateMenuButton: true,
                    //LiveDisplay: true,
                    //subtitlesButton: false,
                    //remainingTimeDisplay: true,
                    //
                    //progressControl: true,

                    volumeMenuButton: {
                        inline: false,
                        vertical: true
                    },//竖着的音量条
                    //fullscreenToggle: true
                }
            }, function () {
                videojs("video-js").ready(function () {
//            myPlayer.progress(true);
                    console.log(movieObj);
                    myPlayer.src(dataUrl + movieObj.video_name);
                    that.poster = dataUrl + movieObj.video_name + that.img;
                    myPlayer.load(dataUrl + movieObj.video_name);  //使video重新加载
                    //that.playM(myPlayer)
                });

            });
            console.log(myPlayer);
            myPlayer.on('ended', function () {
                that.modalHomeShow = true;
                that.pauseM(myPlayer);
                that.answerShow = true;
            });
            //定时显示问题
            //that.timer = setTimeout(function () {
            //    that.modalHomeShow = true;
            //    that.pauseM(myPlayer);
            //    that.answerShow = true;
            //}, 1000);
            return myPlayer;
        },
        playM: function (myPlayer) {
            myPlayer.play();
            container.tempShow = false;
        },
        pauseM: function (myPlayer) {
            myPlayer.pause();

            container.tempShow = true;
        },
        closeAnswer: function () {
            var that = this;
            that.timer = null;
            that.answerShow = false;
        },
        //网易跟帖
        cloudTie: function (key) {
            //  sessionStorage.setItem('yunKey',key);
        },
        //提交作业
        sendHomeWork: function () {
            var that = this;
            var homeData = {
                "user": 'localhost',
                "question": that.question.qs,
                "answer": that.answerList,
                "finishDate": Date.now()
            };
            if (container.userName) {
                homeData.user = container.userName;
            }
            if (!that.answerList) {
                that.homeFromPhp.homeReply = "请填写答案";
            } else {
                this.$nextTick(function () {
                    this.$http.post(this.homeUrl, homeData, {emulateJSON: true}
                    ).then(function (res) {
                            console.log(res.data);
                            that.homeFromPhp.homeReply = res.data;
                            that.homeFromPhp.homeReplyFlg = true;
                            that.answerList="";
                            that.hasAnswered = false;
                        })
                })
            }
        }
    }
});

var temp_app = new Vue({
    el: '#temp-app',
    data: {
        showObj: {
            tempShow: false,
            animation: '',
            styleObj: {
                display: 'none'
            }
        },
        location: 'http://onx4pbf7p.bkt.clouddn.com/',
        gridApk: [],
        apkSort: 'App软件',
        gridExe: [],
        exeSort: '电脑软件',
        gridOther: [],
        otherSort: '其他',
        appUrl: 'server/app_data.php',
        appSorts: [
            {
                name: '学习', list: [
                {id: '312', name: 'aaa', href: ''},
                {id: '', name: 'bbb', href: ''},
                {id: '', name: 'ccc', href: ''}
            ]
            },
            {
                name: '娱乐', list: [
                {id: '312', name: 'aaa', href: ''},
                {id: '', name: 'bbb', href: ''},
                {id: '', name: 'ccc', href: ''}
            ]
            },
            {
                name: '工具', list: [
                {id: '312', name: 'aaa', href: ''},
                {id: '', name: 'bbb', href: ''},
                {id: '', name: 'ccc', href: ''}
            ]
            },
            {
                name: '学习', list: [
                {id: '312', name: 'aaa', href: ''},
                {id: '', name: 'bbb', href: ''},
                {id: '', name: 'ccc', href: ''}
            ]
            },
            {
                name: '娱乐', list: [
                {id: '312', name: 'aaa', href: ''},
                {id: '', name: 'bbb', href: ''},
                {id: '', name: 'ccc', href: ''}
            ]
            },
            {
                name: '工具', list: [
                {id: '312', name: 'aaa', href: ''},
                {id: '', name: 'bbb', href: ''},
                {id: '', name: 'ccc', href: ''}
            ]
            },
            {
                name: '学习', list: [
                {id: '312', name: 'aaa', href: ''},
                {id: '', name: 'bbb', href: ''},
                {id: '', name: 'ccc', href: ''}
            ]
            },
            {
                name: '娱乐', list: [
                {id: '312', name: 'aaa', href: ''},
                {id: '', name: 'bbb', href: ''},
                {id: '', name: 'ccc', href: ''}
            ]
            },
            {
                name: '工具', list: [
                {id: '312', name: 'aaa', href: ''},
                {id: '', name: 'bbb', href: ''},
                {id: '', name: 'ccc', href: ''}
            ]
            }
        ]
    },
    watch: {},
    methods: {
        getApp: function () {
            this.$nextTick(function () {
                var dataAll = null;
                this.$http.get(this.appUrl).then(function (res) {
                    dataAll = res.data;
                    for (var i = 0; i < dataAll.length; i++) {
                        if (dataAll[i].app_name.indexOf('exe') > -1) {
                            this.gridExe.push(dataAll[i]);
                        } else if (dataAll[i].app_name.indexOf('apk') > -1) {
                            this.gridApk.push(dataAll[i]);
                        } else {
                            this.gridOther.push(dataAll[i]);
                            this.gridOther.sort = ""
                        }
                    }
                });
                console.log(this.gridApk);
                console.log(this.gridOther);
                console.log(this.gridExe);
            })
        },
        getFiles: function (fileName) {
            if (confirm('确认下载文件?')) {
                var elemIF = document.createElement("iframe");
                elemIF.src = this.location + fileName + '?attname=';
                elemIF.style.display = "none";
                document.body.appendChild(elemIF);
            }
        }
    }
});

var temp_connect = new Vue({
    el: '#temp-connect',
    data: {
        showObj: {
            tempShow: false,
            animation: '',
            styleObj: {
                display: 'none'

            }
        }

    },
    methods: {}
});
var temp_upload = new Vue({
        el: '#temp-upload',
        data: {
            showObj: {
                tempShow: false,
                animation: '',
                styleObj: {
                    display: 'none'
                }
            },
            upProgressFiles: [],
            qiniu_url: 'server/qiniu.php',
            data_url: 'server/save_data.php',
            token: '',
            //视频的分类
            upSort: '',
            upMessage: '',
            btnProfessional: [
                {classObj: "btn-primary", type: '文学'},
                {classObj: "btn-success", type: '理学'},
                {classObj: "btn-info", type: '工学'},
                {classObj: "btn-warning", type: '艺术'},
                {classObj: "btn-info", type: '其他专业'}
            ],
            btnUnProfessional: [
                {classObj: "btn-primary", type: '电影'},
                {classObj: "btn-success", type: '动漫'},
                {classObj: "btn-info", type: '科技'},
                {classObj: "btn-warning", type: '摄影'},
                {classObj: "btn-info", type: '其他兴趣'}
            ],
            btnFiles: [
                {classObj: "btn-primary", type: 'PC专用'},
                {classObj: "btn-success", type: 'ios专用'},
                {classObj: "btn-info", type: '安卓专用'},
                {classObj: "btn-warning", type: '摄影'},
                {classObj: "btn-info", type: '其他文件'}
            ]
        },
        watch: {
            token(){
                return this.token;
            }
        },
        methods: {
            uploadClick: function (e) {
                e.preventDefault();
                var file = document.querySelector("#up-file");
                var files = file.files;
                console.log(files);

                for (var i = 0; i < files.length; i++) {
                    this.name = files[i];
                    this.ajax(this.url, this.name, function (name) {
                        console.log(JSON.parse(name).name);
                        sessionStorage.setItem("mp4", "../fileup/img/" + JSON.parse(name).name);
                    })
                }
            },
            ajaxToken: function () {
                this.$nextTick(function () {
                    this.$http.get(this.qiniu_url).then(function (res) {
                        console.log(res.data);
                        this.token = res.data;
                    })
                })
            },
            getSize: function (size) {
                const GB = 1024 * 1024 * 1024;
                const MB = 1024 * 1024;
                const KB = 1024;

                if (size > GB) {
                    return (size / GB).toFixed(2) + "GB";
                } else if (size > MB) {
                    return (size / MB).toFixed(2) + "MB";
                } else if (size > KB) {
                    return (size / KB).toFixed(2) + "KB";
                } else {
                    return size + 'B';
                }
            },
            getToken: function () {
                var that = this;
                console.log(that.upSort);
                var data_url = this.data_url;
                var uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                    browse_button: 'pickfiles',         // 上传选择的点选按钮，必需
                    // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                    // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                    // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
                    uptoken: that.token, // uptoken是上传凭证，由其他程序生成
                    // uptoken_url: '/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                    // uptoken_func: that.ajaxToken,
                    //function(file){    // 在需要获取uptoken时，该方法会被调用
                    //    // do something
                    //    return uptoken;
                    // },
                    get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                    //downtoken_url: '/downtoken',
                    // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                    //unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                    //save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了save_key，则开启，SDK在前端将不对key进行任何处理
                    domain: 'http://onx4pbf7p.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
                    container: 'pickfiles-container',             // 上传区域DOM ID，默认是browser_button的父元素
                    max_file_size: '2048mb',             // 最大文件体积限制
                    //flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
                    max_retries: 3,                     // 上传失败最大重试次数
                    dragdrop: true,                     // 开启可拖曳上传
                    drop_element: 'pickfiles-container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                  // 分块上传时，每块的体积
                    auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    //x_vars : {
                    //    查看自定义变量
                    //    'time' : function(up,file) {
                    //        var time = (new Date()).getTime();
                    // do something with 'time'
                    //        return time;
                    //    },
                    //    'size' : function(up,file) {
                    //        var size = file.size;
                    // do something with 'size'
                    //        return size;
                    //    }
                    //},
                    init: {
                        'FilesAdded': function (up, files) {
                            plupload.each(files, function (file) {
                                // 文件添加进队列后，处理相关的事情
                                var filePro = {
                                    name: '',
                                    size: '',
                                    percent: ''
                                };
                                filePro.name = file.name;
                                filePro.percent = up.total.percent;
                                filePro.size = that.getSize(file.size);
                                that.upProgressFiles.push(filePro);
                                console.log(that.upProgressFiles);
                            });
                        },
                        'BeforeUpload': function (up, file) {
                            // 每个文件上传前，处理相关的事情
                            // console.log(up);
                            //upFiles.innerHTML = file.name;
                            //var index=file.name.lastIndexOf('.');
                            //console.log(file.name.slice(index));
                            // console.log(file);
                        },
                        'UploadProgress': function (up, file) {
                            for (var i = 0; i < that.upProgressFiles.length; i++) {
                                if (that.upProgressFiles[i].name == file.name) {
                                    that.upProgressFiles[i].percent = up.total.percent;
                                }
                            }
                            // that.upProgressFiles.percent = file.percent;
                            //console.log(that.upProgressFiles);
                            // 每个文件上传时，处理相关的事情
                        },
                        'FileUploaded': function (up, file, info) {
                            //console.log(up);
                            //console.log(file);
                            //console.log(info);
                            console.log(up.files[0].percent);
                            var progress = up.files[0].percent;
                            if (progress == 100) {
                                //alert('ok!');
                                console.log(file);
                                console.log(info);
                                var data = {
                                    user: 'localhost',
                                    name: '',
                                    time: '',
                                    sortName: '',
                                    videoImg: '',
                                    infor: '',
                                    hash: '',
                                    type: '',
                                    size: ''
                                };
                                var str = '';
                                var info = JSON.parse(info.response);
                                if (container.userName) {
                                    data.user = container.userName;
                                }
                                data.img = temp_vedio.img;
                                data.time = Date.now();
                                data.sortName = that.upSort;
                                data.infor = that.upMessage;
                                data.name = file.name;
                                data.hash = info.hash;
                                data.type = file.type;
                                data.size = file.size;
                                console.log(data);
                                that.$nextTick(function () {
                                    this.$http.post(data_url, data, {emulateJSON: true}
                                    ).then(function (res) {
                                            console.log(res.data);
                                        })
                                })
                                //for (var key in data) {
                                //    str += key + "=" + data[key] + "&";
                                //}
                                //str = str.slice(0, -1);
                                ////str=encodeURIComponent(str);
                                //console.log(str);
                                //var xhr = new XMLHttpRequest();
                                //xhr.onreadystatechange = function () {
                                //    if (xhr.status == 200 && xhr.readyState == 4) {
                                //        alert(xhr.responseText);
                                //    }
                                //};
                                //xhr.open('POST', data_url, true);
                                //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                //xhr.send(str);
                            }
                            //上传成功后向后天服务器添加数据

                            // 每个文件上传成功后，处理相关的事情
                            // 其中info是文件上传成功后，服务端返回的json，形式如：
                            // {
                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                            //    "key": "gogopher.jpg"
                            //  }
                            //   var domain = up.getOption('domain');
                            //   var res = parseJSON(info);
                            //   var sourceLink = domain +"/"+ res.key;
//                               //获取上传成功后的文件的Url
//                               console.log(domain);
//                               console.log(res);
//                               console.log(sourceLink);
                        },
                        'Error': function (up, err, errTip) {
                            //上传出错时，处理相关的事情
                            //console.log(err)
                        },
                        'UploadComplete': function () {
                            //队列文件处理完毕后，处理相关的事情
                            that.upProgressFiles.length = 0;
                        },
                        'Key': function (up, file) {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在unique_names: false，save_key: false时才生效
                            //var key = file;
                            // do something with key here
                            //return key;
                            // console.log('上船前的文件名', file);
                            //var word="abcdefghjkmnpqrstuwxyz123456789";
                            //var  num=Math.random()*word.length;
                            var key = file.name;

                            return key;
                        }
                    }
                });
            }
        }
    });