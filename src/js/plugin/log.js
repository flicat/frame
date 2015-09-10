/*!
 * @author liyuelong1020@gmail.com
 * @date 15-6-17 上午9:57
 * @version 1.0.0
 * @description 手机端控制台
 */

define(function(require, exports) {
    var log, textarea, icon;
    var isHidden = true;
    var createLog = function() {

        textarea = document.createElement('textarea');
        icon = document.createElement('i');
        log = document.createElement('div');
        icon.innerHTML = '&times;';

        textarea.style.cssText = 'border: 0;margin: 0;padding: 0;resize: none;background: #000;color: #fff;width: 100%;height: 5rem;color: #fff;font: 400 0.75rem/1rem "sans-serif";';
        icon.style.cssText = 'position: absolute;right: 0; top: 100%;display: block;width: 1.2rem;height: 1.2rem;background-color: #fff;box-shadow: 0 0 2px 2px #eee inset;color: #000;font: 400 0.75rem/1.2rem "sans-serif";text-align: center;';
        log.style.cssText = 'position: absolute;z-index: 9999;width: 100%;left: 0;font-size: 0;top: 0';

        log.appendChild(textarea);
        log.appendChild(icon);
        document.body.appendChild(log);

        isHidden = false;

        icon.addEventListener('click', function(e) {
            if(!isHidden){
                textarea.style.display = 'none';
                icon.style.left = 0;
                icon.style.right = 'auto';
                icon.innerHTML = '&gt;';
                isHidden = true;
            } else {
                textarea.style.display = '';
                icon.innerHTML = '&times;';
                icon.style.left = 'auto';
                icon.style.right = 0;
                isHidden = false;
            }
        }, false);
    };

    var is = function(name, obj) {
        return Object.prototype.toString.call(obj) === '[object ' + name + ']';
    };

    return function(obj) {
        var val = '';
        !log && createLog();
        isHidden && (textarea.style.display = '');
        [].slice.call(arguments).forEach(function(arg) {
            if(is('String', arg) || is('Number', arg) || is('Boolean', arg)){
                val += arg + '\n';
            } else {
                val += JSON.stringify(arg, null, '    ') + '\n';
            }
        });
        textarea.value += val;
    };
});
