/*!
 * @author liyuelong1020@gmail.com
 * @date 2016/6/14 014
 * @description Exbind 扩展插件
 */

define('widget', ['exbind', 'event', 'public','ajax','popup'], function (require, exports) {
    var exbind = require('exbind');
    var event = require('event');
    var Public = require('public');
    var ajax = require('ajax');
    var popup = require('popup');

    /* 日历控件
    * param： range 日历选择范围 1：只能选择今天以前的日期  2：只能选择今天以后的日期
    */
    exbind.register('calendar', 'load', function(e) {
        var param = e.param,
            node = this;

        require.async('calendar', function(Calendar) {
            var option = {
                'target': node,               // 触发日历的HTML节点
                'event': 'click',             // 触发事件
                'format': 'Y-M-D'             // 日期格式
            };

            if(param.range == '1'){
                option.max = new Date();       // 最大日期
            } else if(param.range == '2'){
                option.min = new Date();      // 最小日期
            }

            new Calendar(option)
        });
    });

    // toggle class
    exbind.register('toggle', 'load', function(e) {
        var node = this,
            className = e.param.class,
            eventName = e.param.event || 'click',
            hasClass = [].slice.call(node.classList).indexOf(className) > -1;

        node.addEventListener(eventName, function() {
            if(hasClass){
                node.classList.remove(className);
            } else {
                node.classList.add(className);
            }
            hasClass = !hasClass;
        })
    });

    /**
     * 全选复选框
     * 控件名称：data-act="select"
     * 控件参数：data-param="class=@class&type=@type"
     *
     * @class：需要全选的复选框按钮组的class名称
     * @type：全选类型  1（只有全部按钮选中，全选按钮才会勾上）|2（只要有一个按钮选中，全选按钮就会勾上）
     */
    exbind.register('select', 'load', function(e) {
        var elem = this,
            inputGroup,
            name = e.param['class'],
            type = e.param['type'] || 1;

        if(name){
            inputGroup = [].slice.call(document.querySelectorAll('input[type="checkbox"].' + name));

            elem.__select_down__ = function(isChecked) {
                // 向下全选事件
                inputGroup.forEach(function(input) {
                    input.checked = isChecked;
                    // 向下全选事件
                    input.__select_down__ &&  input.__select_down__(isChecked);
                });
            };

            // 绑定点击事件
            elem.off('click.select').on('click.select', function() {
                var isChecked = this.checked;
                // 向下全选事件
                elem.__select_down__ &&  elem.__select_down__(isChecked);
                // 向上全选事件
                elem.__select_up__ &&  elem.__select_up__(isChecked);
            });

            inputGroup.forEach(function(input) {
                input.__select_up__ = function(isChecked) {
                    var isSelectAll = isChecked;
                    if(type == '1'){
                        inputGroup.forEach(function(input) {
                            if(!input.checked){
                                isSelectAll = false;
                            }
                        });
                    } else if(type == '2'){
                        inputGroup.forEach(function(input) {
                            if(input.checked){
                                isSelectAll = true;
                            }
                        });
                    }
                    elem.checked = isSelectAll;

                    // 向上全选事件
                    elem.__select_up__ &&  elem.__select_up__(isSelectAll);
                };
                input.off('click.select').on('click.select', function() {
                    var isChecked = this.checked;
                    // 向下全选事件
                    input.__select_down__ &&  input.__select_down__(isChecked);
                    // 向上全选事件
                    input.__select_up__ &&  input.__select_up__(isChecked);
                });

                input.__select_up__(input.checked);
            });
        }
    });

    /* tab选项卡
    * tab标题类名 js-tab-title
    * tab内容类名 js-tab-content
    *
    */
    exbind.register('tab', 'load', function() {
        var node = this;

        var tabTitle = [].slice.call(node.querySelectorAll('.js-tab-title'));
        var tabContent = [].slice.call(node.querySelectorAll('.js-tab-content'));

        var currentTitle = tabTitle[0], currentContent = tabContent[0];

        tabTitle.forEach(function(title, index) {
            title.addEventListener('click', function() {
                currentTitle.classList.remove('active');
                currentTitle = title;
                currentTitle.classList.add('active');

                currentContent.classList.add('hide');
                currentContent = tabContent[index];
                currentContent.classList.remove('hide');
            });
            title.classList.remove('active');
            tabContent[index].classList.add('hide');
        });

        currentTitle.classList.add('active');
        currentContent.classList.remove('hide');
    });

    /* 首页顶部轮播插件
    *
    * auto: 是否自动轮播 0 不自动轮播 1 自动轮播 默认1
    * */
    exbind.register('swipe', 'load', function(e) {
        var wrap = this,
            auto = !!Number(e.param.auto || 1),
            list = this.children[0],
            item = [].slice.call(list.children),
            winWidth = wrap.clientWidth;

        if(winWidth == 0){
            winWidth = window.innerWidth;
        }

        if(item.length > 1){

            var circle = document.createElement('div'),
                circleInner = '',
                timer = null;

            circle.className = 'scroll-icon';

            list.style.width = winWidth * item.length + 'px';
            item.forEach(function(li, i) {
                circleInner += '<span' + (i == 0 ? ' class="active"' : '') + '></span>';
                li.style.width = winWidth + 'px';
            });
            circle.innerHTML = circleInner;
            wrap.appendChild(circle);

            var circleItem = [].slice.call(circle.children),
                defaultItem = circleItem[0],
                scrollIndex = 0;

            var autoScroll = function() {
                clearInterval(timer);
                // 自动轮播
                if(auto){
                    timer = setInterval(function() {
                        scrollIndex++;
                        if(scrollIndex >= item.length){
                            scrollIndex = 0;
                        }
                        scroll();
                    }, 3000);
                }
            };

            var scroll = function() {
                list.style.transition = list.style.webkitTransition = 'all .3s ease';
                setTimeout(function() {
                    defaultItem && defaultItem.classList.remove('active');
                    circleItem[scrollIndex].classList.add('active');
                    defaultItem = circleItem[scrollIndex];
                    list.style.transform = list.style.webkitTransform = 'translateX(' + (- winWidth * scrollIndex) + 'px)';
                }, 10);
            };

            wrap.addEventListener('touchstart', function() {
                list.style.transition = list.style.webkitTransition = 'none';
                clearInterval(timer);
            });
            wrap.addEventListener('swipe', function(e) {
                var diffX = e.data.diffX.keys(0),
                    diffY = e.data.diffY.keys(0);

                if(Math.abs(diffX) > Math.abs(diffY)){
                    e.stopPropagation();
                    e.preventDefault();

                    list.style.transform = list.style.webkitTransform = 'translateX(' + (- winWidth * scrollIndex + diffX) + 'px)';
                }
            });
            wrap.addEventListener('swipeEnd', function(e) {
                var diffX = e.data.diffX.keys(0),
                    diffY = e.data.diffY.keys(0);

                if(Math.abs(diffX) > Math.abs(diffY)){
                    if(diffX > 0){
                        scrollIndex--;
                        if(scrollIndex < 0){
                            scrollIndex = 0
                        }
                    } else {
                        scrollIndex++;
                        if(scrollIndex >= item.length){
                            scrollIndex = item.length - 1;
                        }
                    }
                }

                autoScroll();
                scroll();
            });

            autoScroll();
        }
    });

});
