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
    var popupType = '',
        popupElem = document.createElement('div'),
        popupContentElem = document.createElement('div');

    popupElem.className = 'popup';
    popupContentElem.className = 'popup-content';

    popupElem.appendChild(popupContentElem);
    document.body.appendChild(popupElem);

    // 显示/隐藏事件
    popupElem.show = function(type, msg) {
        popupType = type;
        popupElem.className = 'popup popup-' + type;
        popupElem.style.display = '';
        popupContentElem.innerHTML = temp[type](msg);
        typeof popupElem.onHide === 'function' && popupElem.onHide();
    };
    popupElem.hide = function() {
        popupElem.style.display = 'none';
    };

    popupElem.hide();

    // 点击隐藏
    popupElem.addEventListener('click', function() {
        popupType !== 'loading' && popupElem.hide();
    }, false);

    // 弹窗模板
    var temp = {
        success: function(msg) {
            return '<span class="popup-msg">' + msg + '</span>';
        },
        error: function(msg) {
            return '<span class="popup-msg">' + msg + '</span>';
        },
        fail: function(msg) {
            return '<span class="popup-msg">' + msg + '</span>';
        },
        loading: function() {
            return '<div class="clock"></div>';
        },
        share: function() {
            return '';
        }
    };

    module.exports = {
        success: function(msg, callback) {
            popupElem.show('success', msg);
            popupElem.onHide = callback;
        },
        error: function(msg, callback) {
            popupElem.show('error', msg);
            popupElem.onHide = callback;
        },
        fail: function(msg, callback) {
            popupElem.show('fail', msg);
            popupElem.onHide = callback;
        },
        loading: function(act) {
            popupElem[act] && popupElem[act]('loading');
        },
        share: function() {
            popupElem.show('share');
        }
    }
});
