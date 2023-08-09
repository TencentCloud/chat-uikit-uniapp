<template>
  <div class="message-image"  @click="handleImagePreview">
    <image
      class="image"
      mode="aspectFit"
      :src="data.url"
      @load="imageLoad"
      :style="{ width: imageStyles.width, height: imageStyles.height }"
    ></image>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref, defineProps } from "../../../../adapter-vue";
const DEFAULT_MAX_SIZE = 155;
const props = defineProps({
  content: {
    type: Object,
    default: () => ({}),
  },
  messageItem: {
    type: Object,
    default: () => ({}),
  },
});

const data = ref({
  progress: 0,
});
const emits = defineEmits(["uploading", "previewImage"]);
const imageStyles = ref({ width: 'auto', height: 'auto' });

const genImageStyles = (value: { width: any; height: any; }) => {
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
}

watchEffect(() => {
  data.value = props.content;
  genImageStyles(props.content);
});

const imageLoad = (event: any) => {
  genImageStyles(event.detail);
};

// 预览
const handleImagePreview = () => {
  if (!data.value.progress) {
    emits("previewImage", props.messageItem);
  }
};

</script>
<style lang="scss" scoped>
.message-image {
  position: relative;
  .image {
    max-width: 150px;
    will-change: transform;
  }
  .progress {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 20px;
    left: 0;
    top: 0;
    background: rgba(#000000, 0.5);
    display: flex;
    align-items: center;
    progress {
      width: 100%;
    }
  }
}
</style>
