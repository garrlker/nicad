<template>
  <div id="app">
    <div class="interface">
      <div class="left-sidebar">
        <cube
          :mode="tempFeature ? 'update' : 'new'"
          @feature="createFeature"
          @feature:update="updateFeature"
          :feature="tempFeature ? tempFeature.geometry : undefined"
        />
      </div>
      <div class="right-sidebar">
        <q-tree
          ref="tree"
          :nodes="scene"
          label-key="name"
          node-key="key"
          :tick-strategy="'none'"
          :ticked.sync="ticked"
          :selected.sync="selected"
          :expanded.sync="expanded"
          default-expand-all
          @update:selected="handleSelected"
          no-connectors
        />
      </div>
      <div class="bottom-toolbar"></div>
    </div>
    <viewer ref="viewer" :scene="scene"> </viewer>
  </div>
</template>

<script>
import Viewer from "./components/Viewer.vue";
import Cube from "./components/commands/Cube";
const debug = require("debug")("App");

export default {
  name: "app",
  components: {
    Viewer,
    Cube
  },
  data() {
    return {
      selected: [],
      ticked: [],
      expanded: [],
      scene: [],
      tempFeature: undefined
    };
  },
  methods: {
    create(name) {
      // if (!this.selectedNode.children) {
      //   this.selectedNode.children = [];
      // }
      // this.selectedNode.children.push({
      //   name: name,
      //   key: String(this.newId),
      //   props: {},
      //   children: []
      // });
      // this.newId += 1;
    },
    createFeature(feature) {
      feature.key = this.scene.length;
      this.scene.push(feature);
    },
    handleSelected(selected) {
      console.log("handleSelected", selected);
      this.tempFeature = this.scene[selected];
    },
    updateFeature(feature) {
      console.log("UPDATE FEATURE", feature);
      // this.scene[this.selected].geometry = feature;
      this.$set(this.scene[this.selected], 'geometry', feature);
      this.$set(this.scene, this.selected, this.scene[this.selected]);
    }
  },
  mounted() {
    // debug("CSG", CSG);
  }
};
</script>

<style lang="scss">
#app {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

@media only screen and (min-width: 1024px) {
  .interface {
    pointer-events: none;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;

    display: grid;
    grid-template: auto 24px / 240px auto 240px;

    .left-sidebar {
      pointer-events: auto;
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      border-radius: 1px;
      // border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
      background-blend-mode: exclusion;
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px) saturate(125%);
      transition: ease 0.2s;
    }

    .right-sidebar {
      pointer-events: auto;
      grid-column: 3 / 4;
      grid-row: 1 / 2;
      // border-radius: 0em 0em 0em 0.5em;
      // border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
      background-blend-mode: exclusion;
      background-color: rgba(255, 255, 255, 0.6);
      // background: linear-gradient(
      //   rgba(255, 255, 255, 0.1),
      //   rgba(209, 209, 209, 1)
      // );
      backdrop-filter: blur(20px) saturate(125%);

      // Disabling the hover for now, it's annoying
      // This probably means it isn't a good idea
      // transform: translateX(75%);
      // -webkit-transform: translateX(75%);
      // transition: transform 0.2s ease;
      transition: ease 0.2s;
    }

    .bottom-toolbar {
      z-index: 2;
      pointer-events: auto;
      grid-column: 1 / 4;
      grid-row: 2 / 3;
      // border: 1px solid rgba(255, 255, 255, 0.2);
      // box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
      // background-blend-mode: exclusion;
      border: 1px black;
      // background-color: rgba(209, 209, 209, 1);
      background-color: #fe9801;
      backdrop-filter: blur(10px);
    }

    .right-sidebar:hover {
      // transform: translateX(0%);
      // -webkit-transform: translateX(0%);
    }
  }
}
</style>
