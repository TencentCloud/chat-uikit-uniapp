<template>
  <div class="message-video">
    <div
      class="message-video-box"
      :class="[!videoData.progress && 'message-video-cover']"
      @click="handlerVideoPlay"
    >
      <image :src="videoData.snapshotUrl" class="message-video-box"></image>
      <Icon :file="playIcon" class="video-play"></Icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref, watch, defineProps } from "../../../../adapter-vue";
import Icon from "../../../common/Icon.vue";
import playIcon from "../../../../assets/icon/video-play.png";
const props = defineProps({
  content: {
    type: Object,
    default: () => ({}),
  },
  messageItme: {
    type: Object,
    default: () => ({}),
  },
});

const videoData = ref({
  progress: 0,
});
const message = ref();

watchEffect(() => {
  videoData.value = props.content;
});

const handlerVideoPlay = () => {
  uni.navigateTo({
    url: `/TUIKit/components/TUIChat/video-play?videoUrl=${videoData.value.url}`,
  });
};
</script>
<style lang="scss" scoped>
.message-video {
  position: relative;
  &-box {
    width: 120px;
    max-width: 120px;
    background-color: rgba(#000000, 0.3);
    border-radius: 6px;
    height: 200px; // todo 优化高度动态获取
  }
  .video-play {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  &-cover {
    display: inline-block;
    position: relative;
    .video-play {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 3;
      width: 35px;
      height: 35px;
      margin: auto;
    }
  }
}
</style>
