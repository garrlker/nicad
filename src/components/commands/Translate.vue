<template>
  <div>
    <q-badge color="red">X: {{ position[0] }}</q-badge>
    <q-slider
      v-model="position[0]"
      :min="-range"
      :max="range"
      color="red"
      @input="preview(position)"
      :disable="feature === undefined"
    />
    <q-badge color="green">Y: {{ position[1] }}</q-badge>
    <q-slider
      v-model="position[1]"
      :min="-range"
      :max="range"
      color="green"
      @input="preview(position)"
      :disable="feature === undefined"
    />
    <q-badge color="blue">Z: {{ position[2] }}</q-badge>
    <q-slider
      v-model="position[2]"
      :min="-range"
      :max="range"
      color="blue"
      @input="preview(position)"
      :disable="feature === undefined"
    />
    <q-btn
      align="right"
      color="primary"
      label="Update"
      @click="update(position)"
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
      position: [0, 0, 0],
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
    preview(delta) {
      if (this.feature) {
        let geometry = this.feature.translate(delta);

        this.$emit("feature:preview", geometry);
      }
    },
    update(delta) {
      if (this.feature) {
        let geometry = this.feature.translate(delta);

        this.$emit("feature:update", geometry);
        this.$emit("feature:preview", undefined);
      }
    }
  },
  mounted() {
    console.log("Translate Mounted", this.feature);
    this.preview(this.position);
  }
};
</script>
