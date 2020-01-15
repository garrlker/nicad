<template>
  <div class="viewer" @wheel.prevent @click="rotate">
    <picking :reglCtx="regl" />
    <slot></slot>
  </div>
</template>

<script>
import wrapRegl from "regl";
import reglCamera from "../js/camera";
import { csgToGeometry } from "../js/util";
import { primitives3d } from "@jscad/scad-api";
import Picking from "./Picking";
import {
  phongShadingVert,
  phongShadingFrag
} from "../js/shaders/phongShading";

export default {
  name: "Viewer",
  provide() {
    return {
      outputCSGtoParent: this.receiveChildCSG
    };
  },
  props: {
    backgroundColor: {
      type: Array,
      default: () => [0.66, 0.66, 0.66, 1]
    },
    theta: {
      type: Number,
      default: 0
    },
    phi: {
      type: Number,
      default: 0
    }
  },
  components: {
    Picking
  },
  methods: {
    createCSGDrawCall(csg) {
      var { vertices, indices, normals, colors } = csgToGeometry(csg);
      this.drawCSG = this.regl({
        frag: phongShadingFrag,
        vert: phongShadingVert,
        attributes: {
          position: vertices,
          normal: normals,
          color: colors
        },
        elements: indices,
        cull: {
          enable: true,
          face: "back"
        }
      });
    },
    createRegl() {
      if (!this.regl) {
        this.regl = wrapRegl(this.$el);

      this.camera = reglCamera(this.regl, {});

      this.regl.frame(() => {
        this.regl.clear({
          color: this.backgroundColor
        });
        this.camera(() => {
          if (this.drawCSG) this.drawCSG();
        });
      });
      }
    },
    receiveChildCSG(childID, childGeometry) {
      console.log("NiCad Viewer CSG", childGeometry);

      // Quick hack to have the camera at a good distance from the model depending on its bounding box
      // var distance = childGeometry.getBounds()[1]._y * 4;

      this.createRegl();
      this.createCSGDrawCall(childGeometry);
    },
    rotate(){
      // console.log("rot");
      // this.camera.rot();
    }
  },
  mounted() {
    this.createRegl();
  },
  beforeDestroy() {
    this.regl.destroy();
  }
};
</script>

<style>
.viewer {
  min-height: 500px;
  min-width: 500px;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>