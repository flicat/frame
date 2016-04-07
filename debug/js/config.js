/*!
 * @author liyuelong1020@gmail.com
 * @date 2016/3/31
 * @version 1.0.0
 * @description config
 */

(function(ready) {
    // 应用缓存
    var appCache = window.applicationCache;
    var updateAppCache = function() {
        appCache.swapCache();
        // 刷新页面
        setTimeout(function() {
            window.location.reload();
        }, 100)
    };
    appCache.onupdateready = updateAppCache;
    if(appCache.status === window.applicationCache.UPDATEREADY) {
        updateAppCache();
    }

    var cacheName = '';

    // 开启无缓存模式
    var clearCache = decodeURI((location.hash.substr(1).match(/(^|&)cache=([^&]*)(&|$)/) || [])[2] || '');
    if(clearCache){
        cacheName = '?' + Date.now();
    }

    var head = document.head || document.querySelector('head') || document.documentElement;

    // 加载js
    var loadScript = function(src, callback) {
        document.write('<script id="sea_js" src="' + src + '"></script>');

        var seaNode = document.getElementById('sea_js');
        seaNode.onload = seaNode.onreadystatechange = function() {
            seaNode.onload = seaNode.onreadystatechange = null;
            callback();
        };
    };

    // 加载css
    var loadStyle = function(href) {
        document.write('<link rel="stylesheet" href="' + href + '"/>');
    };

    var resource = {
        seajs: 'js/plugin/sea.js' + cacheName,                            // seajs
        style: {
            index: 'css/index.css' + cacheName                         // 样式表
        },
        script: {
            // module
            index: 'js/module/index.js' + cacheName,                   // 首页模块

            // plugin
            template: 'js/plugin/template.js' + cacheName,                // js 模板插件
            ajax: 'js/plugin/ajax.js' + cacheName,                        // ajax 插件
            event: 'js/plugin/event.js' + cacheName,                      // 手机触摸事件插件
            share: 'js/plugin/share.js' + cacheName,                      // 分享插件
            voice: 'js/plugin/voice.js' + cacheName,                      // 微信语音插件
            music: 'js/plugin/music.js' + cacheName,                      // 音频播放插件
            weixin: 'js/plugin/weixin.js' + cacheName,                    // 微信授权
            jweixin: 'js/plugin/jweixin-1.0.0.js' + cacheName,            // 微信 jssdk
            popup: 'js/plugin/popup.js' + cacheName,                      // 弹窗插件
            log: 'js/plugin/log.js' + cacheName,                          // 调试信息插件
            validate: 'js/plugin/validate.js' + cacheName,                // 表单验证
            image_manage: 'js/plugin/image-manage.js' + cacheName,        // 图片
            megapix: 'js/plugin/megapix-image.js' + cacheName,            // 图片
            pkgd: 'js/plugin/imagesloaded-pkgd.js' + cacheName,           // 图片
            binaryajax: 'js/plugin/binaryajax.js' + cacheName,            // 图片
            exif: 'js/plugin/exif.js' + cacheName                         // 图片
        }
    };

    loadStyle(resource.style.index);
    loadScript(resource.seajs, function() {
        ready(window.seajs, resource);
    });

})(function(seajs, resource) {

    // 开启调试模式
    var debug = decodeURI((location.search.substr(1).match(/(^|&)debug=([^&]*)(&|$)/) || [])[2] || '');

    // seajs配置
    seajs.config({
        charset: 'utf-8',
        base: seajs.data.cwd,
        alias: resource.script
    });

    // 错误调试
    debug && seajs.use('log', function(log) {
        window.onerror = function(msg, url , line){
            log("Error: " + msg, "URL: " + url, "Line: " + line);
            return false;
        };
    });

    // 横屏监听
    var landscape = (function() {
        var landscape = document.createElement('div');
        landscape.className = 'popup popup-landscape';
        landscape.innerHTML = '<div class="popup-content"><span>为了更好的体验，请将手机/平板竖过来！</span></div>';
        return {
            elem: landscape,
            isShow: false
        };
    })();

    // 横屏提示
    window.onorientationchange = function() {
        if(window.orientation == '-90' || window.orientation == '90'){
            if(!landscape.isShow){
                document.body.appendChild(landscape.elem);
                landscape.isShow = true;
            }
        } else {
            if(landscape.isShow){
                document.body.appendChild(landscape.elem);
                landscape.elem.parentNode.removeChild(landscape.elem);
                landscape.isShow = false;
            }
        }
    };
});
