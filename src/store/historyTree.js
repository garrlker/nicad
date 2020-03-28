export default {
  state: {
    tree: []
  },
  getters: {
    getTree: state => state.tree,
    getFeature: state => index => state.tree[index]
  },
  mutations: {
    createFeatureNode: (state, feature) => {
      state.tree.push(feature);
    },
    removeFeatureNode: (state, featureIndex) => {
      state.tree = state.tree.filter((feature, index) => {
        if (index !== featureIndex) return feature;
      });
    },
    updateFeatureNode: (state, index, feature) => {
      this.$set(state.tree, index, feature);
    }
  },
  actions: {
    createFeatureNode: (context, feature) =>
      context.commit("createFeatureNode", feature),
    removeFeatureNode: (context, featureIndex) =>
      context.commit("removeFeatureNode", featureIndex),
    updateFeatureNode: (context, index, feature) =>
      context.commit("updateFeatureNode", index, feature)
  }
};

// Tree Node
// {
//   name: "Cube",
//   children: [],
//   geometry, // Frozen
//   type: "Cube"
//   uuid: 'asdasdasda'
// };
