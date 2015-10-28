/*!
 * @Author: liyl@loocon.com & guanzy@loocon.com
 * @Date: 2014/11/12
 * @Describe: 分享
 */

define(function(require, exports) {
    var weixin = require('weixin');

    return {

        // 分享到QQ好友
        qq: function(param) {
            var options = {
                url: location.href,         /* 获取URL，可加上来自分享到QQ标识，方便统计 */
                desc: '',                   /* 分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
                title: '',                  /* 分享标题(可选) */
                summary: '',                /* 分享摘要(可选) */
                pics: '',                   /* 分享图片(可选) */
                flash: '',                  /* 视频地址(可选) */
                site: '',                   /* 分享来源(可选) 如：QQ分享 */
                style: '201',
                width: 32,
                height: 32
            };

            var str = [];
            for(var i in options){
                if(options.hasOwnProperty(i)){
                    str.push(i + '=' + encodeURIComponent(param[i] || options[i]));
                }
            }

            setTimeout(function() {
                window.location = 'http://connect.qq.com/widget/shareqq/index.html?' + str.join('&')
            }, 0);
        },

        // 分享新浪微博
        sina: function(text, url, pic) {      // 描述文字，分享链接，分享图片
            // 新浪微博分享链接
            var linkStr = "http://v.t.sina.com.cn/share/share.php?";
            // 微博分享参数
            var paramStr = [];

            // 分享至微博
            text && paramStr.push("title=" + encodeURIComponent(text));
            url && paramStr.push("url=" + encodeURIComponent(url));
            pic && paramStr.push("pic=" + encodeURIComponent(pic));

//            window.open(linkStr + paramStr.join('&'));
            setTimeout(function() {
                window.location = linkStr + paramStr.join('&');
            }, 0);
        },

        // 绑定微信分享事件
        bindWeixin: function(param) {
            /**
             * title    标题，
             * desc     描述文字 ，
             * imgUrl   图片 ，
             * link     分享链接，
             * type     分享类型,music、video或link，不填默认为link
             * dataUrl  如果type是music或video，则要提供数据链接，默认为空
             * trigger  事件触发函数
             * success  成功回调函数
             * cancel   取消回调函数
             * fail     失败回调函数
             *
             */

            // 接口就绪后执行回调函数
            weixin.ready(function() {
                // 分享给朋友
                weixin.onMenuShareAppMessage(param);
                // 分享到朋友圈
                weixin.onMenuShareTimeline(param);
                // 分享到QQ
                weixin.onMenuShareQQ(param);
                // 分享到腾讯微博
                weixin.onMenuShareWeibo(param);
            });
        }
    }
});