<template>
  <div>
    <q-btn-dropdown
      color="blue"
      label="Primitives"
      dropdown-icon="change_history"
    >
      <q-list>
        <q-item clickable v-close-popup @click="$emit('setCommand', 'Cube')">
          <q-item-section>
            <q-item-label>Cube</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="$emit('setCommand', 'Sphere')">
          <q-item-section>
            <q-item-label>Sphere</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="$emit('setCommand', 'Cylinder')">
          <q-item-section>
            <q-item-label>Cylinder</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="$emit('setCommand', 'Code')">
          <q-item-section>
            <q-item-label>Code</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn-dropdown
      color="green"
      label="Transforms"
      dropdown-icon="transform"
    >
      <q-list>
        <q-item clickable v-close-popup @click="$emit('setCommand', 'Translate')">
          <q-item-section>
            <q-item-label>Translate</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      dimensions: [10, 10, 10]
    };
  }
};
</script>
