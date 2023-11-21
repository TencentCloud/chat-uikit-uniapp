let vueVersion: number;
// #ifndef VUE3
export * from "@vue/composition-api";
vueVersion = 2;
// #endif

// #ifdef VUE3
export * from "vue";
vueVersion = 3;
// #endif
console.warn(`[adapter-vue]: vue version is ${vueVersion}`);
export { vueVersion };
