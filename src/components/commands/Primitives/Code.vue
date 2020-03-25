<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="editor">
      <prism-editor v-model="code" language="js"></prism-editor>
    </div>
    <q-btn
      align="right"
      color="warning"
      label="Cancel"
      @click="$emit('setCommand', 'Menu')"
    />
    <q-btn
      align="right"
      color="primary"
      label="Preview"
      @click="preview(code)"
    />
    <q-btn align="right" color="primary" label="Create" @click="create(code)" />
  </div>
</template>

<script>
import { CSG } from "@jscad/csg";
import * as bla from "@jscad/core";
import { generateOutput, compile } from "@jscad/core";

export default {
  name: "Code",
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
      code: `function main(){\nreturn sphere(2);\n}`
    };
  },
  watch: {
    radius(newRadius) {
      this.preview(newRadius);
    }
  },
  methods: {
    async compileCode(code){
      var csg = await compile(code, 20);
      console.log("CSG Generated", csg);
      return csg;
    },
    async create(code) {
      
      var geometry = await this.compileCode(code);
      geometry = geometry[0];
      let feature = {
        name: "Code",
        children: [],
        geometry,
        type: "Code"
      };

      console.log("End of create");
      this.$emit("feature:create", feature);
    },
    async preview(code) {
      let geometry = await this.compileCode(code);
      geometry = geometry[0];
      this.$emit("feature:preview", geometry);
    },
    async update(code) {
      let geometry = await this.compileCode(code);
      geometry = geometry[0];
      this.$emit("feature:update", geometry);
      this.$emit("feature:preview", undefined);
    }
  },
  mounted() {
    console.log("Code Mounted");
  }
};
</script>
<style scoped>
.editor {
  max-height: 500px;
  overflow-y: scroll;
}
</style>
