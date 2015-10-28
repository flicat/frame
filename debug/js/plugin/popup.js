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
    // HTML 节点
    var type = '',
        popupElem = document.createElement('div'),
        popupContentElem = document.createElement('div'),
        popupCloseElem = document.createElement('i'),
        popupMsgElem = document.createElement('span');

    popupElem.className = 'popup';
    popupContentElem.className = 'popup-content';
    popupCloseElem.className = 'icon-close';
    popupCloseElem.innerHTML = '&times;';
    popupMsgElem.className = 'popup-msg';

    popupContentElem.appendChild(popupCloseElem);
    popupContentElem.appendChild(popupMsgElem);
    popupElem.appendChild(popupContentElem);
    document.body.appendChild(popupElem);

    // 显示/隐藏事件
    popupElem.show = function(msg) {
        popupMsgElem.innerHTML = msg || '';
        popupElem.style.display = '';

        if(/i(Phone|P(o|a)d)/.test(navigator.userAgent)) {
            document.body.scrollTop = 0;
        }
    };
    popupElem.hide = function() {
        popupElem.style.display = 'none';
        typeof popupElem.onHide === 'function' && popupElem.onHide();
    };

    popupElem.hide();

    // 点击隐藏
    if(/i(Phone|P(o|a)d)/.test(navigator.userAgent)) {
        popupElem.style.position = 'absolute';
        popupElem.style.left = '0px';
        popupElem.style.top = '0px';

        popupElem.addEventListener('touchstart', function(e) {
            if(type !== 'loading'){
                e.stopPropagation();
                e.preventDefault();
                popupElem.hide();
            }
        }, false);

    } else {
        popupElem.addEventListener('click', function() {
            type !== 'loading' && popupElem.hide();
        }, false);
    }

    module.exports = {
        success: function(msg, callback) {
            type = 'success';
            popupContentElem.className = 'popup-content popup-success';
            popupElem.show(msg);
            popupElem.onHide = callback;
        },
        error: function(msg, callback) {
            type = 'error';
            popupContentElem.className = 'popup-content popup-error';
            popupElem.show(msg);
            popupElem.onHide = callback;
        },
        fail: function(msg, callback) {
            type = 'fail';
            popupContentElem.className = 'popup-content popup-fail';
            popupElem.show(msg);
            popupElem.onHide = callback;
        },
        loading: function(act) {
            type = 'loading';
            popupContentElem.className = 'popup-content popup-loading';
            popupElem[act] && popupElem[act]();
        },
        share: function(act) {
            type = 'share';
            popupContentElem.className = 'popup-content popup-share';
            popupElem[act] && popupElem[act]();
        }
    }
});
