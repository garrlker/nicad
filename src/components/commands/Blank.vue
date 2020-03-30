<template>
  <div>
    <!-- From Cube.vue, will be used for translate -->
    <q-badge color="red">X: {{ position[0] }}</q-badge>
    <q-slider
      v-model="position[0]"
      :min="-10"
      :max="10"
      color="red"
      @input="translate(position)"
    />
    <q-badge color="green">Y: {{ position[1] }}</q-badge>
    <q-slider
      v-model="position[1]"
      :min="-10"
      :max="10"
      color="green"
      @input="translate(position)"
    />
    <q-badge color="blue">Z: {{ position[2] }}</q-badge>
    <q-slider
      v-model="position[2]"
      :min="-10"
      :max="10"
      color="blue"
      @input="translate(position)"
    />
  </div>
</template>

<script>
import { CSG } from "@jscad/csg";

export default {
  name: "Blank",
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
    return {};
  },
  methods: {
    create(size, position) {
      let geometry;
      let feature = {
        name: "Blank",
        children: [],
        geometry,
        type: "Blank"
      };

      this.$emit("feature", feature);
      console.log("create - Output", feature);
    },
    translate(position) {
      if (this.mode === "new") return;
      console.log(this.feature);
      if (this.feature) {
        console.log(this.feature.translate(position));
        this.$emit("feature:update", this.feature.translate(position));
      }
    },
    update(size, position) {
      let geometry;

      this.$emit("feature:update", geometry);
    }
  },
  mounted() {
    console.log("Blank Mounted");
  }
};
</script>
