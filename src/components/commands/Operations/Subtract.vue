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
    staged: {
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
    stagedGeometries() {
      this.execute();
    }
  },
  computed: {
    stagedGeometries(){
      return this.staged.map(feature => feature.geometry);
    }
  },
  methods: {
    execute() {
      this.output = subtract(this.stagedGeometries);
      this.$emit("feature:preview", this.output);
    }
  },
  mounted() {
    console.log("Subtract Mounted");
    this.execute();
  }
};
</script>
