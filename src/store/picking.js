export default {
  state: {
    drawCalls: [],
    drawCallKeys: {}
  },
  getters: {
    getDrawCalls: state => state.drawCalls
  },
  mutations: {
    addDrawCall: (state, key, drawCall) => {
      let drawCallIndex = state.drawCalls.push(drawCall) - 1;
      state.drawCallKeys[key] = drawCallIndex;
    },
    removeDrawCall: (state, key) => {
      let index = state.drawCallKeys[key];

      // Remove the drawcall and key
      state.drawCalls.splice(index, 1);
      state.drawCallKeys[key] = undefined;
    }
  },
  actions: {
    addDrawCall: (context, key, drawCall) => context.commit('addDrawCall', key, drawCall),
    removeDrawCall: (context, key) => context.commit('removeDrawCall', key)
  }
}
