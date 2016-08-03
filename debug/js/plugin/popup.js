/**
 * @Author: flicat
 * @Date: 15-4-2
 * @Describe: 弹窗插件
 *
 * popup.success('提示信息')
 * popup.error('提示信息')
 * popup.fail('提示信息')
 * popup.loading('show/hide' [, '提示信息'])
 */

define(function(require, exports, module) {
    var event = require('event') ;

    // HTML 节点
    var popupType = '',
        popupElem = document.createElement('div'),
        popupContentElem = document.createElement('div');

    popupElem.className = 'popup';
    popupContentElem.className = 'popup-content';

    popupElem.appendChild(popupContentElem);
    document.body.appendChild(popupElem);

    // 定时关闭事件
    var closeTimer = null;

    // 显示/隐藏事件
    popupElem.show = function(type, html) {
        popupType = type;
        popupElem.className = 'popup popup-' + type;
        popupElem.style.display = '';
        popupContentElem.innerHTML = html;

        if(/^success|error$/ig.test(type)){
            closeTimer = setTimeout(function() {
                popupElem.hide();
            }, 'success' == type ? 3000 : 5000);
        }
    };
    popupElem.hide = function() {
        clearTimeout(closeTimer);
        popupElem.style.display = 'none';
        popupElem.onHide && popupElem.onHide();
    };

    popupElem.hide();

    // 点击隐藏
    popupElem.addEventListener('click', function() {
        popupType !== 'loading' &&  popupType !== 'confirm' && popupElem.hide();

    }).addEventListener('click', '.js-cancel', function() {
        popupElem.hide();
        popupElem.cancelcall && popupElem.cancelcall();
    }).addEventListener('click', '.js-sure', function() {
        popupElem.hide();
        popupElem.surecall && popupElem.surecall();
    }) ;

    // 弹窗模板
    var temp = {
        success: function(msg) {
            return '<span class="popup-msg">' + msg + '</span>';
        },
        error: function(msg) {
            return '<span class="popup-msg">' + msg + '</span>';
        },
        confirm: function(msg, btnText){
            var cancelText = '取消', confirmText = '确认';
            // 自定义按钮文字
            if(btnText) {
                btnText.cancelText && (cancelText = btnText.cancelText);
                btnText.confirmText && (confirmText = btnText.confirmText);
            }
            return '<span class="popup-confirm-msg">' + msg + '</span>' +
                '<div class="popup-btn">' +
                '<a href="javascript:;" class="js-cancel">' + cancelText + '</a>' +
                '<a href="javascript:;" class="js-sure">' + confirmText + '</a>' +
                '</div>';
        } ,
        loading: function() {
            return '<div class="clock"></div>';
        },
        share: function() {
            return '';
        }
    };

    module.exports = {
        success: function(msg, callback) {
            popupElem.show('success', temp.success(msg));
            popupElem.onHide = callback;
        },
        error: function(msg, callback) {
            popupElem.show('error', temp.error(msg));
            popupElem.onHide = callback;
        },
        confirm: function(msg,surecall,cancelcall) {
            var btnText;
            if(({}).toString.call(arguments[arguments.length - 1]) === '[object Object]') {
                btnText = arguments[arguments.length - 1];
            }
            popupElem.show('confirm', temp.confirm(msg, btnText));
            popupElem.surecall = surecall ;
            popupElem.cancelcall = cancelcall ;
        },
        loading: function(act) {
            popupElem[act] && popupElem[act]('loading', temp.loading());
            popupElem.onHide = null;
        },
        share: function() {
            popupElem.show('share', temp.share());
            popupElem.onHide = null;
        }
    }
});
