/*!
 * @author liyuelong1020@gmail.com
 * @date 2015-10-28
 * @version 2.0.0
 * @description 音乐插件
 */

define(function (require, exports) {
    // 绑定一次事件
    var oneBind = function(element, event, handler) {
        var one = function(e) {
            element.removeEventListener(event, one, false);
            handler.call(this, e);
        };
        element.addEventListener(event, one, false);
    };

    var isIOS = /i(Phone|P(o|a)d)/.test(navigator.userAgent);                     // 是否是爱疯
    var currentTime = Number(sessionStorage['music_current_time']) || 0;          // 是否播放


    // 新建图标
    var initMusicIcon = function() {
        var icon = document.createElement('i');
        icon.className = 'icon-music';
        document.body.appendChild(icon);
        return icon;
    };

    return function(src, loop, autoPlay) {
        var isPlay = false;            // 是否播放

        // 页面背景音乐
        var audio = new Audio();
        audio.loop = !!loop;
        audio.autoplay = false;
        audio.previousSrc = src;
        audio.src = src;
        audio.load();

        // 音乐播放图标
        var icon = initMusicIcon();

        // 播放音乐
        var play = function() {
            audio.play();
        };

        // 暂停音乐
        var pause = function() {
            audio.pause();
        };

        // 修改播放图标
        var setPlayState = function() {
            isPlay = true;
            icon.classList.add('icon-music-animation');
        };

        // 修改播放图标
        var setStopState = function() {
            isPlay = false;
            icon.classList.remove('icon-music-animation');
        };

        audio.addEventListener('playing', setPlayState, false);      // 开始播放事件
        audio.addEventListener('ended', setStopState, false);        // 结束播放事件
        audio.addEventListener('pause', setStopState, false);        // 暂停事件
        audio.addEventListener('loadeddata', function() {
            // 音乐文件加载完毕
            currentTime ? isIOS ? audio.previousTime = currentTime : audio.currentTime  = currentTime : null;
        }, false);

        if(autoPlay){
            play();
            // 解决某些手机不支持自动播放音乐的 bug
            if(isIOS) {
                oneBind(document, 'touchstart', play);
            }
        }

        // 点击播放/暂停音乐
        icon.addEventListener('touchend', function(e) {
            e.stopPropagation();
            e.preventDefault();

            if(isPlay){
                pause();
            } else {
                play();
            }
        }, false);

        // 页面关闭时记录当前播放进度
        window.addEventListener('beforeunload', function() {
            if(isIOS) {
                sessionStorage['music_current_time'] = audio.previousTime;
            } else {
                sessionStorage['music_current_time'] = audio.currentTime;
            }
        });

        return {
            play: play,
            pause: pause
        }
    }
});