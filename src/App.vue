<template>
  <div id="app">
    <div class="interface">
      <div v-show="currentCommand !== ''" class="left-sidebar">
        <component
          :is="currentCommand"
          @feature:create="storeFeatureNode"
          @feature:update="updateFeatureNode"
          @feature:preview="previewFeature"
          @op:execute="execute"
          :selected="selectedFeatures"
          @setCommand="setCommand"
        />
      </div>
      <div class="right-sidebar">
        <q-tree
          ref="tree"
          :nodes="scene.children"
          label-key="name"
          node-key="key"
          :tick-strategy="'strict'"
          :ticked.sync="ticked"
          :expanded.sync="expanded"
          default-expand-all
          @update:ticked="handleTicked"
          no-connectors
        />
      </div>
      <div class="bottom-toolbar">
        <Menu @setCommand="setCommand" :selected="selectedFeatures" />
      </div>
      <div class="view-cube">
        <p>View Cube</p>
      </div>
    </div>
    <viewer ref="viewer" :scene="scene.children" :preview="preview"> </viewer>
  </div>
</template>

<script>
import Viewer from "./components/Viewer.vue";
import * as CommandUI from "./components/commands";
import * as Menu from "./components/menu";
import Node from "./js/feature";
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
      expanded: [],
      preview: [],
      scene: new Node("Root"),
      selectedFeatures: [],
      ticked: [],
      tempFeature: undefined
    };
  },
  methods: {
    execute(csg) {
      var primaryFeature = this.selectedFeatures[0];
      this.$set(primaryFeature, "geometry", csg);

      this.selectedFeatures.slice(1).forEach(feature => {
        primaryFeature.addChild(feature);
        var index = this.scene.children.indexOf(feature);
        if (index > -1) {
          this.scene.children.splice(index, 1);
          console.log("Removed", feature);
        }
      });

      this.selectedFeatures.length = 0;
      this.setCommand("");
    },
    storeFeatureNode(feature) {
      this.scene.addChild(feature);
      this.setCommand("");
      this.$set(this.preview, "length", 0);
    },
    updateFeatureNode(csg) {
      var primaryFeature = this.selectedFeatures[0];
      this.$set(primaryFeature, "geometry", csg);
      this.setCommand("");
    },
    previewFeature(feature) {
      this.preview = [feature];
    },
    handleTicked() {
      this.$nextTick(function() {
        this.selectedFeatures = this.$refs.tree.getTickedNodes();
      });
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
body {
  overscroll-behavior: none;
}
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
