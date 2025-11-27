<template>
  <div
    :class="['tui-navigation', customStyle]"
    :style="{
      paddingTop: `${statusBarHeight}px`
    }"
  >
    <div class="tui-navigation-left">
      <slot name="left" />
    </div>

    <div
      v-if="title"
      class="tui-navigation-title"
    >
      <h1 class="tui-navigation-title-text">
        {{ title }}
      </h1>
    </div>

    <div class="tui-navigation-right">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from '../../../adapter-vue';
import { isH5 } from '../../../utils/env';

interface Props {
  title?: string;
  customStyle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  customStyle: '',
});

const statusBarHeight = ref<number>(0);

onMounted(() => {
  if (isH5) {
    statusBarHeight.value = 0;
  } else {
    const sysInfo = uni.getSystemInfoSync();
    statusBarHeight.value = sysInfo.statusBarHeight;
  }
});
</script>

<style lang="scss" scoped>
.tui-navigation {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #EBF0F6;
  min-height: 44px;
  padding: 0 12px;

  &-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    flex: 1;
  }

  &-title {
    flex: 10;
    text-align: center;
    min-width: 0;

    &-text {
      overflow: hidden;
      word-break: keep-all;
      text-overflow: ellipsis;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
  }

  &-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex: 1;
  }

  &-back-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    opacity: 0.8;
  }

  &-back-text {
    font-size: 16px;
    color: #007AFF;
  }
}
</style>
