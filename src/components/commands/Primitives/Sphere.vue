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
    selected: {
      type: Array
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
    selectedFeatureType(){
      return this.selected[0] ? this.selected[0].type : undefined;
    },
    isCreating() {
      return this.selectedFeatureType !== "Sphere";
    }
  },
  methods: {
    generate() {
      this.sphere = createSphere(this.radius);
      this.$emit("feature:preview", this.sphere.geometry);
    }
  },
  mounted() {
    console.log("Sphere Mounted");
    this.generate();
  }
};
</script>
