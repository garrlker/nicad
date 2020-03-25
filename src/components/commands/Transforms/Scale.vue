<template>
  <div>
    <q-badge color="red">X: {{ dimensions[0] }}</q-badge>
    <q-slider
      v-model="dimensions[0]"
      :min="0"
      :max="range"
      color="red"
      @input="preview(dimensions)"
      :disable="feature === undefined"
    />
    <q-badge color="green">Y: {{ dimensions[1] }}</q-badge>
    <q-slider
      v-model="dimensions[1]"
      :min="0"
      :max="range"
      color="green"
      @input="preview(dimensions)"
      :disable="feature === undefined"
    />
    <q-badge color="blue">Z: {{ dimensions[2] }}</q-badge>
    <q-slider
      v-model="dimensions[2]"
      :min="0"
      :max="range"
      color="blue"
      @input="preview(dimensions)"
      :disable="feature === undefined"
    />
    <q-btn
      align="right"
      color="primary"
      label="Update"
      @click="update(dimensions)"
    />
  </div>
</template>

<script>
import { CSG } from "@jscad/csg";

export default {
  name: "Translate",
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
      dimensions: [1, 1, 1],
      range: 20
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
    preview(delta) {
      if (this.feature) {
        let geometry = this.feature.scale(delta);

        this.$emit("feature:preview", geometry);
      }
    },
    update(delta) {
      if (this.feature) {
        let geometry = this.feature.scale(delta);

        this.$emit("feature:update", geometry);
        this.$emit("feature:preview", undefined);
      }
    }
  },
  mounted() {
    console.log("Scale Mounted", this.feature);
    this.preview(this.dimensions);
  }
};
</script>
