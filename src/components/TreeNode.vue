<template>
  <li @click.stop="handleSelection" :class="{ 'selected': selected, 'no-textselect': true }">
    <span
      v-if="node.children && node.children.length"
      @click.stop="expanded = !expanded"
      class="icon is-small"
    >
      <i v-if="expanded" class="mdi mdi-menu-down"></i>
      <i v-else class="mdi mdi-menu-right"></i>
    </span>
    {{node.name}}
    <div>
      <ul v-if="node.children && expanded">
        <TreeNode
          v-for="nodeChild in node.children"
          :key="nodeChild.id"
          :node="nodeChild"
          v-on="$listeners"
        ></TreeNode>
      </ul>
    </div>
  </li>
</template>

<script>
export default {
  name: "TreeNode",
  props: {
    node: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selected: false,
      expanded: true
    };
  },
  methods: {
    handleSelection() {
      this.selected = !this.selected;
      this.$emit("selected", this.node);
    }
  }
};
</script>
<style>
ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
  position: relative;
}
li {
  list-style-type: none;
  border-left: 2px solid #000;
  margin-left: 1em;
  color: #eee;
}
li div {
  padding-left: 1em;
  position: relative;
}
li div::before {
  content: "";
  position: absolute;
  top: 0;
  left: -2px;
  bottom: 50%;
  width: 0.75em;
  border: 2px solid #000;
  border-top: 0 none transparent;
  border-right: 0 none transparent;
}
ul > li:last-child {
  border-left: 2px solid transparent;
}

.no-textselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
}

.selected {
  background-color: #006666;
}
</style>