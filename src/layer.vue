
<template lang="html">
    <component style="z-index:999999" :class="componetClass" :ref="this.$data.id" :options="this.$data" :is="getActiveName"></component>
</template>

<script>
import pzalert from "./alert.vue";
import pzloading from "./loading.vue";
import pzmsg from "./msg.vue";
import pztips from "./tips.vue";
import pzpage from "./page.vue";
import pziframe from "./iframe.vue";
import pzprompt from "./prompt.vue";
import point from "./point.vue";

let vm  = null;
export default {
  data() {
      vm = this;
    return {
      id: "",
      type: 0, //0（alert默认）1（页面层）2（iframe层）3（loading）4（tips层）,5(msg),6(prompt)
      title: "信息",
      content: "",
      area: "auto",
      offset: "auto",
      icon: -1,
      btn: "确定",
      time: 0,
      shade: true,
      yes: "",
      cancel: "",
      componetClass:[],
    };
  },
  computed: {
    getActiveName() {
      let comps = [
        "pzalert",
        "pzpage",
        "pziframe",
        "pzloading",
        "pztips",
        "pzmsg",
        "pzprompt",
        "point",
      ];
      return comps[this.$data.type];
    },
    isMsg: function() {
      return this.type == 5 ? true : false;
    },
    isTips: function() {
      return this.type == 4 ? true : false;
    }
  },
  mounted() {
      if(this.$data.type==7){
        this.componetClass = ["layer-animal"]
      }
  },
  methods: {
      reDrawPoint(options){
          console.log(" vm.$refs")
          console.log( vm.$refs)
          console.log( options)
          this.$refs[this.$data.id].reDraw(options)

      },
      setPointData(data){

          this.$refs[this.$data.id].setData(data)

      },
  },
  watch: {},
  components: {
    pzalert,
    pzloading,
    pzmsg,
    pztips,
    pzpage,
    pziframe,
    pzprompt,
      point,
  }
};
</script>
