<template>
  <div>
    <TreeNode
      :node="node"
      v-on="$listeners"
    ></TreeNode>
  </div>
</template>

<script>
import TreeNode from "./TreeNode";
export default {
  name: "Tree",
  components: {
    TreeNode
  },
  props: {
    node: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleSelection() {
      this.selected = !this.selected;
      this.$emit("selected", this.node);
    }
  }
};
</script>
<style scoped>
</style>