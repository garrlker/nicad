<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <h6 class="text-h6 text-center">
        {{ isCreating ? "Create Sphere" : "Edit Sphere" }}
      </h6>
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
        @click="
          isCreating
            ? $emit('feature:create', sphere)
            : $emit('feature:update', sphere.geometry)
        "
      />
    </div>
  </div>
</template>

<script>
import { createSphere } from "./Sphere.js";

export default {
  name: "Sphere",
  props: {
    featureType: {
      type: String
    }
  },
  data() {
    return {
      radius: 5,
      sphere: undefined
    };
  },
  watch: {
    radius(newRadius) {
      this.generate();
    }
  },
  computed: {
    isCreating() {
      return this.featureType !== "Sphere";
    }
  },
  methods: {
    generate() {
      this.sphere = {
        name: "Sphere",
        children: [],
        geometry: createSphere(this.radius),
        type: "Sphere"
      };
      this.$emit("feature:preview", this.sphere.geometry);
    }
  },
  mounted() {
    console.log("Sphere Mounted");
    this.generate();
  }
};
</script>
