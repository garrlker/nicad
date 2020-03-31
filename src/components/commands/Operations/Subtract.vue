<template>
  <div>
    <q-btn
      align="right"
      color="warning"
      label="Cancel"
      @click="$emit('setCommand', '')"
    />

    <q-btn
      align="right"
      color="primary"
      label="Commit"
      @click="$emit('op:execute', output)"
    />
  </div>
</template>

<script>
import subtract from "./Subtract";

export default {
  name: "Subtract",
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      output: undefined
    };
  },
  watch: {
    selectedGeometries() {
      this.execute();
    }
  },
  computed: {
    selectedGeometries(){
      return this.selected.map(feature => feature.geometry);
    }
  },
  methods: {
    execute() {
      this.output = subtract(this.selectedGeometries);
      this.$emit("feature:preview", this.output);
    }
  },
  mounted() {
    console.log("Subtract Mounted");
    this.execute();
  }
};
</script>
