/*!
 * @author liyuelong1020@gmail.com
 * @date 15-5-21 下午4:04
 * @version 1.0.0
 * @description index
 */

define(function(require, exports) {
    var log = require('log');
    var event = require('event');
    var popup = require('popup');
    var share = require('share');

    // 平台检测
    var userAgent = window.navigator.userAgent;
    var platform = {
        isFromAndroid: /android/gi.test(userAgent),
        isFromIos: /iphone|ipod|ios/gi.test(userAgent),
        isFromWx: /MicroMessenger/gi.test(userAgent),
        isFromQQ: /mobile.*qq/gi.test(userAgent),
        isFromUC: /ucbrowser/gi.test(userAgent),
        isFromQQBrower: /mqqbrowser[^LightApp]/gi.test(userAgent),
        isFromQQBrowerLight: /MQQBrowserLightApp/gi.test(userAgent)
    };

    // 分享文案
    var shareParam = new share({
        title: '广发银行',
        description: '华扬腾亚 特别制作',
        img: seajs.data.cwd + 'images/icon-share.jpg',
        url: seajs.data.cwd + 'index.html'
    });
    if(platform.isFromWx){
        shareParam.bindWeixin();
    }

    var imageURI = [
        seajs.data.cwd + 'images/bg-share.png',
        seajs.data.cwd + 'images/icon-fail.png',
        seajs.data.cwd + 'images/icon-success.png',
        seajs.data.cwd + 'images/loading.gif'
    ];
    var preloadImages = function(callback) {
        var imgLen = imageURI.length;
        imageURI.forEach(function(src) {
            var img = new Image();
            img.onload = img.onerror = function() {
                imgLen--;
                if(!imgLen){
                    callback();
                }
            };
            img.src = src;
        });
    };

    var wrap = document.getElementById('wrap');
    var img = document.getElementById('success-image');
    var scaleFlag = 1, rotateFlag = 0, scale = 1, rotate = 0;
    var handler = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if(e.type === 'touchstart'){           // 记录上次缩放的状态
            rotateFlag = rotate;
            scaleFlag = scale;
        } else if(e.type === 'swipe'){                 // 旋转缩放
            var point = e.data;
            var pointLen = point.endX.length;

            if(pointLen > 1){
                var diff = point.endApart - point.startApart;

                if(diff > 0){
                    scale = scaleFlag + diff / 100;
                } else if(diff < 0) {
                    scale = scaleFlag - Math.abs(diff) / 100;
                }

                if(scale < 0.2){
                    scale = 0.2;
                }

                rotate = (rotateFlag + point.startAngle - point.endAngle) % 360;

                wrap.innerHTML = rotateFlag + '|' + scaleFlag + '<br>' + rotate + '|' + scale;
                img.style.transform = img.style.webkitTransform = 'scale(' + scale + ') rotate(' + rotate + 'deg)';
            }
        }

    };

    img.addEventListener('touchstart', handler);
    img.addEventListener('swipe', handler);

    var eventHandler = function(e) {
        e.preventDefault();
        e.stopPropagation();
        wrap.innerHTML = e.type;
    };
    wrap.addEventListener('tap', eventHandler, false)
        .addEventListener('longTap', eventHandler, false)
        .addEventListener('swipe', eventHandler, false)
        .addEventListener('swipeLeft', eventHandler, false)
        .addEventListener('swipeRight', eventHandler, false)
        .addEventListener('swipeUp', eventHandler, false)
        .addEventListener('swipeDown', eventHandler, false);

//    document.body.live('tap', '.wrap', eventHandler)
//        .live('click', '.wrap', eventHandler);

});
