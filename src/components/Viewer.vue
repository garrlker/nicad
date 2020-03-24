<template>
  <div class="viewer" @wheel.prevent>
    <!-- <picking :reglCtx="regl" /> -->
    <slot></slot>
  </div>
</template>

<script>
import wrapRegl from "regl";
import reglCamera from "../js/camera";
import { csgToGeometry } from "../js/util";
import { primitives3d } from "@jscad/scad-api";
import Picking from "./Picking";
import { phongShadingVert, phongShadingFrag } from "../js/shaders/phongShading";
import { flatShadingVert, flatShadingFrag } from "../js/shaders/flatShading";

export default {
  name: "Viewer",
  props: {
    backgroundColor: {
      type: Array,
      default: () => [0.66, 0.66, 0.66, 1]
    },
    scene: {
      type: Array,
      default: () => []
    },
    preview: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Picking
  },
  watch: {
    preview(geometries) {
      console.log("Preview UPDATED", geometries);
      this.previewDC = [];

      geometries.forEach(geometry => {
        if (geometry) {
          this.previewDC.push(this.parsePreview(geometry));
        }
      });
    },
    scene(nodes) {
      console.log("SCENE UPDATED", nodes);
      this.drawCSG = [];

      nodes.forEach(node => {
        if (node.geometry) {
          this.drawCSG.push(this.parseCSG(node.geometry));
        }
      });
    }
  },
  methods: {
    parseCSG(csg, vert = phongShadingVert, frag = phongShadingFrag) {
      var { vertices, indices, normals, colors } = csgToGeometry(csg);

      return this.regl({
        primitive: "triangles",
        count: vertices.length,
        vert: vert,
        frag: frag,
        attributes: {
          position: vertices,
          normal: normals,
          color: colors
        },
        cull: {
          enable: true,
          face: "back"
        }
      });
    },
    parsePreview(csg, vert = flatShadingVert, frag = flatShadingFrag) {
      var { vertices, indices, normals, colors } = csgToGeometry(csg);

      return this.regl({
        primitive: "triangles",
        count: vertices.length,
        vert: vert,
        frag: frag,
        attributes: {
          position: vertices,
          normal: normals
        },
        uniforms: {
          color: [0.99, 0.59, 0.0, 1.0]
        },
        cull: {
          enable: true,
          face: "back"
        },
        depth: {
          enable: false
        },
        blend: {
          enable: true,
          func: {
            srcRGB: "src alpha",
            srcAlpha: 0,
            dstRGB: "one minus src alpha",
            dstAlpha: 1
          },
          equation: {
            rgb: "add",
            alpha: "add"
          },
          color: [1, 1, 1, 1]
        },
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
            if (this.drawCSG.length > 0) this.drawCSG.forEach(dc => dc());
            if (this.previewDC.length > 0) this.previewDC.forEach(dc => dc());
          });
        });
      }
      console.log("REGL", this.regl);
    },
    receiveChildCSG(childID, childGeometry) {
      console.log("NiCad Viewer CSG", childGeometry);

      // Quick hack to have the camera at a good distance from the model depending on its bounding box
      // var distance = childGeometry.getBounds()[1]._y * 4;

      this.createRegl();
      this.parseCSG(childGeometry);
    }
  },
  mounted() {
    this.drawCSG = [];
    this.previewDC = [];
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
