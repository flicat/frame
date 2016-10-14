define("public",[],function(require,exports){var a=Object.prototype.toString,b={weekFormatFull:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],weekFormat:["周日","周一","周二","周三","周四","周五","周六"]};return{forEachIn:function(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])},isEmpty:function(b){if(b&&"[object Object]"===a.call(b))for(var c in b)if(b.hasOwnProperty(c))return!1;return!0},isObject:function(b){return"[object Object]"===a.call(b)},isString:function(b){return"[object String]"===a.call(b)},isNumber:function(b){return"[object Number]"===a.call(b)},isDate:function(b){return"[object Date]"===a.call(b)},isArray:function(b){return"[object Array]"===a.call(b)},isBoolean:function(b){return"[object Boolean]"===a.call(b)},isFunction:function(b){return"[object Function]"===a.call(b)},getDateFromString:function(a){var b=null;if(!a||"[object String]"!=={}.toString.call(a)&&"[object Number]"!=={}.toString.call(a))a&&"[object Date]"==={}.toString.call(a)&&(b=a);else{var c=a.toString().match(/\d{4}\W\d{1,2}\W\d{1,2}/g)||"";if(c.length){var d=c[0].match(/\d{1,}/g);Number(d[0])>0&&Number(d[1])>0&&Number(d[2])>0&&(b=new Date(Number(d[0]),Number(d[1]-1),Number(d[2])))}else b=new Date,b.setTime(1e3*Number(a))}return b},getDateString:function(a,c,d){var e=this,f=e.getDateFromString(a);if(2==arguments.length&&("[object String]"!=={}.toString.call(c)?d=c:null),c="[object String]"==={}.toString.call(c)?c:"Y-M-D w",f){if(d)return Math.floor(f.getTime()/1e3);var g=String(f.getFullYear()),h=Number(f.getMonth())+1,a=Number(f.getDate()),i=b.weekFormatFull[f.getDay()],j=b.weekFormat[f.getDay()],k=f.getHours(),l=f.getMinutes(),m=f.getSeconds();return c.replace(/y+/g,g.substr(2,2)).replace(/m+/g,h).replace(/d+/g,a).replace(/w+/g,j).replace(/h+/g,k).replace(/i+/g,l).replace(/s+/g,m).replace(/Y+/g,g).replace(/M+/g,h<10?"0"+h:h).replace(/D+/g,a<10?"0"+a:a).replace(/W+/g,i).replace(/H+/g,k<10?"0"+k:k).replace(/I+/g,l<10?"0"+l:l).replace(/S+/g,m<10?"0"+m:m)}return""},getMonthDays:function(a,b){a=Number(a),b=Number(b);var c=function(a){return a%4===0&&(a%100!==0||a%400===0)};return c(a)&&2===b?29:c(a)||2!==b?4===b||6===b||9===b||11===b?30:31:28},plusDate:function(a,b,c){var d=this,e=new Date;return e.setDate(e.getDate()+a),d.getDateString(e,b,c)},getDaysNum:function(a,b){var c=this,d=c.getDateFromString(a),e=c.getDateFromString(b);return d&&e?(d.setHours(0,0,0,0),e.setHours(0,0,0,0),parseInt((e.getTime()-d.getTime())/864e5)):0},getSearchParam:function(a,b){var c=new RegExp("(^|&)"+a+"=([^&]*)(&|$)"),d=(b||location.search.substr(1)).match(c);return null!==d?decodeURIComponent(d[2]):""},getUrlParam:function(a){a=a||location.search.substr(1);var b={},c=a.split("&");return c.forEach(function(a){var c=a.indexOf("=");if(c>-1){var d=a.substr(0,c),e=decodeURIComponent(a.substr(c+1));d&&(b[d]=e||"")}}),b},pageRouter:function(a){var b=this;window.addEventListener("hashchange",function(){a(b.getUrlParam(location.hash.substr(1)))}),a(b.getUrlParam(location.hash.substr(1)))},stateRouter:function(a){var b=[];return window.addEventListener("popstate",function(c){var d=b.pop();d&&a(d)}),function(a){b.push(a),window.history.pushState(a,null,window.location)}}}});