import Vue from 'vue';
import * as VueUni from './adapter-vue-uniapp';
import * as VueWeb from './adapter-vue-web';

let vue: any = VueUni;

if (window && !(window as any).uni) {
  vue = { ...VueWeb, ...(VueWeb as any).vue };
}

export default vue as typeof Vue;
