import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import { store } from './store'
import './quasar'
Vue.config.productionTip = false
import "prismjs";
import "prismjs/themes/prism.css";
import VuePrismEditor from "vue-prism-editor";
import "vue-prism-editor/dist/VuePrismEditor.css"; // import the styles




Vue.component("prism-editor", VuePrismEditor);
Vue.use(Vuex)

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
