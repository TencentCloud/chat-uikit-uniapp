<template>
  <movable-area
    class="image-item"
    scale-area
  >
    <movable-view
      class="image-item"
      direction="all"
      :out-of-bounds="false"
      :inertia="true"
      damping="90"
      friction="2"
      scale="true"
      scale-min="1"
      scale-max="4"
      scale-value="1"
    >
      <img
        class="image-preview"
        :class="[isWidth ? 'is-width' : 'isHeight']"
        mode="widthFix"
        :style="{
          transform: `scale(${props.zoom}) rotate(${props.rotate}deg)`,
        }"
        :src="props.src"
        :date-src="props.src"
        @click.stop
      >
    </movable-view>
  </movable-area>
</template>
<script setup lang="ts">
import { computed } from '../../../adapter-vue';
import { IMessageModel } from '@tencentcloud/chat-uikit-engine';
const props = defineProps({
  zoom: {
    type: Number,
    default: 1,
  },
  rotate: {
    type: Number,
    default: 0,
  },
  src: {
    type: String,
    default: '',
  },
  messageItem: {
    type: Object,
    default: () => ({} as IMessageModel),
  },
});
const isWidth = computed(() => {
  const { width = 0, height = 0 }
    = props.messageItem?.payload?.imageInfoArray?.[0] || {};
  return width >= height;
});
</script>
<style lang="scss">
.image-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.1s ease 0s;
  pointer-events: auto;
}

.is-width {
  width: 100%;
}
</style>
