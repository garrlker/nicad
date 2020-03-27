<template>
  <div id="app">
    <div class="interface">
      <div v-show="currentCommand !== ''" class="left-sidebar">
        <component
          :is="currentCommand"
          :mode="ticked.length ? 'update' : 'new'"
          @feature:create="createFeature"
          @feature:update="updateFeature"
          @feature:preview="previewFeature"
          @op:execute="execute"
          :selected="stagedBodies[0]"
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
      <div class="bottom-toolbar">
        <Menu @setCommand="setCommand" :selected="ticked" />
      </div>
      <div class="view-cube">
        <p>View Cube</p>
      </div>
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
      currentCommand: "",
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
      this.setCommand("");
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
      this.setCommand("");
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
      this.setCommand("");
      this.selected = null;
      this.tempFeature = undefined;
    },
    handleSelected(selected) {
      // this.tempFeature = this.scene[selected];
    },
    handleTicked(ticked) {
      this.stagedBodies.length = 0;
      ticked.forEach(tick => {
        this.stagedBodies.push(this.scene[tick]);
      });
      this.tempFeature = this.stagedBodies[0];
    },
    setCommand(command) {
      this.currentCommand = command;
      this.$set(this.preview, 0, undefined);
      this.preview.length = 0;
    }
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
.interface {
  pointer-events: none;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;

  display: grid;

  @media only screen and (min-width: 1024px) {
    grid-template-columns: 4fr 6fr 12fr 4fr;
    grid-template-rows: 2fr 8fr 3fr 1.5fr;

    .left-sidebar {
      pointer-events: auto;
      grid-row: 2 / span 1;
      grid-column: 1 / span 1;
      border-radius: 1px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
      background-blend-mode: exclusion;
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px) saturate(125%);
      transition: ease 0.2s;
    }

    .right-sidebar {
      pointer-events: auto;
      grid-row: 1 / span 3;
      grid-column: 4 / span 1;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
      background-blend-mode: exclusion;
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px) saturate(125%);
      transition: ease 0.2s;
      margin-left: 4em;
    }

    .bottom-toolbar {
      z-index: 2;
      pointer-events: auto;
      grid-row: 4 / span 1;
      grid-column: 2 / span 2;
      border-top-left-radius: 1em;
      border-top-right-radius: 1em;
      border: 1px black;
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px) saturate(125%);
    }

    .view-cube {
      grid-row: 3 / span 2;
      grid-column: 1 / span 1;

      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
      background-color: rgba(255, 165, 0, 0.5);
    }
  }

  @media only screen and (max-width: 1024px) {
    grid-template-columns: 1fr 6fr 1fr;
    grid-template-rows: 5fr 4fr 1fr;
    .left-sidebar {
      // display: none;
      grid-row: 2 / span 2;
      grid-column: 2 / span 1;
      z-index: 3;
      pointer-events: auto;
      border-radius: 1px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
      background-blend-mode: exclusion;
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px) saturate(125%);
      transition: ease 0.2s;
    }
    .right-sidebar {
      display: none;
    }
    .bottom-toolbar {
      grid-row: 3 / span 1;
      grid-column: 2 / span 1;
      z-index: 2;
      pointer-events: auto;
      border-top-left-radius: 1em;
      border-top-right-radius: 1em;
      border: 1px black;
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px) saturate(125%);
      overflow: scroll;
    }
    .view-cube {
      display: none;
    }
    .view {
      grid-row: 1 / span 3;
      grid-column: 1 / span 3;
    }
  }
}
</style>
