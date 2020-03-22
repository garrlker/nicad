<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <q-input v-model.number="width" type="number" filled label="Width" />
      <q-input v-model.number="height" type="number" filled label="Height" />
      <q-input v-model.number="depth" type="number" filled label="Depth" />
      <q-badge color="red">X: {{ position[0] }}</q-badge>

      <q-btn
        v-if="mode === 'new'"
        align="right"
        color="primary"
        label="Create"
        @click="create([width, height, depth], position)"
      />
      <q-btn
        v-else
        align="right"
        color="primary"
        label="Update"
        @click="update([width, height, depth], position)"
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
      width: 10,
      height: 10,
      depth: 10,
      position: [0, 0, 0]
    };
  },
  methods: {
    create(size, position) {
      console.log("create Cube - Starting");
      let geometry = CSG.cube({
        radius: size
      }).translate(position);
      let feature = {
        name: "Cube",
        children: [],
        geometry,
        type: "Cube"
      };

      this.$emit("feature", feature);
      console.log("create Cube - Output", feature, geometry.getBounds());
    },
    translate(position) {
      if (this.mode === "new") return;
      console.log(this.feature);
      if (this.feature) {
        console.log(this.feature.translate(position));
        this.$emit("feature:update", this.feature.translate(position));
      }
    },
    update(size, position) {
      let geometry = CSG.cube({
        radius: size
      }).translate(position);

      this.$emit("feature:update", geometry);
    }
  },
  mounted() {
    console.log("Cube Mounted");
  }
};
</script>
