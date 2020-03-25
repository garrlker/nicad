<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <h6 class="text-h6 text-center"> {{ mode === 'new' ? 'Create Cylinder' : 'Edit Cylinder' }} </h6>
      <q-input v-model.number="length" type="number" filled label="Length" />
      <q-input v-model.number="radius" type="number" filled label="Radius" />

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
        @click="
          mode === 'new' ? create(length, radius) : update(length, radius)
        "
      />
    </div>
  </div>
</template>

<script>
import { CSG } from "@jscad/csg";

export default {
  name: "Cylinder",
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
      length: 10,
      radius: 10
    };
  },
  watch: {
    length(newLength) {
      this.preview(newLength, this.radius);
    },
    radius(newRadius) {
      this.preview(this.length, newRadius);
    }
  },
  methods: {
    create(length, radius) {
      console.log("create Cylinder - Starting");
      let geometry = CSG.cylinder({
        start: [0, -length / 2, 0],
        end: [0, length / 2, 0],
        radius,
        resolution: 16
      });

      let feature = {
        name: "Cylinder",
        children: [],
        geometry,
        type: "Cylinder"
      };

      this.$emit("feature:create", feature);
      console.log("create Cylinder - Output", feature);
    },
    preview(length, radius) {
      let geometry = CSG.cylinder({
        start: [0, -length / 2, 0],
        end: [0, length / 2, 0],
        radius,
        resolution: 16
      });

      this.$emit("feature:preview", geometry);
    },
    update(length, radius) {
      let geometry = CSG.cylinder({
        start: [0, -length / 2, 0],
        end: [0, length / 2, 0],
        radius,
        resolution: 16
      });

      this.$emit("feature:update", geometry);
      this.$emit("feature:preview", undefined);
    }
  },
  mounted() {
    console.log("Cylinder Mounted");
    this.preview(this.length, this.radius);
  }
};
</script>
