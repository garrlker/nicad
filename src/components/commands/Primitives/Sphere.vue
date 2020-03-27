<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <h6 class="text-h6 text-center"> {{ mode === 'new' ? 'Create Sphere' : 'Edit Sphere' }} </h6>
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
        :label="mode === 'new' ? 'Create' : 'Update'"
        @click="mode === 'new' ? create(radius) : update(radius)"
      />
    </div>
  </div>
</template>

<script>
import { CSG } from "@jscad/csg";
import { v1 as uuidv1 } from "uuid";
console.log("CSG", CSG);

export default {
  name: "Sphere",
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
      radius: 10
    };
  },
  watch: {
    radius(newRadius) {
      this.preview(newRadius);
    }
  },
  methods: {
    create(radius) {
      console.log("create Sphere - Starting");
      let geometry = CSG.sphere({ radius, resolution: 64 });

      let feature = {
        name: "Sphere",
        children: [],
        geometry,
        type: "Sphere"
      };

      this.$emit("feature:create", feature);
      console.log("create Sphere - Output", feature);
    },
    preview(radius) {
      let geometry = CSG.sphere({ radius, resolution: 32 });
      console.log("PREVIEW CALLBACK CALLED");
      this.$emit("feature:preview", geometry);
    },
    update(radius) {
      let geometry = CSG.sphere({ radius, resolution: 64 });

      this.$emit("feature:update", geometry);
      this.$emit("feature:preview", undefined);
    }
  },
  mounted() {
    console.log("Sphere Mounted");
    this.preview(this.radius);
  }
};
</script>
