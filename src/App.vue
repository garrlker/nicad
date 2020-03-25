<template>
  <div id="app">
    <div class="interface">
      <div class="left-sidebar">
        <component
          :is="currentCommand"
          :mode="selected != null ? 'update' : 'new'"
          @feature:create="createFeature"
          @feature:update="updateFeature"
          @feature:preview="previewFeature"
          @op:execute="execute"
          :selected="selected"
          :staged="stagedBodies"
          :feature="tempFeature ? tempFeature.geometry : undefined"
          :featureType="tempFeature ? tempFeature.type : undefined"
          @setCommand="setCommand"
        />
      </div>
      <div class="right-sidebar">
        <q-tree
          ref="tree"
          :nodes="scene"
          label-key="name"
          node-key="key"
          :tick-strategy="'strict'"
          :ticked.sync="ticked"
          :selected.sync="selected"
          :expanded.sync="expanded"
          default-expand-all
          @update:selected="handleSelected"
          @update:ticked="handleTicked"
          no-connectors
        />
      </div>
      <div class="bottom-toolbar"></div>
    </div>
    <viewer ref="viewer" :scene="scene" :preview="preview"> </viewer>
  </div>
</template>

<script>
import Viewer from "./components/Viewer.vue";
import * as CommandUI from "./components/commands";
import * as Menu from "./components/menu";

const debug = require("debug")("App");

export default {
  name: "app",
  components: {
    Viewer,
    ...CommandUI,
    ...Menu
  },
  data() {
    return {
      currentCommand: "Menu",
      selected: null,
      ticked: [],
      expanded: [],
      preview: [],
      scene: [],
      stagedBodies: [],
      tempFeature: undefined
    };
  },
  methods: {
    execute(feature) {
      // This is not final, but for now when executed
      // Take the resulting geometry, put it to the first ticked slot
      // Remove the rest, reset ticked
      this.$set(this.scene[this.ticked[0]], "geometry", feature);
      this.ticked.slice(1).forEach(el => this.deleteItem(this.ticked[el], el));
      this.$set(this.ticked, 0, undefined);
      this.ticked.length = 0;
      this.setCommand("Menu");
    },
    deleteItem: function(feature, index) {
      if (this.scene[index] === feature) {
        // The template passes index as the second parameter to avoid indexOf,
        // it will be better for the performance especially for one large array
        // (because indexOf actually loop the array to do the match)
        this.scene.splice(index, 1);
      } else {
        let found = this.scene.indexOf(feature);
        this.scene.splice(found, 1);
      }
    },
    createFeature(feature) {
      feature.key = this.scene.length;
      this.scene.push(feature);
      this.setCommand("Menu");
      this.selected = null;
      this.tempFeature = undefined;
      this.$set(this.preview, 0, undefined);
      this.preview.length = 0;
    },
    previewFeature(feature) {
      this.preview = [feature];
    },
    updateFeature(feature) {
      this.$set(this.scene[this.selected], "geometry", feature);
      this.$set(this.scene, this.selected, this.scene[this.selected]);
      this.setCommand("Menu");
      this.selected = null;
      this.tempFeature = undefined;
    },
    handleSelected(selected) {
      this.tempFeature = this.scene[selected];
    },
    handleTicked(ticked) {
      this.stagedBodies.length = 0;
      ticked.forEach(tick => {
        this.stagedBodies.push(this.scene[tick]);
      });
    },
    setCommand(command) {
      this.currentCommand = command;
      this.$set(this.preview, 0, undefined);
      this.preview.length = 0;
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
