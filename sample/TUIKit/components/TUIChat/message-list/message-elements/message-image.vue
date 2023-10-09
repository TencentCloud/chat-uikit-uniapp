<template>
  <div class="imageContainer" @click="handleImagePreview">
    <image
      class="messageImage"
      mode="aspectFit"
      :src="props.content.url"
      @load="imageLoad"
      :style="{ width: imageStyles.width, height: imageStyles.height }"
    ></image>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref } from "../../../../adapter-vue";
import type { IMessageModel } from "@tencentcloud/chat-uikit-engine";
import type { IImageMessageContent } from "../../../../interface";
const DEFAULT_MAX_SIZE = 155;
const props = withDefaults(
  defineProps<{
    content: IImageMessageContent,
    messageItem: IMessageModel,
  }>(),
  {
    content: () => ({}),
    messageItem: () => ({} as IMessageModel),
  }
);

const emits = defineEmits(["uploading", "previewImage"]);
const imageStyles = ref({ width: "auto", height: "auto" });

const genImageStyles = (value: { width?: any; height?: any }) => {
  const { width, height } = value;
  if (width === 0 || height === 0) {
    return;
  }

  let imageWidth = 0;
  let imageHeight = 0;
  if (width >= height) {
    imageWidth = DEFAULT_MAX_SIZE;
    imageHeight = (DEFAULT_MAX_SIZE * height) / width;
  } else {
    imageWidth = (DEFAULT_MAX_SIZE * width) / height;
    imageHeight = DEFAULT_MAX_SIZE;
  }
  imageStyles.value.width = imageWidth + "px";
  imageStyles.value.height = imageHeight + "px";
};

watchEffect(() => {
  genImageStyles(props.content);
});

const imageLoad = (event: any) => {
  genImageStyles(event.detail);
};

// 预览
const handleImagePreview = () => {
  if (props.messageItem?.status === 'success' || props.messageItem.progress === 1) {
    emits("previewImage", props.messageItem);
  }
};
</script>
<style lang="scss" scoped>
.imageContainer {
  position: relative;
  background-color: #f4f4f4;
  // 防止div被撑高
  font-size: 0;
  .messageImage {
    max-width: 150px;
    will-change: transform;
  }
}
</style>
