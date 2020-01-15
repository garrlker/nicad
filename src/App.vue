<template>
  <div id="app">
    <viewer ref="viewer">
      <feature :node="tree" />
    </viewer>
    <layout>
      <template v-slot:left-sidebar>
        <q-btn color="primary" class="full-width" @click="create('cube')">Cube</q-btn>
        <q-btn color="primary" class="full-width" @click="create('sphere')">Sphere</q-btn>
        <q-btn color="primary" class="full-width" @click="create('cylinder')">Cylinder</q-btn>
        <q-btn color="primary" class="full-width" @click="create('union')">Union</q-btn>
        <q-btn color="primary" class="full-width" @click="create('subtract')">Subtraction</q-btn>
        <q-btn color="primary" class="full-width" @click="create('intersect')">Intersection</q-btn>
        <q-btn color="primary" class="full-width" @click="deleteNode">Delete</q-btn>
        <q-badge color="red">X: {{translateX}}</q-badge>
        <q-slider v-model="translateX" :min="-10" :max="10" color="red" @change="setTranslate" />
        <q-badge color="green">Y: {{translateY}}</q-badge>
        <q-slider v-model="translateY" :min="-10" :max="10" color="green" @change="setTranslate" />
        <q-badge color="blue">Z: {{translateZ}}</q-badge>
        <q-slider v-model="translateZ" :min="-10" :max="10" color="blue" @change="setTranslate" />
      </template>
      <template v-slot:right-sidebar>
        <q-tree
          ref="tree"
          :nodes="tree.children"
          label-key="name"
          node-key="key"
          :tick-strategy="tickStrategy"
          :ticked.sync="ticked"
          :expanded.sync="expanded"
          default-expand-all
          @update:ticked="handleSelected"
          no-connectors
        />
      </template>
      <template v-slot:shelf>
        <view-cube/>
      </template>
      <template v-slot:bottom-toolbar></template>
    </layout>
  </div>
</template>

<script>
import Viewer from "./components/Viewer.vue";
import Feature from "./components/Feature.vue";
import Tree from "./components/Tree.vue";
import Layout from "./components/Layout.vue";
import ViewCube from "./components/ViewCube.vue";
import * as VueCSG from "vue-csg";
const debug = require("debug")("App");
import { CAG, CSG } from "@jscad/csg";
import { init } from "jscad-utils";
var newCSG = init["default"](CSG);
console.log("bla", CSG);
// console.log("BLA", bla);
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
    Feature,
    Tree,
    ...VueCSG,
    Viewer,
    Layout,
    ViewCube
  },
  data() {
    return {
      arr: new Array(2),
      foo: [],
      test: 3,
      newId: 7,
      reglContext: undefined,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      tickStrategy: "strict",
      ticked: [],
      expanded: [],
      tree: {
        name: "union",
        id: 0,
        props: {},
        children: [
          {
            name: "subtract",
            key: "1",
            props: {},
            children: [
              {
                name: "cube",
                key: "2",
                props: {
                  size: 3,
                  center: true
                }
              },
              {
                name: "sphere",
                key: "3",
                props: {
                  r: 2,
                  center: true
                }
              }
            ]
          },
          {
            name: "intersect",
            key: "6",
            props: {},
            children: [
              {
                name: "sphere",
                key: "4",
                props: {
                  r: 1.3,
                  center: true
                }
              },
              {
                name: "cube",
                key: "5",
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
    create(name) {
      if (!this.selectedNode.children) {
        this.selectedNode.children = [];
      }

      this.selectedNode.children.push({
        name: name,
        key: String(this.newId),
        props: {},
        children: []
      });

      this.newId += 1;
    },
    deleteNode() {
      // TODO: deleteNode sets a delete flag prop on the selected node
      // When the feature realizes it has that prop, it emits an event to it's parent feature
      // Telling it to delete it
      // I don't like this pattern, its outside the scope of what a feature should do imo
      // But I'm not sure how else I can do it without direct access to the parent object
      // this.selectedNode = undefined;
      // this.$delete(this.selectedNode, "name");
      // this.$delete(this.selectedNode, "props");
      // this.$delete(this.selectedNode, "id");
      // this.$delete(this.selectedNode, "children");
    },
    handleSelected(nodeKey) {
      this.selectedNode = this.$refs.tree.getNodeByKey(nodeKey[0]);
      console.log(this.selectedNode);
    },
    setTranslate() {
      if (!this.selectedNode.props.translate) {
        this.$set(this.selectedNode.props, "translate", []);
        // this.$set(this.selectedNode.props.translate, 0, 0);
        // this.$set(this.selectedNode.props.translate, 1, 0);
        // this.$set(this.selectedNode.props.translate, 2, 0);
        this.selectedNode.props.translate.push(0);
        this.selectedNode.props.translate.push(0);
        this.selectedNode.props.translate.push(0);
      }
      // this.$set(this.selectedNode.props.translate, 0, value);
      this.$set(this.selectedNode.props.translate, [
        this.translateX,
        this.translateY,
        this.translateX
      ]);
    }
  },
  mounted() {
    debug("CSG", CSG);
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
</style>
