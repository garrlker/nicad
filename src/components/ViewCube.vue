<template>
  <div class="view-cube">
    asdasdas
  </div>
</template>

<script>
import wrapRegl from "regl";
export default {
  name: "ViewCube",
    mounted() {
      this.regl = wrapRegl(this.$el);
      //TODO: Set regl up and add camera/view cube mesh here
  
  },
};
</script>

<style lang="scss">
</style>
