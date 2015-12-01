/*!
 * @author liyuelong1020@gmail.com
 * @date 15-11-11 下午3:37
 * @version 1.0.0
 * @description description 
 */

define(function (require, exports) {
    var weixin = require('weixin');
    var popup = require('popup');

    var weixin_bridge = (function() {

        var addEventListener = function () {
            window.WeixinJSBridge ? ready() : document.addEventListener("WeixinJSBridgeReady", ready, !1)
        };
        var ready = function () {
            WeixinJSBridge.on("menu:share:appmessage", function() {
                appMessage()
            });
            WeixinJSBridge.on("menu:share:timeline", function() {
                timeline()
            });
            WeixinJSBridge.on("menu:share:weibo", function() {
                weibo()
            });
        };
        var bindShare = function (t) {
            appMessage = function() {
                WeixinJSBridge.invoke("sendAppMessage", {
                        appid: t.appid,
                        img_url: t.img_url,
                        img_width: t.img_width,
                        img_height: t.img_height,
                        link: t.link,
                        desc: t.desc,
                        title: t.title
                    },
                    function() {})
            };
            timeline = function() {
                WeixinJSBridge.invoke("shareTimeline", {
                        img_url: t.img_url,
                        img_width: t.img_width,
                        img_height: t.img_height,
                        link: t.link,
                        desc: t.desc,
                        title: t.desc
                    },
                    function() {})
            };
            weibo = function() {
                WeixinJSBridge.invoke("shareWeibo", {
                        content: t.desc,
                        url: t.link
                    },
                    function() {})
            };
        };

        var appMessage, timeline, weibo, flag = false;

        return function(config) {
            if(!flag){
                addEventListener();
                flag = true;
            }

            bindShare(config);
        };
    })();

    // url参数
    var getUrlParam = function(url) {
        var param = {};
        var arr = (url || location.search.substr(1)).split('&');
        arr.forEach(function(item) {
            var arr = item.split('=');
            if(arr.length === 2){
                param[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1]);
            }
        });
        return param;
    };

    var base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function(e) {
            var n, i, o, r, a, s, c, l = "",
                u = 0;
            for (e = base64._utf8_encode(e); u < e.length;) n = e.charCodeAt(u++),
                i = e.charCodeAt(u++),
                o = e.charCodeAt(u++),
                r = n >> 2,
                a = (3 & n) << 4 | i >> 4,
                s = (15 & i) << 2 | o >> 6,
                c = 63 & o,
                isNaN(i) ? s = c = 64 : isNaN(o) && (c = 64),
                l = l + this._keyStr.charAt(r) + this._keyStr.charAt(a) + this._keyStr.charAt(s) + this._keyStr.charAt(c);
            return l
        },
        decode: function(e) {
            var n, i, o, r, a, s, c, l = "",
                u = 0;
            for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); u < e.length;) r = this._keyStr.indexOf(e.charAt(u++)),
                a = this._keyStr.indexOf(e.charAt(u++)),
                s = this._keyStr.indexOf(e.charAt(u++)),
                c = this._keyStr.indexOf(e.charAt(u++)),
                n = r << 2 | a >> 4,
                i = (15 & a) << 4 | s >> 2,
                o = (3 & s) << 6 | c,
                l += String.fromCharCode(n),
                64 != s && (l += String.fromCharCode(i)),
                64 != c && (l += String.fromCharCode(o));
            return l = base64._utf8_decode(l)
        },
        _utf8_encode: function(t) {
            t = t.replace(/\r\n/g, "\n");
            for (var e = "",
                     n = 0; n < t.length; n++) {
                var i = t.charCodeAt(n);
                128 > i ? e += String.fromCharCode(i) : i > 127 && 2048 > i ? (e += String.fromCharCode(i >> 6 | 192), e += String.fromCharCode(63 & i | 128)) : (e += String.fromCharCode(i >> 12 | 224), e += String.fromCharCode(i >> 6 & 63 | 128), e += String.fromCharCode(63 & i | 128))
            }
            return e
        },
        _utf8_decode: function(t) {
            for (var e = "",
                     n = 0,
                     i = c1 = c2 = 0; n < t.length;) i = t.charCodeAt(n),
                128 > i ? (e += String.fromCharCode(i), n++) : i > 191 && 224 > i ? (c2 = t.charCodeAt(n + 1), e += String.fromCharCode((31 & i) << 6 | 63 & c2), n += 2) : (c2 = t.charCodeAt(n + 1), c3 = t.charCodeAt(n + 2), e += String.fromCharCode((15 & i) << 12 | (63 & c2) << 6 | 63 & c3), n += 3);
            return e
        }
    };

    var jsapi = "http://jsapi.qq.com/get?api=app.share",
        qqapi = "http://open.mobile.qq.com/sdk/qqapi.js?_bid=152",
        mdc = "http://mdc.html5.qq.com/d/directdown.jsp?channel_id=10349",
        mobile = "http://openmobile.qq.com/api/check2?page=qzshare.html&loginpage=loginindex.html&logintype=qzone",
        to_fri = "mqqapi://share/to_fri?src_type=web&version=1&file_type=news&",
        weibo = "https://api.weibo.com/oauth2/authorize?client_id=791268966&redirect_uri=http%3A%2F%2Finfoapp.3g.qq.com%2Fg%2Fapp_include%2Ftouch%2FshareSinaWbCallback.jsp%3Fdisplay%3Dmobile%26state%3D",
        ShareTencentAction = "http://infoapp.3g.qq.com/g/app_include/share/ShareTencentAction.jsp",
        ShareSinaAction = "http://infoapp.3g.qq.com/g/app_include/share/ShareSinaAction.jsp",
        mqqapi_qzone = "mqqapi://share/to_qzone?src_type=app&version=1&file_type=news&req_type=1&",
        mqqapi_fir = "mqqapi://share/to_fri?file_type=news&src_type=app&version=1&generalpastboard=1&shareType=1&cflag=1&objectlocation=pasteboard&callback_type=scheme&callback_name=QQ41AF4B2A&";

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

    var Share = function(config) {

        this.config = Object.create({
            title: document.title,
            description: document.title,
            img: '',
            url: location.href,
            state: "index5_show",
            ifMap: {
                wx: true,
                sinaWb: true,
                txWb: true,
                qzone: true,
                qq: true
            },
            type: 'link',
            dataUrl: '',
            trigger: function() {},
            success: function() {},
            cancel: function() {},
            fail: function() {}
        });

        for(var key in config){
            if(config.hasOwnProperty(key)){
                this.config[key] = config[key];
            }
        }

        this.shareUrlMap = {};
        this.sinaOauthUrl = weibo + this.config.state;
        this.init();
    };

    Share.prototype = {
        constructor: Share,

        init: function() {
            this._setShareUrlIf();
            this._loadQbWxShareUrl();
            this._initWxshareSet();
            this._initMobileQQShareSet();
        },

        _setShareUrlIf: function() {
            this._filterShareUrlIf();

            var config = this.config,
                url = config.url,
                ifMap = config.ifMap,
                map = this.shareUrlMap,
                arr = url.split("#"),
                query = arr[0].indexOf("?") > 0 ? "&": "?",
                hash = arr[1] ? "#" + arr[1] : "";

            var  t = function(t) {
                return arr[0] + query + "g_f=" + ifMap[t] + hash;
            };

            map.wx = ifMap.wx ? t("wx") : url;
            map.sinaWb = ifMap.sinaWb ? t("sinaWb") : url;
            map.txWb = ifMap.txWb ? t("txWb") : url;
            map.qzone = ifMap.qzone ? t("qzone") : url;
            map.oriQQ = ifMap.qq ? t("qq") : url;
            map.qq = this._base64EncodeQQUrl(map.oriQQ);
        },

        _loadQbWxShareUrl: function() {
            var that = this;
            if(platform.isFromQQBrower && "undefined" == typeof browser){
                require.async(jsapi, function() {
                    that.otherWxShare()
                });
            } else {
                that.otherWxShare();
            }
        },

        _filterShareUrlIf: function() {
            var url = this.config.url;
            this.config.url = url = url.replace(/([?&])sid=[^&#]*/g, "$1hasReplaceSid=1").replace(/oauth_state=0&/g, "");

            if (/i_f=/i.test(url)) {
                var hash_arr = url.split("#"),
                    hash = hash_arr[1] ? "#" + hash_arr[1] : "",
                    search = hash_arr[0].split("?"),
                    param = [];
                if (search[1]) {
                    var arr = search[1].split("&");
                    arr.forEach(function(item) {
                        item.indexOf("i_f") < 0 && param.push(item);
                    });
                }
                this.config.url = search[0] + "?" + param.join("&") + hash;
            }
        },

        _initWxshareSet: function() {
            var config = this.config;
            weixin_bridge({
                title: config.title,
                desc: config.description,
                img_url: config.img,
                link: this.shareUrlMap.wx
            });
        },

        _initMobileQQShareSet: function() {
            var setShareInfo = function () {
                mqq.data.setShareInfo({
                    share_url: that.shareUrlMap.oriQQ,
                    title: config.title,
                    desc: config.description,
                    image_url: config.img
                })
            };
            var that = this, config = this.config;

            if(platform.isFromQQ){
                window.mqq && mqq.data && mqq.data.setShareInfo ? setShareInfo() : require.async(qqapi, function() {
                        setShareInfo();
                    })
            }
        },

        _base64EncodeQQUrl: function(url) {
            return to_fri + ["share_id=1101685683", "title=" + base64.encode(this.config.title), "thirdAppDisplayName=" + base64.encode("华扬腾亚"), "url=" + base64.encode(url)].join("&");
        },

        _shareQzoneWeb: function() {},

        qbWxShare: function(type) {
            var that = this, config = this.config;
            window.browser && browser.app && browser.app.share && browser.app.share({
                title: config.title,
                description: config.description,
                url: that.shareUrlMap.wx,
                img_url: config.img,
                to_app: type
            }, function(data) {
                if(data.code == 1){
                    config.success();
                } else {
                    config.fail();
                }
            })
        },

        ucWxShare: function(type) {
            var config = this.config,
                wx = this.shareUrlMap.wx,
                device = {
                    ios: "kWeixinFriend",
                    android: "WechatTimeline"
                };

            if(type == 1){
                device.ios = "kWeixin";
                device.android = "WechatFriends";
            }

            if(platform.isFromIos){
                ucbrowser && ucbrowser.web_share(config.title, config.description, wx, device.ios, "", "@华扬腾亚", "");
            } else if(platform.isFromAndroid) {
                 ucweb && ucweb.startRequest("shell.page_share", [config.title, config.description, wx, device.android, "", "", ""])
            }
        },

        otherWxShare: function() {
            var that = this;
            var url_param = getUrlParam();

            if(url_param.fromsharefriend == 1 && platform.isFromQQBrower){
                history.replaceState(null, document.title, location.href.replace(/fromsharefriend=1/g, ""));
                that.qbWxShare(1);
            } else if(url_param.fromsharetimeline == 1 && platform.isFromQQBrower){
                history.replaceState(null, document.title, location.href.replace(/fromsharetimeline=1/g, ""));
                that.qbWxShare(8);
            }
        },

        isQbInstalled: function(param) {
            param = param || {};
            var url = param.testUrl || location.href,
                onSucc = param.onSucc,
                onFail = param.onFail,
                stamp = Date.now(),
                userAgent = navigator.userAgent,
                iphone = userAgent.match(/iphone\s*os\s*\d/gi),
                r = 0,
                s = 0;

            iphone && (s = parseInt(iphone[0].split(" ")[2]));
            url = "mttbrowser://url=" + url.replace(/http:\/\//gi, "");

            var callback = function() {
                stamp += 1e3;
                r += 1;
                if(r < 3){
                    setTimeout(callback, 1000);
                } else if(Math.abs(stamp - Date.now()) > 1000) {
                    onSucc && onSucc();
                } else {
                    onFail && onFail();
                }
            };

            if (s > 8) {
                location.href = url;
            } else {
                var iframe = document.createElement("iframe");
                iframe.src = url;
                iframe.id = "qbInstallValidator_" + Date.now();
                iframe.style.display = "none";
                document.body.appendChild(iframe)
            }
            setTimeout(callback, 1000);
            setTimeout(function() {
                iframe && iframe.parentNode && iframe.parentNode.removeChild(iframe);
            }, 5000);

            return false;
        },

        // 绑定微信分享事件
        bindWeixin: function() {
            var that = this,
                config = that.config,
                param = {
                title: config.title,
                desc: config.description,
                imgUrl: config.img,
                link: config.url,
                type: config.type,
                dataUrl: config.dataUrl,
                trigger: config.trigger,
                success: config.success,
                cancel: config.cancel,
                fail: config.fail
            };

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
        },

        callWxShare: function(type) {
            var that = this,
                config = that.config,
                hash_arr = location.href.split("#"),
                search = hash_arr[0].indexOf("?") > 0 ? "&": "?",
                hash = hash_arr[1] ? "#" + hash_arr[1] : "",
                from = (1 == type) ? "fromsharefriend=1" : "fromsharetimeline=1",
                testUrl = hash_arr[0] + search +from + hash;

            if(platform.isFromWx){
                popup.share();
                that.bindWeixin();
            } else if(platform.isFromQQ) {
                popup.share();
            } else if(platform.isFromUC) {
                this.ucWxShare(type);
            } else if(platform.isFromQQBrower) {
                this.qbWxShare(type);
            } else if(platform.isFromQQBrowerLight) {
                location.href = mdc
            } else {
                this.isQbInstalled({
                    testUrl: testUrl,
                    onSucc: function() {},
                    onFail: function() {
                        location.href = mdc
                    }
                });
            }
        },

        shareWxTimeLine: function() {
            this.callWxShare(8)
        },

        shareWxFriend: function() {
            this.callWxShare(1)
        },

        // 分享新浪微博   TODO
        shareSinaWb: function() {      // 描述文字，分享链接，分享图片
            var config = this.config;
            // 新浪微博分享链接
            var linkStr = "http://v.t.sina.com.cn/share/share.php?";
            // 微博分享参数
            var paramStr = [];

            // 分享至微博
            config.description && paramStr.push("title=" + encodeURIComponent(config.description));
            config.url && paramStr.push("url=" + encodeURIComponent(config.url));
            config.img && paramStr.push("pic=" + encodeURIComponent(config.img));

            if(platform.isFromWx || platform.isFromQQ){
                setTimeout(function() {
                    window.location = linkStr + paramStr.join('&');
                }, 0);
            } else {
                window.open(linkStr + paramStr.join('&'));
            }

        },

        shareQzone: function() {
            var frame, timer, now, that = this,
                config = this.config,
                img = base64.encode(config.img),
                title = base64.encode(config.title),
                description = base64.encode(config.description),
                url = base64.encode(this.shareUrlMap.qzone),
                name = base64.encode("华扬腾亚"),
                open_url;

            if (platform.isFromIos) {
                open_url = mqqapi_fir + ["description=" + description, "url=" + url, "title=" + title, "thirdAppDisplayName=" + name, "previewimageUrl=" + img].join("&");
            } else {
                open_url = mqqapi_qzone + ["image_url=" + img, "title=" + title, "description=" + description, "url=" + url, "app_name=" + name].join("&");
            }

            if(platform.isFromQQBrower){
                this.callWxShare(3)
            } else {
                now = Date.now();

                if(platform.isFromAndroid && platform.isFromUC){
                    frame = document.createElement("div");
                    frame.style.visibility = "hidden";
                    frame.innerHTML = '<iframe src="' + open_url + '" scrolling="no" width="1" height="1"></iframe>';
                    document.body.appendChild(frame);
                    setTimeout(function() {
                        frame && frame.parentNode && frame.parentNode.removeChild(frame);
                    }, 5000);
                } else if(platform.isFromQQBrowerLight){
                    that._shareQzoneWeb();
                } else {
                    location.href = open_url;
                    timer = setTimeout(function() {
                        Date.now() - now < 1000 && that._shareQzoneWeb();
                    }, 1000);
                }
            }
        },

        shareTxWb: function() {},

        shareQQ: function() {
            var url = this.shareUrlMap.qq, iframe = null;

            if(platform.isFromQQBrower){
                this.qbWxShare(4)
            } else if(platform.isFromQQBrowerLight) {
                location.href = mdc;
            } else if(platform.isFromAndroid && platform.isFromUC) {
                iframe = document.createElement("div");
                iframe.style.visibility = "hidden";
                iframe.innerHTML = '<iframe src="' + url + '" scrolling="no" width="1" height="1"></iframe>';
                document.body.appendChild(iframe);
                setTimeout(function() {
                    iframe && iframe.parentNode && iframe.parentNode.removeChild(iframe)
                }, 5000);
            } else {
                location.href = url;
            }
        }
    };

    return Share;
});