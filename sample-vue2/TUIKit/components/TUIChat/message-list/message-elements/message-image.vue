<template>
  <div class="message-image"  @click="handleImagePreview">
    <image
      :src="data.url"
      :style="{ height: imgHeight, width: imgWidth }"
    ></image>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref, watch, defineProps } from "../../../../adapter-vue";
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
const message = ref();
const show = ref();
const skeleton: any = ref();
const emits = defineEmits(["uploading", "previewImage"]);
// 计算图片的大小
const imgHeight = ref("");
const imgWidth = ref("");

watchEffect(() => {
  data.value = props.content;
  // 等比例计算图片的 width、height
  const DEFAULT_MAX_SIZE = 155;
  let imageWidth = 0;
  let imageHeight = 0;
  let imageInfo = props.content;
  if (imageInfo.width >= imageInfo.height) {
    imageWidth = DEFAULT_MAX_SIZE;
    imageHeight = (DEFAULT_MAX_SIZE * imageInfo.height) / imageInfo.width;
  } else {
    imageWidth = (DEFAULT_MAX_SIZE * imageInfo.width) / imageInfo.height;
    imageHeight = DEFAULT_MAX_SIZE;
  }

  imgWidth.value = imageWidth + "px";
  imgHeight.value = imageHeight + "px";
});

// 预览
const handleImagePreview = () => {
  uni.previewImage({
    current: data.value.url,
    // 当前显示图片的http链接
    urls: [data.value.url],
  });
};

</script>
<style lang="scss" scoped>
.message-image {
  position: relative;
  image {
    max-width: 150px;
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
