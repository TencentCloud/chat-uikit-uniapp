<template>
  <div
    class="image-container"
    @click="handleImagePreview"
  >
    <image
      class="message-image"
      mode="aspectFit"
      :src="props.content.url"
      :style="{ width: imageStyles.width, height: imageStyles.height }"
      @load="imageLoad"
    />
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref } from '../../../../adapter-vue';
import type { IMessageModel } from '@tencentcloud/chat-uikit-engine';
import type { IImageMessageContent } from '../../../../interface';

interface IProps {
  content: IImageMessageContent;
  messageItem: IMessageModel;
}
interface IEmit {
  (key: 'previewImage'): void;
}

const emits = defineEmits<IEmit>();
const props = withDefaults(
  defineProps<IProps>(),
  {
    content: () => ({}),
    messageItem: () => ({} as IMessageModel),
  },
);

const DEFAULT_MAX_SIZE = 155;
const imageStyles = ref({ width: 'auto', height: 'auto' });

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
  imageStyles.value.width = imageWidth + 'px';
  imageStyles.value.height = imageHeight + 'px';
};

watchEffect(() => {
  genImageStyles(props.content);
});

const imageLoad = (event: Event) => {
  genImageStyles(event.detail);
};

const handleImagePreview = () => {
  if (props.messageItem?.status === 'success' || props.messageItem.progress === 1) {
    emits('previewImage');
  }
};
</script>

<style lang="scss" scoped>
.image-container {
  position: relative;
  background-color: #f4f4f4;
  font-size: 0;

  .message-image {
    max-width: 150px;
  }
}
</style>
