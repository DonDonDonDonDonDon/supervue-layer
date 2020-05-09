
<template>
<div style="width: 200px;height: 180px;background: blue;z-index: 999">
  <p @click="close" style="text-align: center;color: black;margin: 0px;padding: 0px">
   12121212
  </p>
</div>
</template>

<script>
export default {
  data() {
    return {
      /*  name:"xiaohengdd"*/
    }
  },

  computed: {
    offset() {
      return this.getOffset();
    }
  },
  async mounted() {


  },
  methods: {
    close(){
      console.log("关闭了"+this.layerData.layerIdACUJSK)
      this.$layer.close(this);
    }
  },
}
</script>
