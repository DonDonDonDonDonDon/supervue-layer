<template>


    <div

            v-click-outside=closeConditional
            class="vl-notify-point"
            :class="[this.options.tips[1],'vl-notify-tips-'+ this.options.tips[0]]"
            :id="options.id"
    >
        <div class="vl-notify-content" :id="id"></div>


        <em></em>
    </div>
</template>

<script>
    import helper from "./helper/helper";
    import ClickOutside from "./helper/clickoutside";

    export default {
        data() {
            return {
                timeout: '',
                id: "vlip" + new Date().getTime(),
                instance: null,
                closeConditionalTimeOut:null,
                allowCloseOutside:false,  //is not allow closeOutSide when the layer create just generated
            }
        },
        directives: {
            ClickOutside,
        },
        props: {
            options: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        computed: {
            offset() {
                return this.getOffset();
            }
        },
        async mounted() {

            let self = this;
            if (this.options.time == 0) {
                this.options.time = 2;
            }

            setTimeout(function () {
                self.btnyes();
            }, self.options.time * 200);

            setTimeout(function () {
                self.allowCloseOutside = true;
            },  200);

            await this.getOffset(this.options.point);
            this.getContent()
        },
        methods: {
            closeConditional(e){
                if(this.allowCloseOutside){
                    if(this.options.clickOutDismiss){
                        this.closeConditionalTimeOut =  setTimeout(()=>{
                            this.options.layer.close(this.options.id);
                        },200)
                    }
                }
            },
            reDraw(options) {
                this.getOffset(options.point)
            },
            setData(data) {
                if(this.closeConditionalTimeOut!=null){
                    clearTimeout(this.closeConditionalTimeOut)
                }
                this.instance.$data.layerData = data
            },
            'btnyes': function () {
                let o = document.getElementById(this.options.id);
                if (o) {
                    if (typeof (this.options.yes) == "function") {
                        this.options.yes();
                    }
                    this.options.layer.close(this.options.id);
                    // delete this.$layer.instances[this.options.id];
                    // o.remove();
                }
            },
            sleep: function (ms) {
                return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                });
            },

            async getContent() {
                await helper.sleep(10);
                // let propsData = helper.deepClone(this.options.content.data) || {};
                let propsData = {};
                propsData["layerid"] = this.options.id;
                //  propsData["item"] = this.options.content.data;
                this.options.content.data.layerIdACUJSK = this.options.id
                this.instance = new this.options.content.content({
                    //具体参数信息，请参考vue源码
                    parent: this.options.content.parent,
                    propsData: propsData,
                    data: {layerData: this.options.content.data}
                });
                this.instance.vm = this.instance.$mount();
                document.getElementById(this.id).appendChild(this.instance.vm.$el);
                this.options.layer.instancesVue[this.options.id].iframe = this.instance.vm;
            },

            async getOffset(point) {
                await this.sleep(1);
                let oTips = document.querySelector("#" + this.options.id);

                /*
                      let o = document.querySelector(this.options.title); //用title传递that元素
                      const bound = o.getBoundingClientRect();
                      let oTips = document.querySelector("#" + this.options.id);
                      let boundTips = oTips.getBoundingClientRect();

                      let scrollTop = 0; //this.getScrollTop();
                      let left = o.offsetLeft;
                      let top = o.offsetTop - scrollTop;
                */

                let left = point[0]
                let top = point[1]

                /*      let jiantou = 8 + 1;
                      while (o.offsetParent) {
                        o = o.offsetParent;
                        left += o.offsetLeft;
                        top += o.offsetTop;
                      }


                      let offset = {};
                      console.log("boundTips.height")
                      console.log(boundTips.height)
                      switch (this.options.tips[0]) {
                        case 0:
                          offset = {
                            left: left + "px",
                            top: top - boundTips.height - jiantou + "px"
                          }
                          break;
                        case 1:
                          offset = {
                            left: (left + bound.width + jiantou) + "px",
                            top: top + "px"
                          }
                          break;
                        case 2:
                          offset = {
                            left: left + "px",
                            top: (top + bound.height + jiantou) + "px"
                          }
                          break;
                        case 3:
                          offset = {
                            left: (left - boundTips.width - jiantou) + "px",
                            top: top + "px"
                          }
                          break;
                      }
                      console.log("left"+left)
                      console.log("top"+top)
                      console.log(offset)*/
                if(!this.options.left){
                    this.options.left = 0;
                }
                if(!this.options.top){
                    this.options.top = 0;
                }

                oTips.style.left = left + this.options.left + "px";
                oTips.style.top = top + this.options.top + "px";
                // return offset;
            },
            getScrollTop() {
                var scrollTop = 0;
                if (document.documentElement && document.documentElement.scrollTop) {
                    scrollTop = document.documentElement.scrollTop;
                } else if (document.body) {
                    scrollTop = document.body.scrollTop;
                }
                return scrollTop;
            },
        },
    }
</script>

