define("share",["weixin","popup"],function(require,exports){var a=require("weixin"),b=require("popup"),c=function(){var a,b,c,d=function(){window.WeixinJSBridge?e():document.addEventListener("WeixinJSBridgeReady",e,!1)},e=function(){WeixinJSBridge.on("menu:share:appmessage",function(){a()}),WeixinJSBridge.on("menu:share:timeline",function(){b()}),WeixinJSBridge.on("menu:share:weibo",function(){c()})},f=function(d){a=function(){WeixinJSBridge.invoke("sendAppMessage",{appid:d.appid,img_url:d.img_url,img_width:d.img_width,img_height:d.img_height,link:d.link,desc:d.desc,title:d.title},function(){})},b=function(){WeixinJSBridge.invoke("shareTimeline",{img_url:d.img_url,img_width:d.img_width,img_height:d.img_height,link:d.link,desc:d.desc,title:d.desc},function(){})},c=function(){WeixinJSBridge.invoke("shareWeibo",{content:d.desc,url:d.link},function(){})}},g=!1;return function(a){g||(d(),g=!0),f(a)}}(),d=function(a){var b={},c=(a||location.search.substr(1)).split("&");return c.forEach(function(a){var c=a.split("=");2===c.length&&(b[decodeURIComponent(c[0])]=decodeURIComponent(c[1]))}),b},e={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(a){var b,c,d,f,g,h,i,j="",k=0;for(a=e._utf8_encode(a);k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),d=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|d>>6,i=63&d,isNaN(c)?h=i=64:isNaN(d)&&(i=64),j=j+this._keyStr.charAt(f)+this._keyStr.charAt(g)+this._keyStr.charAt(h)+this._keyStr.charAt(i);return j},decode:function(a){var b,c,d,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=this._keyStr.indexOf(a.charAt(k++)),g=this._keyStr.indexOf(a.charAt(k++)),h=this._keyStr.indexOf(a.charAt(k++)),i=this._keyStr.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,d=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(d));return j=e._utf8_decode(j)},_utf8_encode:function(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b},_utf8_decode:function(a){for(var b="",c=0,d=c1=c2=0;c<a.length;)d=a.charCodeAt(c),128>d?(b+=String.fromCharCode(d),c++):d>191&&224>d?(c2=a.charCodeAt(c+1),b+=String.fromCharCode((31&d)<<6|63&c2),c+=2):(c2=a.charCodeAt(c+1),c3=a.charCodeAt(c+2),b+=String.fromCharCode((15&d)<<12|(63&c2)<<6|63&c3),c+=3);return b}},f="http://jsapi.qq.com/get?api=app.share",g="http://open.mobile.qq.com/sdk/qqapi.js?_bid=152",h="http://mdc.html5.qq.com/d/directdown.jsp?channel_id=10349",i="mqqapi://share/to_fri?src_type=web&version=1&file_type=news&",j="https://api.weibo.com/oauth2/authorize?client_id=791268966&redirect_uri=http%3A%2F%2Finfoapp.3g.qq.com%2Fg%2Fapp_include%2Ftouch%2FshareSinaWbCallback.jsp%3Fdisplay%3Dmobile%26state%3D",k="mqqapi://share/to_qzone?src_type=app&version=1&file_type=news&req_type=1&",l="mqqapi://share/to_fri?file_type=news&src_type=app&version=1&generalpastboard=1&shareType=1&cflag=1&objectlocation=pasteboard&callback_type=scheme&callback_name=QQ41AF4B2A&",m=Config.platform,n=function(a){this.config=Object.create({title:document.title,description:document.title,img:"",url:location.href,state:"index5_show",ifMap:{wx:!0,sinaWb:!0,txWb:!0,qzone:!0,qq:!0},type:"link",dataUrl:"",trigger:function(){},success:function(){},cancel:function(){},fail:function(){}});for(var b in a)a.hasOwnProperty(b)&&(this.config[b]=a[b]);this.shareUrlMap={},this.sinaOauthUrl=j+this.config.state,this.init()};return n.prototype={constructor:n,init:function(){this._setShareUrlIf(),this._loadQbWxShareUrl(),this._initWxshareSet(),this._initMobileQQShareSet()},_setShareUrlIf:function(){this._filterShareUrlIf();var a=this.config,b=a.url,c=a.ifMap,d=this.shareUrlMap,e=b.split("#"),f=e[0].indexOf("?")>0?"&":"?",g=e[1]?"#"+e[1]:"",h=function(a){return e[0]+f+"g_f="+c[a]+g};d.wx=c.wx?h("wx"):b,d.sinaWb=c.sinaWb?h("sinaWb"):b,d.txWb=c.txWb?h("txWb"):b,d.qzone=c.qzone?h("qzone"):b,d.oriQQ=c.qq?h("qq"):b,d.qq=this._base64EncodeQQUrl(d.oriQQ)},_loadQbWxShareUrl:function(){var a=this;m.isFromQQBrower&&"undefined"==typeof browser?require.async(f,function(){a.otherWxShare()}):a.otherWxShare()},_filterShareUrlIf:function(){var a=this.config.url;if(this.config.url=a=a.replace(/([?&])sid=[^&#]*/g,"$1hasReplaceSid=1").replace(/oauth_state=0&/g,""),/i_f=/i.test(a)){var b=a.split("#"),c=b[1]?"#"+b[1]:"",d=b[0].split("?"),e=[];if(d[1]){var f=d[1].split("&");f.forEach(function(a){a.indexOf("i_f")<0&&e.push(a)})}this.config.url=d[0]+"?"+e.join("&")+c}},_initWxshareSet:function(){var a=this.config;c({title:a.title,desc:a.description,img_url:a.img,link:this.shareUrlMap.wx})},_initMobileQQShareSet:function(){var a=function(){mqq.data.setShareInfo({share_url:b.shareUrlMap.oriQQ,title:c.title,desc:c.description,image_url:c.img})},b=this,c=this.config;m.isFromQQ&&(window.mqq&&mqq.data&&mqq.data.setShareInfo?a():require.async(g,function(){a()}))},_base64EncodeQQUrl:function(a){return i+["share_id=1101685683","title="+e.encode(this.config.title),"thirdAppDisplayName="+e.encode("华扬腾亚"),"url="+e.encode(a)].join("&")},_shareQzoneWeb:function(){},qbWxShare:function(a){var b=this,c=this.config;window.browser&&browser.app&&browser.app.share&&browser.app.share({title:c.title,description:c.description,url:b.shareUrlMap.wx,img_url:c.img,to_app:a},function(a){1==a.code?c.success():c.fail()})},ucWxShare:function(a){var b=this.config,c=this.shareUrlMap.wx,d={ios:"kWeixinFriend",android:"WechatTimeline"};1==a&&(d.ios="kWeixin",d.android="WechatFriends"),m.isFromIos?ucbrowser&&ucbrowser.web_share(b.title,b.description,c,d.ios,"","@华扬腾亚",""):m.isFromAndroid&&ucweb&&ucweb.startRequest("shell.page_share",[b.title,b.description,c,d.android,"","",""])},otherWxShare:function(){var a=this,b=d();1==b.fromsharefriend&&m.isFromQQBrower?(history.replaceState(null,document.title,location.href.replace(/fromsharefriend=1/g,"")),a.qbWxShare(1)):1==b.fromsharetimeline&&m.isFromQQBrower&&(history.replaceState(null,document.title,location.href.replace(/fromsharetimeline=1/g,"")),a.qbWxShare(8))},isQbInstalled:function(a){a=a||{};var b=a.testUrl||location.href,c=a.onSucc,d=a.onFail,e=Date.now(),f=navigator.userAgent,g=f.match(/iphone\s*os\s*\d/gi),h=0,i=0;g&&(i=parseInt(g[0].split(" ")[2])),b="mttbrowser://url="+b.replace(/http:\/\//gi,"");var j=function(){e+=1e3,h+=1,h<3?setTimeout(j,1e3):Math.abs(e-Date.now())>1e3?c&&c():d&&d()};if(i>8)location.href=b;else{var k=document.createElement("iframe");k.src=b,k.id="qbInstallValidator_"+Date.now(),k.style.display="none",document.body.appendChild(k)}return setTimeout(j,1e3),setTimeout(function(){k&&k.parentNode&&k.parentNode.removeChild(k)},5e3),!1},bindWeixin:function(){var b=this,c=b.config,d={title:c.title,desc:c.description,imgUrl:c.img,link:c.url,type:c.type,dataUrl:c.dataUrl,trigger:c.trigger,success:c.success,cancel:c.cancel,fail:c.fail};a.ready(function(){a.onMenuShareAppMessage(d),a.onMenuShareTimeline(d),a.onMenuShareQQ(d),a.onMenuShareWeibo(d),a.onMenuShareQZone(d)})},callWxShare:function(a){var c=this,d=(c.config,location.href.split("#")),e=d[0].indexOf("?")>0?"&":"?",f=d[1]?"#"+d[1]:"",g=1==a?"fromsharefriend=1":"fromsharetimeline=1",i=d[0]+e+g+f;m.isFromWx?(b.share(),c.bindWeixin()):m.isFromQQ?b.share():m.isFromUC?this.ucWxShare(a):m.isFromQQBrower?this.qbWxShare(a):m.isFromQQBrowerLight?location.href=h:this.isQbInstalled({testUrl:i,onSucc:function(){},onFail:function(){location.href=h}})},shareWxTimeLine:function(){this.callWxShare(8)},shareWxFriend:function(){this.callWxShare(1)},shareSinaWb:function(){var a=this.config,b="http://v.t.sina.com.cn/share/share.php?",c=[];a.description&&c.push("title="+encodeURIComponent(a.description)),a.url&&c.push("url="+encodeURIComponent(a.url)),a.img&&c.push("pic="+encodeURIComponent(a.img)),m.isFromWx||m.isFromQQ?setTimeout(function(){window.location=b+c.join("&")},0):window.open(b+c.join("&"))},shareQzone:function(){var a,b,c,d,f=this,g=this.config,h=e.encode(g.img),i=e.encode(g.title),j=e.encode(g.description),n=e.encode(this.shareUrlMap.qzone),o=e.encode("华扬腾亚");d=m.isFromIos?l+["description="+j,"url="+n,"title="+i,"thirdAppDisplayName="+o,"previewimageUrl="+h].join("&"):k+["image_url="+h,"title="+i,"description="+j,"url="+n,"app_name="+o].join("&"),m.isFromQQBrower?this.callWxShare(3):(c=Date.now(),m.isFromAndroid&&m.isFromUC?(a=document.createElement("div"),a.style.visibility="hidden",a.innerHTML='<iframe src="'+d+'" scrolling="no" width="1" height="1"></iframe>',document.body.appendChild(a),setTimeout(function(){a&&a.parentNode&&a.parentNode.removeChild(a)},5e3)):m.isFromQQBrowerLight?f._shareQzoneWeb():(location.href=d,b=setTimeout(function(){Date.now()-c<1e3&&f._shareQzoneWeb()},1e3)))},shareTxWb:function(){var a=this.config,b="http://share.v.t.qq.com/index.php?c=share&a=index&",c=[];a.description&&c.push("title="+encodeURIComponent(a.description)),a.url&&c.push("url="+encodeURIComponent(a.url)),a.img&&c.push("pic="+encodeURIComponent(a.img)),m.isFromWx||m.isFromQQ?setTimeout(function(){window.location=b+c.join("&")},0):window.open(b+c.join("&"))},shareQQ:function(){var a=this.shareUrlMap.qq,b=null;m.isFromQQBrower?this.qbWxShare(4):m.isFromQQBrowerLight?location.href=h:m.isFromAndroid&&m.isFromUC?(b=document.createElement("div"),b.style.visibility="hidden",b.innerHTML='<iframe src="'+a+'" scrolling="no" width="1" height="1"></iframe>',document.body.appendChild(b),setTimeout(function(){b&&b.parentNode&&b.parentNode.removeChild(b)},5e3)):location.href=a}},n});