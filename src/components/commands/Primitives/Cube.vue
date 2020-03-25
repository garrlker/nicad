<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <h6 class="text-h6 text-center"> {{ mode === 'new' ? 'Create Cube' : 'Edit Cube' }}</h6>

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
        @click="$emit('setCommand', 'Menu')"
      />
      <q-btn
        align="right"
        color="primary"
        :label="mode === 'new' ? 'Create' : 'Update'"
        @click="mode === 'new' ? create(dimensions) : update(dimensions)"
      />
    </div>
  </div>
</template>

<script>
import { CSG } from "@jscad/csg";
import { v1 as uuidv1 } from "uuid";
console.log("CSG", CSG);

export default {
  name: "Cube",
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
      dimensions: [10, 10, 10],
      position: [0, 0, 0]
    };
  },
  watch: {
    dimensions(newDims) {
      this.preview(newDims);
    }
  },
  methods: {
    create(dimensions) {
      console.log("create Cube - Starting");
      let geometry = CSG.cube({
        radius: dimensions
      });

      let feature = {
        name: "Cube",
        children: [],
        geometry,
        type: "Cube"
      };

      this.$emit("feature:create", feature);
      console.log("create Cube - Output", feature);
    },
    preview(dimensions) {
      let geometry = CSG.cube({
        radius: dimensions
      });

      this.$emit("feature:preview", geometry);
    },
    update(dimensions) {
      let geometry = CSG.cube({
        radius: dimensions
      });

      this.$emit("feature:update", geometry);
      this.$emit("feature:preview", undefined);
    }
  },
  mounted() {
    console.log("Cube Mounted");
    this.preview(this.dimensions);
  }
};
</script>
