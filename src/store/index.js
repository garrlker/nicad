import Vue from 'vue';
import Vuex from 'vuex';
import picking from './picking';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    picking
  },
  state: {},
  getters: {},
  mutation: {},
  actions: {}
});