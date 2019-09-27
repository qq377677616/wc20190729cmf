window.onload=function () {
    var verification=[false,false];
    var currentIndex=0,_pages=document.getElementsByClassName('ruler'),_e=document.getElementsByClassName('swiper-slide');
    setTimeout(function(){
        _verification(1);
    },1500);
    //初始化 swiper
    var _arrow=document.getElementsByClassName('arrow')[0];
    var swiper = new Swiper('.swiper-container', {
        effect: 'cube',
        grabCursor: true,
        direction: "vertical",
        speed: 1000,
        cubeEffect: {
            shadow: false,
            slideShadows: true,
        },
        on: {
            transitionEnd: function(){
                if(currentIndex===this.activeIndex)return;
                _pages[currentIndex].className=_pages[currentIndex].className.replace(/\s(anim)/,'');
                _pages[this.activeIndex].className+=' anim';
                currentIndex=this.activeIndex;
                _arrow.style.display= currentIndex==8?'none':'block';
            },
        }
    });
    //设置Audio
    var myAudio=document.getElementsByTagName('audio')[0];
    myAudio.src=window.bg_audio;
    startBackMusic(window.bg_audio, 'myAudio', 'audio', function(res){
        if (res.status === 2) {//音乐开始播放回调
            // $("#musio_btn").show();
          } else if (res.status === 1) {//播放回调
            // $("#musio_btn").removeClass("on");
          } else {//暂停回调
            // $("#musio_btn").addClass("on");
          }
      });
      /*背景音乐兼容安卓和苹果系统*/
      function startBackMusic(mp3Url, myAudio, clickBtn, callback) {
        audioMusic(myAudio, clickBtn, function(res){ callback(res); });
        // isSystem(function(res){
        //   if (res.isiOS) {
        //     audioMusic(myAudio, clickBtn, function(res){ callback(res); });
        //   } else {
        //     audioContextMusic(mp3Url, clickBtn, function(res){ callback(res); });
        //   }  
        // });  
      }
      //判断当前手机系统（Android/ios） 
      function isSystem(callback) {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        callback({isAndroid: isAndroid, isiOS: isiOS});  
      }
      //audio播放音乐
      function audioMusic(audio, clickBtn, callback) {
        var audio = document.getElementById(audio);
        var clickBtn = document.getElementById(clickBtn);
        audio.play();
        document.addEventListener("WeixinJSBridgeReady", function () {
          audio.play();
        }, false);
        callback({status: 2});
        clickBtn.onclick = function(){
          if (audio.paused) {
            audio.play();
            callback({status: 1});
          } else { 
            audio.pause(); 
            callback({status: 0});
          }
        }  
      }
      //audioContext播放音乐
      function audioContextMusic(mp3Url, clickEle, callback){
        var audioContext;
        var audioBufferSourceNode;
        var analyser;
        var clickBtn = document.getElementById(clickEle);
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        audioContext = new window.AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        loadAudioFile(mp3Url);
        function loadAudioFile(url) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'arraybuffer';
          xhr.onload = function(e) {
            decodecFile(this.response);
          };
          xhr.send();
        }
        function decodecFile(fileContent) {
          audioContext.decodeAudioData(fileContent, function(buffer) {
            start(buffer);
          });
        }
        function start(buffer) {
          if(audioBufferSourceNode) { audioBufferSourceNode.stop(); }
          audioBufferSourceNode = audioContext.createBufferSource();
          audioBufferSourceNode.connect(analyser);
          analyser.connect(audioContext.destination);
          audioBufferSourceNode.buffer = buffer;
          audioBufferSourceNode.loop = true;
          audioBufferSourceNode.start(0);
          callback({status: 2});
        }
        clickBtn.onclick=function(){
          if (audioContext.state === "suspended") {
            audioContext.resume();
            callback({status: 1});
          } else if (audioContext.state === "running") {
            audioContext.suspend();
            callback({status: 0});
          }
        }
    }
    var windowWandH={
        w: window.innerWidth || document.body.clientWidth,
        h: window.innerHeight || document.body.clientHeight,
    }
    //适配屏幕
    if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
        if(screen.height == 812 && screen.width == 375){ //苹果X
            document.getElementsByClassName('compatibleBox')[0].style.cssText ='transform: scale(0.7);-webkit-transform: scale(0.7);';
        }else if(screen.height == 736 && screen.width == 414){ //苹果7plus         
            document.getElementsByClassName('compatibleBox')[0].style.cssText ='transform: scale(0.73);-webkit-transform: scale(0.73);';
        }else if(screen.height == 896 && screen.width == 414){ //苹果xr  
            document.getElementsByClassName('compatibleBox')[0].style.cssText ='transform: scale(0.67);-webkit-transform: scale(0.67);';
        }else{
          document.getElementsByClassName('compatibleBox')[0].style.cssText ='transform: scale(0.76);-webkit-transform: scale(0.76);';
        }
    }
    (function setSize(){
        var _titleEl=Array.prototype.slice.call(document.getElementsByClassName('title'),1),
        _describeEl=document.getElementsByClassName('describe');
        _fn(_titleEl[0],385);
        _fn(_describeEl[0],495);
        _fn(_titleEl[1],370);
        _fn(_describeEl[1],475);
        _fn(_titleEl[2],385);
        _fn(_describeEl[2],490);
        _fn(_titleEl[3],355);
        _fn(_describeEl[3],460);
        _fn(_titleEl[4],385);
        _fn(_describeEl[4],296);
        _fn(_titleEl[5],368);
        _fn(_describeEl[5],470);
        _fn(_titleEl[6],390);
        _fn(_describeEl[6],495);
        function _fn(e,n){
            e.style.top=(windowWandH.h*n)/935+'px';
        }
        for (let i = 0; i < _titleEl.length; i++) {
            _titleEl[i].style.height=(windowWandH.h*62)/935+'px';
            _describeEl[i].style.height=(windowWandH.h*188)/935+'px';
        }
        _describeEl[4].style.height=(windowWandH.h*380)/935+'px';
    })()
    //所有东西初始化完成
    _verification(0);
    function _verification(i){
        var _e=document.getElementsByClassName('load')[0];
        verification[i]=true;
        if(verification[0] && verification[1]){
            _e.children[1].children[0].className='loadLast';
            setTimeout(function(){
                _e.parentNode.removeChild(_e);
                _pages[0].className+=" anim";
            },200)
        }

    }
}