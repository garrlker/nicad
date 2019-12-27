<template>
  <div>
    <div class="grid-container">
      <div class="left-sidebar">
        <button class="button is-fullwidth" @click="create('cube')">Cube</button>
        <button class="button is-fullwidth" @click="create('sphere')">Sphere</button>
        <button class="button is-fullwidth" @click="create('cylinder')">Cylinder</button>
        <button class="button is-fullwidth" @click="create('union')">Union</button>
        <button class="button is-fullwidth" @click="create('subtract')">Subtraction</button>
        <button class="button is-fullwidth" @click="create('intersect')">Intersection</button>
        <button class="button is-fullwidth" @click="deleteNode">Delete</button>
        <input type="number" v-model.number="test" />
        <b-field label="X">
          <b-slider @change="setX" :min="-10" :max="10" ></b-slider>
        </b-field>
        <b-field label="Y">
          <b-slider @change="setY" :min="-10" :max="10" ></b-slider>
        </b-field>
        <b-field label="Z">
          <b-slider @change="setZ" :min="-10" :max="10" ></b-slider>
        </b-field>
      </div>
      <div class="main-area">
        <viewer ref="viewer" />
        <feature :node="tree" @csg="setGeometry" />
      </div>
      <div class="right-sidebar">
        <tree :node="tree" @selected="handleSelected"></tree>
      </div>
    </div>
  </div>
</template>

<script>
import Viewer from "./components/Viewer.vue";
import Feature from "./components/Feature.vue";
import Tree from "./components/Tree.vue";
import * as VueCSG from "vue-csg";
const debug = require("debug")("App");
import { CAG, CSG } from "@jscad/csg";

// Pollute global space
import { booleanOps } from "@jscad/scad-api";
import { primitives3d } from "@jscad/scad-api";

Object.assign(window, booleanOps);
Object.assign(window, primitives3d);

// import Worker from "./lib/worker.worker.js";
// const worker = new Worker();
// worker.postMessage([5,3]);
// worker.onmessage = event => debug("Worker - OnMessage", event);
// worker.terminate()
// debug("After Worker")

debug("INIT CSG", CSG);
debug("INIT CAG", CAG);

export default {
  name: "app",
  components: {
    Viewer,
    Feature,
    Tree,
    ...VueCSG
  },
  data() {
    return {
      arr: new Array(2),
      foo: [],
      test: 3,
      newId: 6,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      tree: {
        name: "union",
        id: 0,
        props: {},
        children: [
          {
            name: "subtract",
            id: 1,
            props: {},
            children: [
              {
                name: "cube",
                id: 2,
                props: {
                  size: 3,
                  center: true
                }
              },
              {
                name: "sphere",
                id: 3,
                props: {
                  r: 2,
                  center: true
                }
              }
            ]
          },
          {
            name: "intersect",
            id: 2,
            props: {},
            children: [
              {
                name: "sphere",
                id: 4,
                props: {
                  r: 1.3,
                  center: true
                }
              },
              {
                name: "cube",
                id: 5,
                props: {
                  size: 2.1,
                  center: true
                }
              }
            ]
          }
        ]
      }
    };
  },
  methods: {
    setGeometry(geometry) {
      debug("Set Geometry", geometry);
      this.$refs.viewer.setGeometry(geometry);
    },
    create(name) {
      if (!this.selectedNode.children) {
        this.selectedNode.children = [];
      }

      this.selectedNode.children.push({
        name: name,
        id: this.newId,
        props: {},
        children: []
      });

      this.newId += 1;
    },
    deleteNode(){
      // this.selectedNode = undefined;
      this.$delete(this.selectedNode, "name");
      this.$delete(this.selectedNode, "props");
      this.$delete(this.selectedNode, "id");
      this.$delete(this.selectedNode, "children");
    },
    handleSelected(node) {
      this.selectedNode = node;
      // console.log(tree);
    },
    setX(value){
      if(!this.selectedNode.props.translate){
        this.$set(this.selectedNode.props, "translate", []);
        this.$set(this.selectedNode.props.translate, 0, 0);
        this.$set(this.selectedNode.props.translate, 1, 0);
        this.$set(this.selectedNode.props.translate, 2, 0);
      }
        this.$set(this.selectedNode.props.translate, 0, value);
    },
    setY(value){
      if(!this.selectedNode.props.translate){
        this.$set(this.selectedNode.props, "translate", []);
        this.$set(this.selectedNode.props.translate, 0, 0);
        this.$set(this.selectedNode.props.translate, 1, 0);
        this.$set(this.selectedNode.props.translate, 2, 0);
      }
        this.$set(this.selectedNode.props.translate, 1, value);
    },
    setZ(value){
      if(!this.selectedNode.props.translate){
        this.$set(this.selectedNode.props, "translate", []);
        this.$set(this.selectedNode.props.translate, 0, 0);
        this.$set(this.selectedNode.props.translate, 1, 0);
        this.$set(this.selectedNode.props.translate, 2, 0);
      }
        this.$set(this.selectedNode.props.translate, 3, value);
    },
  },
  mounted() {
    debug("CSG", CSG);
  }
};
</script>

<style lang="scss">
body {
  height: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}
.grid-container {
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  grid-template-rows: 1fr;
  height: 100vh;
}

.left-sidebar {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  background-color: #333;
}

.right-sidebar {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
  background-color: #333;
}

.main-area {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}
</style>
