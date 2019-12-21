<template>
  <div id="app">
    <input type="number" v-model="test">
    <viewer ref="viewer" />
    <scale @csg="setGeometry" :xform="10">
      <center :xform="[true, true, true]">
        <translate :xform="[0, 0, 1.5]">
          <union>
            <subtract>
              <cube :size="3" :center="true"/>
              <sphere :r="2" :center="true"/>
            </subtract>
            <intersect>
              <sphere :r="1.3" :center="true"/>
              <cube :size="2.1" :center="true"/>
            </intersect>
          </union>
        </translate>
      </center>
    </scale>
    <!-- <cube>
    </cube>
    <cube :pos="[0.5,0.5,0.5]"/> -->
  </div>
</template>

<script>
import Viewer from "./components/Viewer.vue";
import FakeValue from "./components/FakeValue.vue";
import * as VueCSG from "vue-csg";
console.log("DEBUG", VueCSG);
const debug = require("debug")("App");
import { CAG, CSG } from "@jscad/csg";

// Pollute global space
import { booleanOps } from "@jscad/scad-api";
import { primitives3d } from "@jscad/scad-api";

Object.assign(window, booleanOps);
Object.assign(window, primitives3d);

/*
  return union(
    difference(
      cube({size: 3, center: true}),
      sphere({r: 2, center: true})
    ),
    intersection(
      sphere({r: 1.3, center: true}),
      cube({size: 2.1, center: true})
    )
  ).translate([0, 0, 1.5]).scale(10);
*/

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
    FakeValue,
    ...VueCSG
  },
  data() {
    return {
      arr: new Array(2),
      foo: [],
      size: 10,
      test: 0
    };
  },
  methods: {
    setGeometry(geometry) {
      debug("Set Geometry", geometry);
      console.log("GEOMETRY", geometry);
      // while(this.$refs.viewer.$scene.children.length){
      //   this.$refs.viewer.$scene.children.remove(this.$refs.viewer.$scene.children[0]);
      // }
      // this.$refs.viewer.$scene = [];
      this.$refs.viewer.setGeometry(geometry);
    },
    updateSize(size) {
      this.size = size;
    }
  },
  mounted() {
    debug("CSG", CSG);

    // for (var i = 1; i <= 10; i++) {
    // this.foo.push(i);
    // }
    // let cube1 = CSG.cube({});
    // worker.postMessage(cube1);
    // debug(cube1);
    // let cube2 = CSG.cube({center: [0.5,0.5,0]});
    // let finalShape = cube1['intersect'](cube2);
    let finalShape = difference(
      cube({ size: 2.1, center: true }),
      cube({ size: 2.1, center: true }).translate([1, 1, 1])
    );

    // this.setGeometry(finalShape);
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
