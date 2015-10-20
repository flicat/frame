/*!
 * @Author: liyl@loocon.com
 * @Date: 2015/01/12
 * @Describe: 微信 JS-SDK
 */

define(function(require, exports) {
    var ajax = require('ajax');
    var wxsdk = require('jweixin');

    // 返回给定范围内的随机整数
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // 生成随机字符串
    var randomStr = function(len) {
        var str = 'qwertyuiopasdfghjklzcxvbnmQWERTYUIOPASDFGHJKLZCXVBNM';
        var result = '';
        while(result.length < len){
            result += str[getRandomInt(0, 51)];
        }
        return result;
    };

    // 获取签名
    var getTimes = 0;
    var getSignature = function() {
        // jsonp回调函数名
        var callbackName = 'weixin_callback_' + (new Date - 0);
        // noncestr 随机字符串
        var noncestr = randomStr(16);
        // signature 请求参数
        var param = {
            callback: callbackName,
            noncestr: noncestr,
            timestamp: parseInt(new Date / 1000),
            url: String(location.href).split('#')[0],
            state: 0
        };

        ajax({
            type: 'POST',
            url: 'http://one.jcmob.cn/jssdk/get_signature2.do',
            data: param,
            dataType: 'jsonp',
            jsonp: callbackName,
            success: function(data) {
                if(data && data.code && data.code === 'success'){
                    // config信息验证失败会执行error函数，
                    wxsdk.error(function(res){
                        if(getTimes++ < 3){
                            getSignature();
                        } else {
                            console.log(JSON.stringify(res, null, '  '));
                        }
                    });
                    // 微信签名验证
                    wxsdk.config({
                        debug: false,
                        appId: data.appid,
                        timestamp: data.timestamp,
                        nonceStr: data.noncestr,
                        signature: data.signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'hideMenuItems',
                            'showMenuItems',
                            'hideAllNonBaseMenuItem',
                            'showAllNonBaseMenuItem',
                            'translateVoice',
                            'startRecord',
                            'stopRecord',
                            'onRecordEnd',
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'getNetworkType',
                            'openLocation',
                            'getLocation',
                            'hideOptionMenu',
                            'showOptionMenu',
                            'closeWindow',
                            'scanQRCode',
                            'chooseWXPay',
                            'openProductSpecificView',
                            'addCard',
                            'chooseCard',
                            'openCard'
                        ]
                    });
                    // 显示右上角菜单接口
                    wxsdk.showOptionMenu();
                    // 批量显示功能按钮接口
                    wxsdk.showMenuItems({
                        menuList: [
                            "menuItem:exposeArticle",
                            "menuItem:setFont",
                            "menuItem:dayMode",
                            "menuItem:nightMode",
                            "menuItem:refresh",
                            "menuItem:profile",
                            "menuItem:addContact",
                            "menuItem:share:appMessage",
                            "menuItem:share:timeline",
                            "menuItem:share:qq",
                            "menuItem:share:weiboApp",
                            "menuItem:favorite",
                            "menuItem:share:facebook",
                            "menuItem:share:QZone",
                            "menuItem:jsDebug",
                            "menuItem:editTag",
                            "menuItem:delete",
                            "menuItem:copyUrl",
                            "menuItem:originPage",
                            "menuItem:readMode",
                            "menuItem:openWithQQBrowser",
                            "menuItem:openWithSafari",
                            "menuItem:share:email",
                            "menuItem:share:brand"
                        ] // 要显示的菜单项，所有menu项见附录3
                    });
                }
            }
        });
    };

    getSignature();

    return wxsdk;
});