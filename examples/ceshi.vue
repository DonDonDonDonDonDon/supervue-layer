
<template>
<div style="width: 200px;height: 200px;background: white">
  <p @click="close" style="text-align: center;color: black;line-height: 200px">
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
      console.log("关闭了"+this.layerIdACUJSK)
      this.$layer.close(this);
    }
  },
}
</script>
