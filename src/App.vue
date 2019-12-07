<template>
  <div id="app">
    <viewer ref="viewer" />
    <Part @geometry="setGeometry">
      <subtract>
      <sphere/>
      <cube :center="[1,1,1]"/>
      </subtract>
    </Part>

  </div>
</template>

<script>
import Viewer from "./components/Viewer.vue";
import * as VueCSG from "vue-csg";
console.log("DEBUG", VueCSG);
const debug = require("debug")("App");
import { CAG, CSG } from "@jscad/csg";

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
// worker.onmessage = event => console.log(event);

debug("INIT CSG", CSG);
debug("INIT CAG", CAG);

export default {
  name: "app",
  components: {
    Viewer,
    ...VueCSG
  },
  data() {
    return {
      arr: new Array(2)
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
    // let cube1 = CSG.cube({});
    // debug(cube1);
    // let cube2 = CSG.cube({center: [0.5,0.5,0]});
    // let finalShape = cube1['intersect'](cube2);

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
