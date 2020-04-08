import layerVue from './layer.vue';
import maskVue from './mask.vue';

let Notification = (function (Vue, globalOption = {
    msgtime: 1.5, //msg消失时间
}) {
    let NotificationConstructor = Vue.extend(layerVue);
    let maskLayer = Vue.extend(maskVue);
    let self = {};
    const defOptions = {
        type: 0, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '信息',
        content: '',
        area: 'auto',
        offset: 'auto',
        icon: -1,
        btn: '确定',
        time: 0,
        maxmin: false, //最大最小化
        shade: true,
        yes: '',
        cancel: '',
        tips: [0, {}], //支持上右下左四个方向，通过1-4进行方向设定,可以设定tips: [1, '#c00']
        tipsMore: false, //是否允许多个tips
        shadeClose: true,
        scrollbar: true, //是否允许浏览器出现滚动条:默认是允许
        resize: false //是否允许拉伸，默认是不允许
    };
    self.instances = {};
    self.instancesVue = [];
    let seed = 0;


    /**
     * [function description]
     * @method function
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    self.open = function (options) {
        options = mergeJson(options, defOptions);

        if (options.id) {

        } else {
            options.id = `notification_${new Date().getTime()}_${seed++}`;
            self.instancesVue[options.id] = {};
            self.instances[options.id] = {};
        }


        options.layer = self;
        let instance = new NotificationConstructor({
            data: options
        });

        if (options.type == 2) {
            options.content.content = Vue.extend(options.content.content);
        }
        if (options.type == 7) {
            options.content.content = Vue.extend(options.content.content);
        }


        instance.id = options.id;

        instance.vm = instance.$mount();

        self.instances[options.id].inst = instance;
        self.instances[options.id].type = options.type;
        /*
                self.instances[options.id] = {
                    inst: instance,
                    type: options.type
                };
        */


        document.body.appendChild(instance.vm.$el);
        self.instancesVue[options.id].mask = ''
        self.instancesVue[options.id].main = instance.vm
        self.instancesVue[options.id].iframe = ''
        /*       self.instancesVue[options.id] = {
                   'mask': '',
                   'main': instance.vm,
                   'iframe': '',
               }
       */

        if (options.shade) { //是否显示遮罩，始终添加遮罩
            // let layerMask = document.querySelector('.vl-notify-mask');
            // if (layerMask) { //layerMask
            // return;
            // document.body.removeChild(layerMask);
            // } else {
            let maskInstance = new maskLayer({
                data: options
            });
            maskInstance.vm = maskInstance.$mount();
            // document.body.appendChild(maskInstance.vm.$el);
            document.body.insertBefore(maskInstance.vm.$el, instance.vm.$el);
            self.instancesVue[options.id].mask = maskInstance.vm;
            // }
        }
        return options.id;
    };
    /**
     * alert
     * @param  {[type]} content [description]
     * @param  {[type]} options [description]
     * @param  {[type]} yes     [description]
     * @return {[type]}         [description]
     */
    self.alert = function (content, options, yes) {
        switch (typeof (options)) {
            case 'function':
                yes = options;
                options = {};
                break;
            case 'object':
                break;
            default:
                options = {};
                break;
        }
        yes = typeof (yes) === 'function' ? yes : '';

        options.content = content || '';
        options.yes = yes;
        return self.open(options);
    }
    /**
     * alert
     * @param  {[type]} content [description]
     * @param  {[type]} options [description]
     * @param  {[type]} yes     [description]
     * @return {[type]}         [description]
     */
    self.confirm = function (content, options, yes, cancel) {
        switch (typeof (options)) {
            case 'function':
                cancel = yes;
                yes = options;
                options = {};
                break;
            case 'object':
                break;
            default:
                options = {};
                break;
        }
        yes = typeof (yes) === 'function' ? yes : '';
        cancel = typeof (cancel) === 'function' ? cancel : 'cancel';

        options.content = content || '';
        options.yes = yes;
        options.cancel = cancel;
        return self.open(options);
    }
    /**
     * [function description]
     * @method function
     * @param  {[type]} content [description]
     * @param  {[type]} options [description]
     * @param  {[type]} end     [description]
     * @return {[type]}         [description]
     */
    self.msg = function (content, options, end) {
        switch (typeof (options)) {
            case 'function':
                end = options;
                options = {};
                break;
            case 'object':
                break;
            default:
                options = {};
                break;
        }
        end = typeof (end) === 'function' ? end : '';
        options.type = 5;
        options.time = options.time ? options.time : globalOption.msgtime;
        options.content = content || 'this is a msg!!';
        options.yes = end;
        if (options.shade == undefined) {
            options.shade = false;
        }
        self.closeAll('msg');
        return self.open(options);
    }
    //loading
    self.loading = function (icon, options) {
        if (typeof (icon) === 'object') {
            options = icon;
            icon = 0;
        }
        options = options || {};
        options.icon = icon ? icon : 0;
        if (options.icon < 0 || options.icon > 2) {
            options.icon = 0;
        }
        if (!options.time) {//单位秒
            options.time = 100;
        }
        options.type = 3;
        if (options.shade == undefined) {
            options.shade = true;
        }
        if (options.shadeClose == undefined) {
            options.shadeClose = false;
        }
        return self.open(options);
    }
    /**
     * tips
     * @method function
     * @param  {[type]} content [description]
     * @param  {[type]} follow  [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    self.tips = function (content, follow, options) {


        //为了能兼容直接传入 元素对象
        let element = follow;
        if (typeof follow == "object") {
            const className = "active" + new Date().getTime();
            follow.classList.add(className)
            element = "." + className;
        }

        options = options || {};
        options.type = 4;
        options.content = content || '';
        options.title = element || 'body';
        options.tips = options.tips || [0, {}];
        if (typeof (options.tips) !== 'object') {
            options.tips = [options.tips, {}];
        }
        if (options.shade == undefined) {
            options.shade = false;
        }
        if (!options.tipsMore) {
            self.closeAll('tips');
        }

        return self.open(options);
    }


    /**
     * tips
     * @method function
     * @param  {[type]} content [description]
     * @param  {[type]} follow  [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    self.point = function (point, options) {
        options = options || {};
        options.point = point;
        options.type = 7;
        options.tips = options.tips || [0, {}];
        /*
                //options.id = "nnnnid"
        */

        if (options.id) {
            if (self.instancesVue[options.id]) {
                if (self.instancesVue[options.id].canDraw) {
                    self.instancesVue[options.id].main.$options.methods.reDrawPoint.call(self.instancesVue[options.id].main, options)
                    self.instancesVue[options.id].main.$options.methods.setPointData.call(self.instancesVue[options.id].main, options.content.data)
                    self.instancesVue[options.id].canDraw = false;
                }
                clearTimeout(self.instancesVue[options.id].timeOut)
                self.instancesVue[options.id].timeOut = setTimeout(function () {
                    self.instancesVue[options.id].main.$options.methods.reDrawPoint.call(self.instancesVue[options.id].main, options)
                    self.instancesVue[options.id].main.$options.methods.setPointData.call(self.instancesVue[options.id].main, options.content.data)
                    clearInterval(self.instancesVue[options.id].timeInterval)
                    self.instancesVue[options.id].timeInterval = null
                }, 60)
                if (!self.instancesVue[options.id].timeInterval) {
                    self.instancesVue[options.id].timeInterval = setInterval(function () {
                        self.instancesVue[options.id].canDraw = true
                    }, 60)
                }
            } else {
                self.instances[options.id] = {};
                self.instancesVue[options.id] = {};
                self.pointOpen(options)
            }
        } else {
            self.pointOpen(options)
        }
    }

    self.pointOpen = function (options) {
        if (typeof (options.tips) !== 'object') {
            options.tips = [options.tips, {}];
        }
        if (options.shade == undefined) {
            options.shade = false;
        }

        if (!options.tipsMore) {
            self.closeAll('point');
        }

        return self.open(options);
    },

        /**
         * [description]
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        self.iframe = function (opt) {
            let option = {
                type: 2,
                content: opt.content,
                area: opt.area
            };
            option = mergeJson(option, opt);
            return self.open(option);
        }
    /**
     * 获取信息框
     */
    self.prompt = function (title = '请填写', yes = '', cancel = '', options = {
        formType: 1,
        value: ''
    }) {
        switch (typeof (cancel)) {
            case 'object':
                options = cancel;
                break;
        }

        options.content = '';
        options.yes = yes;
        options.type = 6;
        options.title = title;
        return self.open(options);
    }
    /**
     * 关闭一个弹窗
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    self.close = function (id) {
        if (id instanceof Object) {

            id = id.layerIdACUJSK
        }
        let oElm = document.getElementById(id);
        if (oElm) {
            document.body.removeChild(oElm);
            delete self.instances[id];
            self.instancesVue[id].main.$destroy();
            if (self.instancesVue[id].iframe != '') {
                self.instancesVue[id].iframe.$destroy();
            }
            //取消隐藏滚动条
            if (!self.instancesVue[id].main.scrollbar) {
                let scrollbarCount = 0;
                for (let key in self.instancesVue) {
                    if (!self.instancesVue[key].main.scrollbar) {
                        scrollbarCount++;
                    }
                }
                if (scrollbarCount === 1) {
                    const htmlDom = document.getElementsByTagName("html")[0];
                    htmlDom.style.marginRight = "auto";
                    htmlDom.classList.remove('vl-html-scrollbar-hidden');
                }
            }
            //控制遮罩,删除掉当前的遮罩
            if (self.instancesVue[id].main.shade) {
                let layerMask = document.getElementById(id + '_mask');
                let maskId = id + '_mask';
                document.body.removeChild(layerMask);
                if (self.instancesVue[maskId]) {
                    self.instancesVue[maskId].mask.$destroy();
                }
            }
            delete self.instancesVue[id];
        } else {
            setTimeout(function () {
                let oElm = document.getElementById(id);
                if (oElm) {
                    document.body.removeChild(oElm);
                    delete self.instances[id];
                    self.instancesVue[id].main.$destroy();
                    if (self.instancesVue[id].iframe != '') {
                        self.instancesVue[id].iframe.$destroy();
                    }
                }
            }, 200);
        }
    }
    /**
     * 关闭一个弹窗
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    self.closeAll = function (type = -1) {
        let types = {
            'alert': 0,
            'page': 1,
            'iframe': 2,
            'loading': 3,
            'tips': 4,
            'msg': 5,
            'point': 7,
        };


        if (type === -1) {
            for (let k in self.instances) {
                self.close(k);
            }
        } else {
            let targetType = types[type];
            for (let k in self.instances) {
                if (self.instances[k].type === targetType) {
                    self.close(k);
                }
            }
        }
    }
    /**
     * 手动最大化
     */
    self.full = function (id = '') {
        document.querySelector('#' + id + ' .lv-icon-max').click();
    }
    /**
     * 手动最小化
     */
    self.min = function (id = '') {
        document.querySelector('#' + id + ' .lv-icon-mini').click();
    }
    /**
     * 手动最小化
     */
    self.restore = function (id = '') {
        document.querySelector('#' + id + ' .lv-icon-huanyuan').click();
    }


    /**
     * get offset
     */
    // function getOffset() {
    //   let offset = [];
    //   offset.push(document.body.clientWidth);
    //   offset.push(document.body.clientHeight);
    //   return offset;
    // }

    /**
     * 合并json
     * @method mergeJson
     * @param  {[type]}  optons [description]
     * @param  {[type]}  def    [description]
     * @return {[type]}         [description]
     */
    function mergeJson(options, def) {
        for (let key in def) {
            if (options[key] == undefined) {
                options[key] = def[key];
            }
        }
        return options;
    }

    return self;
});

// module.exports = Notification;
export default Notification;
