/* eslint-disable @typescript-eslint/no-unused-vars */
import * as _Vue from 'vue';
import * as VueApi from '@vue/composition-api';

let VueBasic: any = {
  default: {},
};
VueBasic = _Vue ? _Vue : VueBasic;
let vueVersion: number;
let createVNode = (
  arg1: any,
  arg2: any,
): { component: any; props: any; data: any } => {
  return {} as { component: any; props: any; data: any };
};
let render = (arg1: any, arg2: any) => {
  return;
};

let defineProps = () => {
  return;
};

let defineEmits = () => {
  return;
};

let withDefaults = (arg: any) => {
  return arg;
};

try {
  if (
    (VueBasic as any)?.default?.version
    && (VueBasic as any)?.default?.version?.startsWith('2.7.')
  ) {
    // >= Vue 2.7.0
    vueVersion = 2.7;
  } else if (
    (VueBasic as any)?.default?.version
    && (VueBasic as any)?.default?.version?.startsWith('2.')
  ) {
    // < Vue 2.7.0
    vueVersion = 2;
  } else {
    // >= Vue 3.0.0
    vueVersion = 3;
    createVNode = (VueBasic as any)?.createVNode;
    render = (VueBasic as any)?.render;
    defineProps = (VueBasic as any)?.defineProps;
    defineEmits = (VueBasic as any)?.defineEmits;
    withDefaults = (VueBasic as any)?.withDefaults;
    // exportedAPIOrigin = Vue;
  }
} catch (error: any) {
  // >= Vue 3.0.0
  vueVersion = 3;
  createVNode = (VueBasic as any)?.createVNode;
  render = (VueBasic as any)?.render;
  defineProps = (VueBasic as any)?.defineProps;
  defineEmits = (VueBasic as any)?.defineEmits;
  withDefaults = (VueBasic as any)?.withDefaults;
}
console.warn(`[adapter-vue]: vue version is ${vueVersion}`);

let vue: any = VueBasic;

if (vueVersion === 2) {
  vue = VueApi;
}

export { vueVersion, render, createVNode, defineProps, defineEmits, withDefaults };
export { vue };
