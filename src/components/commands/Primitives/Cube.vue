<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <h6 class="text-h6 text-center">
        {{ isCreating ? "Create Cube" : "Edit Cube" }}
      </h6>

      <q-input
        v-model.number="dimensions[0]"
        type="number"
        filled
        label="Width"
      />
      <q-input
        v-model.number="dimensions[1]"
        type="number"
        filled
        label="Height"
      />
      <q-input
        v-model.number="dimensions[2]"
        type="number"
        filled
        label="Depth"
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
        :label="isCreating ? 'Create' : 'Update'"
        @click="
          isCreating
            ? $emit('feature:create', cube)
            : $emit('feature:update', cube.geometry)
        "
      />
    </div>
  </div>
</template>

<script>
import { createCube } from "./Cube.js";
import { v1 as uuidv1 } from "uuid";

export default {
  name: "Cube",
  props: {
    selected: {
      type: Array
    }
  },
  data() {
    return {
      dimensions: [10, 10, 10],
      position: [0, 0, 0],
      cube: undefined
    };
  },
  watch: {
    dimensions(newDims) {
      this.generate();
    }
  },
  computed: {
    selectedFeatureType(){
      return this.selected[0] ? this.selected[0].type : undefined;
    },
    isCreating() {
      return this.selectedFeatureType !== "Cube";
    }
  },
  methods: {
    generate() {
      this.cube = createCube(this.dimensions);
      this.$emit("feature:preview", this.cube.geometry)
    }
  },
  mounted() {
    this.generate();
  }
};
</script>
