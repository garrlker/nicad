<template>
  <div>
    <q-badge color="red">X: {{ direction[0] }}</q-badge>
    <q-slider
      v-model="direction[0]"
      :min="0"
      :max="360"
      color="red"
      :disable="selected.length === 0"
    />
    <q-badge color="green">Y: {{ direction[1] }}</q-badge>
    <q-slider
      v-model="direction[1]"
      :min="0"
      :max="360"
      color="green"
      :disable="selected.length === 0"
    />
    <q-badge color="blue">Z: {{ direction[2] }}</q-badge>
    <q-slider
      v-model="direction[2]"
      :min="0"
      :max="360"
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
      @click="$emit('feature:update', rotatedMesh)"
    />
  </div>
</template>

<script>
import rotateMesh from "./Rotate.js";

export default {
  name: "Rotate",
  props: {
    selected: {
      type: Array
    }
  },
  data() {
    return {
      direction: [0, 0, 0],
      rotatedMesh: undefined
    };
  },
  watch: {
    direction() {
      this.generate();
    }
  },
  methods: {
    generate() {
      if (this.selected.length > 0) {
        this.rotatedMesh = rotateMesh(
          this.direction,
          this.selected[0].geometry
        );
        this.$emit("feature:preview", this.rotatedMesh);
      }
    }
  },
  mounted() {
    console.log("Rotate Mounted");
    this.generate();
  }
};
</script>
