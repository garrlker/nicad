<template>
  <div class="toolbar">
    <q-btn
      v-for="command in currentCmdList"
      :key="command.name"
      flat
      outline
      :icon="command.icon ? command.icon : 'info'"
      class="toolbar-button"
      @click="$emit('setCommand', command.name)"
    />
  </div>
</template>

<script>
export default {
  name: "Menu",
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      commandList: ["Cube", "Sphere", "Cylinder"]
    };
  },
  computed: {
    currentCmdList() {
      var selectionState = 0;
      if (this.selected) {
        selectionState = this.selected.length;
      }

      switch (selectionState) {
        case 0:
          return [
            { name: "Cube", icon: "app:cube" },
            { name: "Sphere", icon: "app:sphere" },
            { name: "Cylinder", icon: "app:cylinder" },
            { name: "Code", icon: "code" },
          ];
          break;
        case 1:
          return [
            { name: "Translate", icon: "app:translate" },
            { name: "Rotate", icon: "app:rotate" },
            { name: "Scale", icon: "app:scale" }
          ];
          break;
        case 2:
          return [{ name: "Subtract", icon: "app:subtract" }];
          break;
      }
    }
  },
  created() {
    // Temporary hack to make raw SVGs work with Quasar
    const myIcons = {
      "app:cube": "img:assets/icons/cube.svg",
      "app:cylinder": "img:assets/icons/cylinder.svg",
      "app:sphere": "img:assets/icons/sphere.svg",
      "app:code": "img:assets/icons/code.svg",
      "app:scale": "img:assets/icons/scale.svg",
      "app:rotate": "img:assets/icons/rotate.svg",
      "app:translate": "img:assets/icons/translate.svg",
      "app:difference": "img:assets/icons/difference.svg",
      "app:intersect": "img:assets/icons/intersect.svg",
      "app:subtract": "img:assets/icons/subtract.svg",
      "app:union": "img:assets/icons/union.svg"
    };

    this.$q.iconMapFn = iconName => {
      const icon = myIcons[iconName];
      if (icon !== void 0) {
        return {
          icon: icon
        };
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  min-height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-y: hidden;
  overflow-x: hidden;
  align-items: center;

  button {
    @media only screen and (min-width: 1024px) {
      font-size: 32px;
    }
    @media only screen and (max-width: 1024px) {
      font-size: 24px;
    }
  }
}
</style>
