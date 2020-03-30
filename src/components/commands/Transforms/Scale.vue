<template>
  <div>
    <q-badge color="red">X: {{ factors[0] }}</q-badge>
    <q-slider
      v-model="factors[0]"
      :min="0"
      :max="range"
      color="red"
      :disable="selected.length === 0"
    />
    <q-badge color="green">Y: {{ factors[1] }}</q-badge>
    <q-slider
      v-model="factors[1]"
      :min="0"
      :max="range"
      color="green"
      :disable="selected.length === 0"
    />
    <q-badge color="blue">Z: {{ factors[2] }}</q-badge>
    <q-slider
      v-model="factors[2]"
      :min="0"
      :max="range"
      color="blue"
      :disable="selected.length === 0"
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
      @click="$emit('feature:update', scaledMesh)"
    />
  </div>
</template>

<script>
import scaleMesh from "./Scale.js";

export default {
  name: "Scale",
  props: {
    selected: {
      type: Array
    }
  },
  data() {
    return {
      factors: [1, 1, 1],
      range: 20,
      scaledMesh: undefined
    };
  },
  watch: {
    factors() {
      this.generate();
    }
  },
  methods: {
    generate() {
      this.scaledMesh = scaleMesh(this.factors, this.selected[0].geometry);
      this.$emit("feature:preview", this.scaledMesh);
    }
  },
  mounted() {
    console.log("Scale Mounted");
    this.generate();
  }
};
</script>
