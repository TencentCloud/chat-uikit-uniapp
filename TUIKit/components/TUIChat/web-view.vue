<template>
  <web-view :src="url"></web-view>
</template>

<script lang="ts" setup>
import { ref } from "../../adapter-vue";
import { onLoad } from "@dcloudio/uni-app";

const url = ref('');
onLoad((option: any) => {
  url.value = option && option.url;
});
</script>
<style lang="scss" scoped>
</style>
