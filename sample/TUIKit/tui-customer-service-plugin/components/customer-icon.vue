<template>
  <!--本地 icon 资源, uniapp 打包到 app 仅支持标签 image, 打包小程序和 H5 均可支持标签 img -->
  <div class="common-icon-container">
    <image
      v-if="isApp"
      class="common-icon"
      :src="props.src"
      :style="{ width: props.width, height: props.height }"
    />
    <img
      v-else
      class="common-icon"
      :src="props.src"
      :style="{ width: props.width, height: props.height }"
    >
  </div>
</template>
<script lang="ts">
import { isApp } from '../utils/env';

interface Props {
  src: string;
  width?: string;
  height?: string;
}

export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '16px',
    },
    height: {
      type: String,
      default: '16px',
    },
  },
  setup(props: Props) {
    return {
      props,
      isApp,
    };
  },
};
</script>
<style lang="scss" scoped>
.common-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
