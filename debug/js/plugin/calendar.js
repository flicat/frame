/*!
 * @author liyuelong1020@gmail.com
 * @date 2016/6/26 026
 * @description Description
 */

define(function (require, exports) {
    var event = require('event');

    /*
     * option:
     * @event 触发事件
     * @min 最小日期
     * @max 最大日期
     * @format 日期格式
     */

    var Calendar = function(option) {
        this.option = {
            'target': null,               // 触发日历的HTML节点
            'event': 'focus',             // 触发事件
            'default': new Date(),        // 默认日期
            'min': '',                    // 最小日期
            'max': '',                    // 最大日期
            'format': 'Y-M-D'             // 日期格式
        };
        if(({}).toString.call(option) === '[object Object]'){
            for(var key in option){
                if(option.hasOwnProperty(key) && option[key]){
                    this.option[key] = option[key];
                }
            }
        }

        // 当前显示日期
        var currentDateStamp = this.getDateFromString(this.option.default);
        // 最大日期
        var maxDateStamp = this.getDateFromString(this.option.max);
        // 最小日期
        var minDateStamp = this.getDateFromString(this.option.min);

        // 当前显示日期
        this.currentYear = Number(currentDateStamp.getFullYear());
        this.currentMonth = Number(currentDateStamp.getMonth());
        this.currentDate = Number(currentDateStamp.getDate());

        // 最大日期
        this.maxYear = maxDateStamp ? maxDateStamp.getFullYear() : Number(this.currentYear) + 100;
        this.maxMonth = maxDateStamp ? maxDateStamp.getMonth() : 11;
        this.maxDate = maxDateStamp ? maxDateStamp.getDate() : 31;

        // 最小日期
        this.minYear = minDateStamp ? minDateStamp.getFullYear() : Number(this.currentYear) - 100;
        this.minMonth = minDateStamp ? minDateStamp.getMonth() : 0;
        this.minDate = minDateStamp ? minDateStamp.getDate() : 1;

        this.init();
    };

    Calendar.prototype = {
        constructor: Calendar,

        weekLang: ['星期日' , '星期一' , '星期二' , '星期三' , '星期四' , '星期五' , '星期六'],
        weekMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

        // 从字符串中获取日期对象
        getDateFromString: function(date) {
            var dataObj = null;
            if (date && (({}).toString.call(date) === '[object String]' || ({}).toString.call(date) === '[object Number]')) {

                var dataStr = date.toString().match(/\d{4}\W\d{1,2}\W\d{1,2}/g) || '';
                if(dataStr.length){
                    var _dataStr = dataStr[0].match(/\d{1,}/g);

                    if(Number(_dataStr[0]) > 0 && Number(_dataStr[1]) > 0 && Number(_dataStr[2]) > 0){
                        dataObj = new Date(Number(_dataStr[0]), Number(_dataStr[1] - 1), Number(_dataStr[2]));
                    }
                } else {
                    dataObj = new Date();
                    dataObj.setTime(Number(date) * 1000);
                }

            } else if (date && ({}).toString.call(date) === '[object Date]') {
                dataObj = date;
            }
            return dataObj;
        },

        // 获取特定格式日期字符串
        getDateString: function(date , format , isStamp) {
            var that = this;
            var dTemp = that.getDateFromString(date);

            if(arguments.length == 2){
                !(({}).toString.call(format) === '[object String]') ? isStamp = format : null;
            }
            format = (({}).toString.call(format) === '[object String]') ? format : 'Y-M-D w';

            if(dTemp){

                if(!!isStamp){
                    return Math.floor(dTemp.getTime() / 1000);
                } else {

                    var year = String(dTemp.getFullYear());                // 年
                    var mon = Number(dTemp.getMonth()) + 1;                // 月
                    var date = Number(dTemp.getDate());                    // 日
                    var day = that.weekLang[dTemp.getDay()];                // 星期
                    var dayMin = that.weekMin[dTemp.getDay()];              // 星期缩写

                    var hours = dTemp.getHours();                          // 时
                    var minutes = dTemp.getMinutes();                      // 分
                    var seconds = dTemp.getSeconds();                      // 秒

                    return format
                        .replace(/y+/g, year.substr(2, 2))
                        .replace(/m+/g, mon)
                        .replace(/d+/g, date)
                        .replace(/w+/g, dayMin)
                        .replace(/h+/ig, hours)
                        .replace(/i+/ig, minutes)
                        .replace(/s+/ig, seconds)

                        .replace(/Y+/g, year)
                        .replace(/M+/g, mon < 10 ? '0' + mon: mon)
                        .replace(/D+/g, date < 10 ? '0' + date: date)
                        .replace(/W+/g, day)
                        .replace(/H+/ig, hours < 10 ? '0' + hours: hours)
                        .replace(/I+/ig, minutes < 10 ? '0' + minutes: minutes)
                        .replace(/S+/ig, seconds < 10 ? '0' + seconds: seconds)
                }

            } else {
                return '';
            }
        },

        // 获取一个月的天数
        getMonthDays: function(yy, mm) {
            yy = Number(yy), mm = Number(mm);
            var getCheckYear = function(yy) {
                if (yy % 4 !== 0) {
                    return false;
                }
                if (yy % 100 === 0 && yy % 400 !== 0) {
                    return false;
                }
                return true;
            };

            if (getCheckYear(yy) && mm === 2) {
                return 29;
            }

            if (!getCheckYear(yy) && mm === 2) {
                return 28;
            }

            if (mm === 4 || mm === 6 || mm === 9 || mm === 11) {
                return 30;
            }

            return 31;
        },

        // 根据传入参数返回当前日期的前几天或后几天
        plusDate: function(n, format, isStamp) {
            var that = this;
            var uom = new Date();
            uom.setDate(uom.getDate() + n);
            return that.getDateString(uom, format, isStamp);
        },

        // 获取日期相差天数
        getDaysNum: function (time1 , time2){

            var that = this;
            var _times1 = that.getDateFromString(time1);
            var _times2 = that.getDateFromString(time2);

            if(_times1 && _times2){
                _times1.setHours(0,0,0,0);
                _times2.setHours(0,0,0,0);
                return parseInt((_times2.getTime() - _times1.getTime()) / 8.64E7);
            } else {
                return 0;
            }

        },

        // 选择年
        selectYear: function() {
            var that = this;
            var index = Math.round(that.wrapYear.scrollTop / that.pxHeight);
            that.wrapYear.scrollTop = index * that.pxHeight;

            if(that.currentYearNode) {
                that.currentYearNode.classList.remove('active');
            }
            that.currentYearNode = that.wrapYear.children[index + 2];
            that.currentYearNode.classList.add('active');
            that.currentYear = that.currentYearNode.getAttribute('data-year');

            that.renderMonth();
            that.scrollMonth();
            that.renderDate();
            that.scrollDate();
        },

        // 选择月
        selectMonth: function() {
            var that = this;
            var index = Math.round(that.wrapMonth.scrollTop / that.pxHeight);
            that.wrapMonth.scrollTop = index * that.pxHeight;

            if(that.currentMonthNode) {
                that.currentMonthNode.classList.remove('active');
            }
            that.currentMonthNode = that.wrapMonth.children[index + 2];
            that.currentMonthNode.classList.add('active');
            that.currentMonth = that.currentMonthNode.getAttribute('data-month');

            that.renderDate();
            that.scrollDate();
        },

        // 选择日
        selectDate: function() {
            var that = this;
            var index = Math.round(that.wrapDate.scrollTop / that.pxHeight);
            that.wrapDate.scrollTop = index * that.pxHeight;

            if(that.currentDateNode) {
                that.currentDateNode.classList.remove('active');
            }
            that.currentDateNode = that.wrapDate.children[index + 2];
            that.currentDateNode.classList.add('active');
            that.currentDate = that.currentDateNode.getAttribute('data-date');
        },

        // 生成年HTML
        renderYear: function() {
            var yearHtml = '<span></span><span></span>';
            for(var y = this.minYear; y <= this.maxYear; y++){
                yearHtml += '<span data-year="' + y + '">' + y + '</span>';
            }
            yearHtml += '<span></span><span></span>';

            this.wrapYear.innerHTML = yearHtml;
        },

        // 生成月
        renderMonth: function() {
            var that = this;
            var monthHtml = '<span></span><span></span>';
            var minMonth = 0, maxMonth = 11;

            if(that.minYear == that.currentYear){
                minMonth = that.minMonth;
            }
            if(that.maxYear == that.currentYear){
                maxMonth = that.maxMonth;
            }

            for(var m = minMonth; m <= maxMonth; m++){
                monthHtml += '<span data-month="' + m + '">' + (m + 1) + '</span>';
            }
            monthHtml += '<span></span><span></span>';
            this.wrapMonth.innerHTML = monthHtml;
        },

        // 生成日
        renderDate: function() {
            var that = this;
            var dateHtml = '<span></span><span></span>';
            var minDate = 1, maxDate = that.getMonthDays(that.currentYear, Number(that.currentMonth) + 1);

            if(that.minYear == that.currentYear && that.minMonth == that.currentMonth){
                minDate = that.minDate;
            }
            if(that.maxYear == that.currentYear && that.maxMonth == that.currentMonth){
                maxDate = that.maxDate;
            }
            for(var d = minDate; d <= maxDate; d++){
                dateHtml += '<span data-date="' + d + '">' + d + '</span>';
            }
            dateHtml += '<span></span><span></span>';
            this.wrapDate.innerHTML = dateHtml;
        },

        // 滚动到当前年
        scrollYear: function() {
            var that = this;
            that.wrapYear.scrollTop = (that.currentYear - that.minYear) * that.pxHeight;
            that.selectYear();
        },

        // 滚动到当前月
        scrollMonth: function() {
            var that = this;
            var firstMonth = that.minYear == that.currentYear ? that.minMonth : 0;
            if(that.currentMonth < firstMonth){
                that.currentMonth = firstMonth;
            }
            if(that.maxYear == that.currentYear && that.currentMonth > that.maxMonth){
                that.currentMonth = that.maxMonth;
            }
            that.wrapMonth.scrollTop = (that.currentMonth - firstMonth) * that.pxHeight;
            that.selectMonth();
        },

        // 滚动到当前日
        scrollDate: function() {
            var that = this;
            var firstDate = that.minYear == that.currentYear && that.minMonth == that.currentMonth ? that.minDate : 1;
            if(that.currentDate < firstDate){
                that.currentDate = firstDate;
            }
            if(that.maxYear == that.currentYear && that.maxMonth == that.currentMonth && that.maxDate < that.currentDate){
                that.currentDate = that.maxDate;
            }
            that.wrapDate.scrollTop = (that.currentDate - firstDate) * that.pxHeight;
            that.selectDate();
        },

        // 打开日历
        show: function() {
            var that = this;
            that.calNode.style.display = 'block';
            that.pxHeight = that.wrapYear.scrollHeight / that.wrapYear.children.length;

            that.scrollYear();
            that.scrollMonth();
            that.scrollDate();
        },

        // 关闭日历
        hide: function() {
            this.calNode.style.display = 'none';
        },

        init: function() {
            var that = this;
            var option = that.option;

            if(option.target){
                that.calNode = document.createElement('div');
                that.calNode.className = 'calendar';

                that.calNode.innerHTML = '<div class="cal-content">' +
                                            '<div class="cal-bar">' +
                                                '<a href="javascript:;" class="btn-cancel">取消</a>' +
                                                '<a href="javascript:;" class="btn-confirm">确定</a>' +
                                            '</div>' +
                                            '<div class="cal-row">' +
                                                '<div class="cal-current">' +
                                                    '<span>年</span>' +
                                                    '<span>月</span>' +
                                                    '<span>日</span>' +
                                                '</div>' +
                                                '<div class="cal-cell year">' +
                                                '</div>' +
                                                '<div class="cal-cell month">' +
                                                '</div>' +
                                                '<div class="cal-cell date">' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>';

                document.body.appendChild(that.calNode);

                that.btnCancel = that.calNode.querySelector('.btn-cancel');
                that.btnConfirm = that.calNode.querySelector('.btn-confirm');
                that.wrapYear = that.calNode.querySelector('.year');
                that.wrapMonth = that.calNode.querySelector('.month');
                that.wrapDate = that.calNode.querySelector('.date');

                // 滑动选择日期
                var timerY = null, timerM = null, timerD = null;
                that.wrapYear.addEventListener('scroll', function() {
                    clearTimeout(timerY);
                    timerY = setTimeout(function() {
                        that.selectYear();
                    }, 100);
                });
                that.wrapMonth.addEventListener('scroll', function() {
                    clearTimeout(timerM);
                    timerM = setTimeout(function() {
                        that.selectMonth();
                    }, 100);
                });
                that.wrapDate.addEventListener('scroll', function() {
                    clearTimeout(timerD);
                    timerD = setTimeout(function() {
                        that.selectDate();
                    }, 100);
                });


                // 点击打开日历
                option.target.addEventListener(option.event, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var defaultTime = that.getDateFromString(this.value);
                    if(defaultTime){
                        that.currentYear = Number(defaultTime.getFullYear());
                        that.currentMonth = Number(defaultTime.getMonth());
                        that.currentDate = Number(defaultTime.getDate());
                    }
                    that.show();
                });

                // 点击选择日期
                that.btnConfirm.addEventListener('click', function() {
                    option.target.value = that.getDateString(new Date(that.currentYear, that.currentMonth, that.currentDate), option.format);
                    option.target.trigger('input');
                    option.target.trigger('change');
                    that.hide();
                });

                // 点击关闭
                that.btnCancel.addEventListener('click', function() {
                    that.hide();
                });

                // 生成日历
                that.renderYear();
                that.renderMonth();
                that.renderDate();
            }
        }
    };


    return Calendar;

});