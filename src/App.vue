<template>
  <div id="app">
    <input type="number" v-model.number="test" />
    <viewer ref="viewer" />
    <feature :node="tree" @csg="setGeometry" />
  </div>
</template>

<script>
import Viewer from "./components/Viewer.vue";
import Feature from "./components/Feature.vue";
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
    ...VueCSG
  },
  data() {
    return {
      arr: new Array(2),
      foo: [],
      test: 3,
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
                id: 3,
                props: {
                  r: 1.3,
                  center: true
                }
              },
              {
                name: "cube",
                id: 2,
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
    }
  },
  mounted() {
    debug("CSG", CSG);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
