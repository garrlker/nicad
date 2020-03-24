<template>
  <div>
    <div v-if="!featureIsSelected" class="q-pa-md q-gutter-sm">
      <q-btn
        class="full-width"
        color="primary"
        label="Cube"
        size="xl"
        @click="$emit('setCommand', 'Cube')"
      />
      <q-btn
        class="full-width"
        color="primary"
        label="Sphere"
        size="xl"
        @click="$emit('setCommand', 'Sphere')"
      />
      <q-btn
        class="full-width"
        color="primary"
        label="Cylinder"
        size="xl"
        @click="$emit('setCommand', 'Cylinder')"
      />
      <q-btn
        class="full-width"
        color="primary"
        label="Custom"
        size="xl"
        @click="$emit('setCommand', 'Code')"
      />
    </div>
    <div v-else class="q-pa-md q-gutter-sm">
      <q-btn
        class="full-width"
        color="primary"
        label="Edit"
        icon="create"
        size="xl"
        @click="$emit('setCommand', featureType)"
      />
      <q-btn
        class="full-width"
        color="primary"
        label="Translate"
        icon="open_with"
        size="xl"
        @click="$emit('setCommand', 'Translate')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Menu",
  props: {
    selected: {
      type: Number
    },
    featureType: {
      type: String
    }
  },
  data() {
    return {};
  },
  computed: {
    featureIsSelected() {
      return this.selected !== null;
    }
  }
};
</script>
