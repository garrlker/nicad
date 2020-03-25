<template>
  <div>
    <q-btn
      align="right"
      color="warning"
      label="Cancel"
      @click="$emit('setCommand', 'Menu')"
    />

    <q-btn align="right" color="primary" label="Commit" @click="commit" />
  </div>
</template>

<script>
import { CSG } from "@jscad/csg";

export default {
  name: "Subtract",
  props: {
    feature: {
      type: Object
    },
    staged: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  methods: {
    commit() {
      if (this.staged.length > 1) {
        var geometry = this.staged[0].geometry;
        for (var i = 1; i < this.staged.length; i += 1) {
          geometry = geometry.subtract(this.staged[i].geometry);
        }
        this.$emit("op:execute", geometry);
      }
    },
    preview() {
      if (this.staged.length > 1) {
        var geometry = this.staged[0].geometry;
        for (var i = 1; i < this.staged.length; i += 1) {
          geometry = geometry.subtract(this.staged[i].geometry);
        }
        this.$emit("feature:preview", geometry);
      }
    }
  },
  mounted() {
    console.log("Subtract Mounted");
    this.preview();
  }
};
</script>
