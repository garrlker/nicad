<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <h6 class="text-h6 text-center">
        {{ isCreating ? "Create Cylinder" : "Edit Cylinder" }}
      </h6>
      <q-input v-model.number="length" type="number" filled label="Length" />
      <q-input v-model.number="radius" type="number" filled label="Radius" />

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
        @click="isCreating ? $emit('feature:create', cylinder)
            : $emit('feature:update', cylinder.geometry)"
      />
    </div>
  </div>
</template>

<script>
import { createCylinder } from "./Cylinder.js";

export default {
  name: "Cylinder",
  props: {
    featureType: {
      type: String
    }
  },
  data() {
    return {
      length: 10,
      radius: 10,
      cylinder: undefined
    };
  },
  watch: {
    length(newLength) {
      this.generate();
    },
    radius(newRadius) {
      this.generate();
    }
  },
  computed: {
    isCreating() {
      return this.featureType !== "Cylinder";
    }
  },
  methods: {
    generate() {
      this.cylinder = {
        name: "Cylinder",
        children: [],
        geometry: createCylinder(this.radius, this.length),
        type: "Cylinder"
      };
      this.$emit("feature:preview", this.cylinder.geometry);
    }
  },
  mounted() {
    console.log("Cylinder Mounted");
    this.generate();
  }
};
</script>
