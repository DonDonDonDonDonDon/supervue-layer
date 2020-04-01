
<template>


  <div
    class="vl-notify-point"
    :class="[this.options.tips[1],'vl-notify-tips-'+ this.options.tips[0]]"
    :id="options.id"
  >
    <div class="vl-notify-content"  :id="id"></div>


    <em></em>
  </div>
</template>

<script>
import helper from "./helper/helper";

export default {
  data() {
    return {
      timeout: '',
      id: "vlip" + new Date().getTime(),
      instance:null,
    }
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
    }, self.options.time * 1000);

    await this.getOffset( this.options.point);
    this.getContent()
  },
  methods: {
    reDraw(options){
        console.log(options.point)
      this.getOffset(options.point)
    },
    setData(data){
      this.instance.$options.data = data
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
      let propsData = helper.deepClone(this.options.content.data) || {};
      propsData["layerid"] = this.options.id;
      propsData["lydata"] = this.options.content.data;
      this.options.content.data.layerIdACUJSK = this.options.id
      this.instance = new this.options.content.content({
        //具体参数信息，请参考vue源码
        parent: this.options.content.parent,
        propsData: propsData,
        data:this.options.content.data
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

      let  left =point[0]
      let  top = point[1]

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
      oTips.style.left = left+30+ "px";
      oTips.style.top = top+30+ "px";
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

