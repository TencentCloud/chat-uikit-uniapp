let vueVersion: number;
let framework = 'vue2';
// #ifndef VUE3
export * from '@vue/composition-api';
vueVersion = 2;
// #endif

// #ifdef VUE3
export * from 'vue';
vueVersion = 3;
framework = 'vue3';
// #endif
console.warn(`[adapter-vue]: vue version is ${vueVersion}`);
export { vueVersion, framework };
