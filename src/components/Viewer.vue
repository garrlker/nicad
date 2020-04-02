<template>
  <div class="viewer" @wheel.prevent>
    <!-- <picking :reglCtx="regl" /> -->
    <slot></slot>
  </div>
</template>

<script>
import initRegl from "regl";
import trackballCamera from "../js/camera";
import Picking from "./Picking";
import { createGeometry, createEdge, createPreview } from "../js/drawing";
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
      this.$drawPreview = [];

      geometries.forEach(geometry => {
        if (geometry) {
          this.$drawPreview.push(createPreview(this.regl, geometry));
          this.$drawEdges = [createEdge(this.regl, geometry)];
        }
      });
    },
    scene: {
      handler(nodes) {
        console.log("SCENE CHANGED - Viewer");
        this.$drawGeometry = [];
        this.$drawEdges = [];

        nodes.forEach(node => {
          if (node.geometry) {
            this.$drawGeometry.push(createGeometry(this.regl, node.geometry));
            this.$drawEdges.push(createEdge(this.regl, node.geometry));
          }
        });
      },
      deep: true
    }
  },
  methods: {
    createRegl() {
      if (!this.regl) {
        this.regl = initRegl(this.$el);

        this.camera = trackballCamera(this.regl, {});

        this.regl.frame(() => {
          this.regl.clear({
            color: this.backgroundColor
          });
          this.camera(() => {
            if (this.$drawGeometry.length > 0)
              this.$drawGeometry.forEach(dc => dc());
            if (this.$drawPreview.length > 0)
              this.$drawPreview.forEach(dc => dc());
            if (this.$drawEdges.length > 0) this.$drawEdges.forEach(dc => dc());
          });
        });
      }
      console.log("REGL", this.regl);
    }
  },
  mounted() {
    this.$drawGeometry = [];
    this.$drawPreview = [];
    this.$drawEdges = [];

    this.createRegl();
  },
  beforeDestroy() {
    this.regl.destroy();
  }
};
</script>

<style>
.viewer {
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
