/*!
 * @author liyuelong1020@gmail.com
 * @date 15-5-31 下午4:51
 * @version 1.0.0
 * @description 背景音乐
 */

define(function (require, exports) {
    var oneBind = function(element, event, handler) {
        var one = function(e) {
            element.removeEventListener(event, one, false);
            handler.call(this, e);
        };
        element.addEventListener(event, one, false);
    };

    var isIOS = /i(Phone|P(o|a)d)/.test(navigator.userAgent);
    var isPlay = !Number(sessionStorage['music_play_state']);          // 是否播放

    var icon = document.createElement('i');

    var method = {
        play: null,
        stop: null,
        show: function() { icon.style.display = 'block' },
        hide: function() { icon.style.display = 'none' }
    };

    window.addEventListener('load', function() {

        // 页面背景音乐
        var audio = new Audio();
        audio.loop = true;
        audio.autoplay = false;
        audio.previousSrc = seajs.data.cwd + 'audio/voice.arm';
        audio.src = seajs.data.cwd + 'audio/voice.arm';
        audio.load();

        var musicStart = function() {
            if(isPlay){
                var currentTime = Number(sessionStorage['music_current_time']) || 0;
                if(isIOS) {
                    audio.previousTime = currentTime;
                } else {
                    audio.currentTime = currentTime;
                }
                audio.play();

            }
        };

        musicStart();
//                audio.addEventListener('pause', musicStart, false);
//                audio.addEventListener('ended', musicStart, false);

        // 解决某些手机不支持自动播放音乐的 bug
        if(isIOS || audio.paused) {
            oneBind(document, 'touchstart', musicStart);
        }

        // 页面关闭时记录当前播放进度
        window.addEventListener('beforeunload', function() {
            if(isIOS) {
                sessionStorage['music_current_time'] = audio.previousTime;
            } else {
                sessionStorage['music_current_time'] = audio.currentTime;
            }
        });

        // 点击播放/暂停音乐
        icon.addEventListener('touchend', function(e) {
            e.stopPropagation();
            e.preventDefault();

            isPlay = !isPlay;
            sessionStorage['music_play_state'] = Number(!isPlay);

            if(isPlay){
                icon.classList.add('icon-music-animation');
                musicStart();
            } else {
                icon.classList.remove('icon-music-animation');
                audio.pause();
            }
        }, false);
        icon.className = 'icon-music' + (isPlay ? ' icon-music-animation' : '');
        document.body.appendChild(icon);

        method.play = function() { audio.play() };
        method.stop = function() { audio.pause() };

    }, false);


    return method;
});