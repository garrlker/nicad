<template>
  <div>
    <q-badge color="red">X: {{ direction[0] }}</q-badge>
    <q-slider
      v-model="direction[0]"
      :min="0"
      :max="360"
      color="red"
      @input="preview(direction)"
      :disable="feature === undefined"
    />
    <q-badge color="green">Y: {{ direction[1] }}</q-badge>
    <q-slider
      v-model="direction[1]"
      :min="0"
      :max="360"
      color="green"
      @input="preview(direction)"
      :disable="feature === undefined"
    />
    <q-badge color="blue">Z: {{ direction[2] }}</q-badge>
    <q-slider
      v-model="direction[2]"
      :min="0"
      :max="360"
      color="blue"
      @input="preview(direction)"
      :disable="feature === undefined"
    />
    <q-btn
      align="right"
      color="warning"
      label="Cancel"
      @click="$emit('setCommand', '')"
    />
    <q-btn
      align="right"
      color="primary"
      label="Update"
      @click="update(direction)"
    />
  </div>
</template>

<script>
import { CSG } from "@jscad/csg";

export default {
  name: "Rotate",
  props: {
    mode: {
      type: String,
      default: "new"
    },
    feature: {
      type: Object
    }
  },
  data() {
    return {
      direction: [0, 0, 0],
      range: 100
    };
  },
  watch: {
    feature(newFeature, oldFeature) {
      if (this.newFeature.meta) {
        this.$previewGeometry = this.newFeature.meta.preview(
          ...this.newFeature.meta.params
        );
        console.log("Preview Geom Generated", this.$previewGeometry);
      }
    }
  },
  methods: {
    rotate(geometry, delta){
      geometry = geometry.rotateX(delta[0]);
      geometry = geometry.rotateY(delta[1]);
      geometry = geometry.rotateZ(delta[2]);
      return geometry;
    },
    preview(delta) {
      if (this.feature) {
        let geometry = this.feature;
        geometry = this.rotate(geometry, delta);

        this.$emit("feature:preview", geometry);
      }
    },
    update(delta) {
      if (this.feature) {
        let geometry = this.feature;
        geometry = this.rotate(geometry, delta);
        
        this.$emit("feature:update", geometry);
        this.$emit("feature:preview", undefined);
      }
    }
  },
  mounted() {
    console.log("Rotate Mounted", this.feature);
    this.preview(this.direction);
  }
};
</script>
