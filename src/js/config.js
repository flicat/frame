/*!
 * @author liyuelong1020@gmail.com
 * @date 2016/3/31
 * @version 1.0.0
 * @description config
 */

var Config = Config || {};

// 设备/平台信息
Config.platform = (function() {
    var userAgent = window.navigator.userAgent;
    return {
        isFromAndroid: /android/gi.test(userAgent),                             // 安卓
        isFromIos: /iphone|ipod|ios/gi.test(userAgent),                         // 苹果设备
        isFromWx: /MicroMessenger/gi.test(userAgent),                           // 微信
        isFromQQ: /mobile.*qq/gi.test(userAgent),                               // QQ
        isFromUC: /ucbrowser/gi.test(userAgent),                                // UC
        isFromQQBrower: /mqqbrowser[^LightApp]/gi.test(userAgent),              // QQ浏览器
        isFromQQBrowerLight: /MQQBrowserLightApp/gi.test(userAgent)             // QQ内置浏览器
    };
})();

(function(call) {
    var scripts = document.scripts,
        script = scripts[scripts.length - 1],
        src = script.hasAttribute ? script.src : script.getAttribute("src", 4);

    // js 版本号
    Config.version = ((src.split('?')[1] || '').match(/(^|&)v=([^&]*)(&|$)/) || [])[2] || '1.0.0';

    // js 基础路径
    Config.dir = src = src.match(/[^?#]*\//)[0];

    // 加载seajs
    var id = 'seajs_' + Date.now();
    document.write('<script id="' + id + '" src="' + src + 'plugin/sea.js?v=' + Config.version + '"></script>');
    document.getElementById(id).onload = call;

})(function() {
    var cacheName = Config.version;

    // 开启调试模式
    var debug = decodeURI((location.search.substr(1).match(/(^|&)debug=([^&]*)(&|$)/) || [])[2] || '');

    // 清除缓存
    var clearCache = decodeURI((location.search.substr(1).match(/(^|&)cache=([^&]*)(&|$)/) || [])[2] || '');

    // js脚本缓存对象
    var scriptCache = (function() {
        var ls = localStorage,
            stack = {},                                  // js 加载记录，防止重复加载
            cache_name = '__script_cache__',             // js 缓存名称
            cache;                                       // js 缓存

        // 获取缓存脚本
        try{
            cache = JSON.parse(ls[cache_name]);
        } catch (e) {
            cache = {
                version: cacheName,
                script: {}
            }
        }

        if(Object.prototype.toString.call(cache) !== '[object Object]'){
            cache = {
                version: cacheName,
                script: {}
            }
        }
        if(cache.version != cacheName || Object.prototype.toString.call(cache.script) !== '[object Object]'){
            cache.version = cacheName;
            cache.script = {};
        }

        return {
            // 缓存对象
            cache: cache,

            // 将缓存文件写入到页面中
            get_cache: function(id) {
                if(cache.script[id] && !stack[id]){
                    stack[id] = true;
                    new Function(cache.script[id])();
                }
            },

            // 将 js 写入到缓存中
            set_cache: function(cmd) {
                if(!cache.script[cmd.id]){
                    // define 函数
                    var factory = cmd.factory.toString();
                    var code = 'define("' + cmd.id + '",';

                    // 依赖关系
                    code += '["' + cmd.deps.join('","') + '"],';

                    code += factory + ')';

                    cache.script[cmd.id] = code;
                    ls[cache_name] = JSON.stringify(cache);
                }
            },

            clear_cache: function() {
                stack = {};
                cache.version = cacheName;
                cache.script = {};

                // 清除本地缓存
                ls.clear();
            }
        };
    })();

    // 应用缓存
    var appCache = window.applicationCache;
    var updateAppCache = function() {
        scriptCache.clear_cache();

        try {
            appCache.swapCache();

            // 刷新页面
            setTimeout(function() {
                window.location.reload(true);
            }, 100)
        } catch(e) {
            console.error(e);
        }

    };
    appCache.onupdateready = updateAppCache;
    // 缓存文件有修改则更新缓存
    if(appCache.status === appCache.UPDATEREADY) {
        updateAppCache();
    }

    if(clearCache){
        scriptCache.clear_cache();

        try {
            appCache.update();
        } catch (e) {
            console.error(e);
        }
    }

    // 预加载 js
    seajs.on('resolve', function(e) {
        if(e.id){
            scriptCache.get_cache(e.id);
        }
    });

    // js 写入到缓存
    seajs.on('define',  function(e) {
        if(e.id && !scriptCache.cache.script[e.id]){
            scriptCache.set_cache(e);
        }
    });

    // seajs配置
    seajs.config({
        charset: 'utf-8',
        base: Config.dir,
        alias: {
            // module
            'index': 'module/index.js?v=' + cacheName,                   // 首页模块
            'widget': 'module/widget.js?v=' + cacheName,                 // 扩展插件


            // plugin
            'public': 'plugin/public.js?v=' + cacheName,               // 全站公共方法
            'ajax': 'plugin/ajax.js?v=' + cacheName,               // ajax 插件
            'calendar': 'plugin/calendar.js?v=' + cacheName,               // 日历控件
            'event': 'plugin/event.js?v=' + cacheName,             // 手机触摸事件插件
            'mvvm': 'plugin/mvvm.js?v=' + cacheName,               // 手机mvvm插件
            'exbind': 'plugin/exbind.js?v=' + cacheName,           // html插件绑定
            'music': 'plugin/music.js?v=' + cacheName,             // 音频播放插件
            'popup': 'plugin/popup.js?v=' + cacheName,             // 弹窗插件
            'selector': 'plugin/selector.js?v=' + cacheName,       // 仿ios联动下拉菜单
            'log': 'plugin/log.js?v=' + cacheName,                 // 调试信息插件
            'jweixin': 'plugin/jweixin.js?v=' + cacheName,         // 微信 jssdk
            'weixin': 'plugin/weixin.js?v=' + cacheName,           // 微信授权
            'voice': 'plugin/voice.js?v=' + cacheName,             // 微信语音插件
            'share': 'plugin/share.js?v=' + cacheName,             // 分享插件
            'validate': 'plugin/validate.js?v=' + cacheName,        // 表单验证
            'image_manage': 'plugin/image-manage.js?v=' + cacheName,        // 图片压缩与旋转
            'megapix': 'plugin/megapix-image.js?v=' + cacheName,            // 图片压缩与旋转
            'pkgd': 'plugin/imagesloaded-pkgd.js?v=' + cacheName,           // 图片压缩与旋转
            'binaryajax': 'plugin/binaryajax.js?v=' + cacheName,            // 图片压缩与旋转
            'exif': 'plugin/exif.js?v=' + cacheName,                         // 图片压缩与旋转
            'qrcode': 'plugin/qrcode.js?v=' + cacheName                  // 生成二维码

        }
    });

    // 错误调试
    debug && seajs.use('log', function(log) {
        window.onerror = function(msg, url , line){
            log("Error: " + msg, "URL: " + url, "Line: " + line);
            return false;
        };
    });

});

(function() {
    var html = document.documentElement;

    // 是否支持 vw 字体单位
    var isSupportVw = false;
    if(localStorage['__is_support_vw__']){
        isSupportVw = !!Number(localStorage['__is_support_vw__']);
    } else {
        // 根节点字体大小设置
        var span = document.createElement('span');
        span.style.cssText = 'display: inline-block; width: 100vw';
        document.body.appendChild(span);

        if(span.offsetWidth == html.offsetWidth){
            localStorage['__is_support_vw__'] = 1;
            isSupportVw = true;
        } else {
            localStorage['__is_support_vw__'] = 0;
            isSupportVw = false;
        }

        document.body.removeChild(span);
    }

    var setFontSize = function() {
        var pageRatio = html.offsetWidth / window.innerWidth;
        if(isSupportVw) {
            html.style.fontSize = pageRatio * 3.75 + 'vw';
        } else {
            html.style.fontSize = window.innerWidth / 100 * pageRatio * 3.75 + 'px';
        }

    };

    // 如果是PC端则最大宽度为 640px
    if(!/AppleWebKit.*Mobile.*/.test(navigator.userAgent)){
            html.style.maxWidth = '640px';
            html.style.margin = '0 auto';
            window.onresize = setFontSize;
    }

    // 设置页面字体大小
    window.onorientationchange = setFontSize;
    setFontSize();
})();

