<template>
  <div>
    <q-badge color="red">X: {{ offset[0] }}</q-badge>
    <q-slider
      v-model="offset[0]"
      :min="-range"
      :max="range"
      color="red"
      :disable="selected.length === 0"
    />
    <q-badge color="green">Y: {{ offset[1] }}</q-badge>
    <q-slider
      v-model="offset[1]"
      :min="-range"
      :max="range"
      color="green"
      :disable="selected.length === 0"
    />
    <q-badge color="blue">Z: {{ offset[2] }}</q-badge>
    <q-slider
      v-model="offset[2]"
      :min="-range"
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
      @click="$emit('feature:update', translatedMesh)"
    />
  </div>
</template>

<script>
import translateMesh from "./Translate.js";

export default {
  name: "Translate",
  props: {
    selected: {
      type: Array
    }
  },
  data() {
    return {
      offset: [0, 0, 0],
      range: 100,
      translatedMesh: undefined
    };
  },
  watch: {
    offset() {
      this.generate();
    }
  },
  methods: {
    generate() {
      this.translatedMesh = translateMesh(
        this.offset,
        this.selected[0].geometry
      );
      this.$emit("feature:preview", this.translatedMesh);
    }
  },
  mounted() {
    console.log("Translate Mounted");
    this.generate();
  }
};
</script>
