/* eslint-disable no-empty */
/* eslint-disable no-implicit-coercion */
import App from "./App";

// #ifndef VUE3
import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
Vue.use(VueCompositionAPI);
import unifyPromiseVue2 from "./TUIKit/utils/unifyPromiseVue2";
Vue.config.productionTip = false;
App.mpType = "app";
unifyPromiseVue2();
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
