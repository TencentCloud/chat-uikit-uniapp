<template>
  <div class="message-video">
    <div
      class="message-video-box"
      @click="handlerVideoPlay"
    >
      <image :src="props.content.snapshotUrl" class="message-video-box"></image>
      <Icon
        v-if="props.messageItem.status === 'success' || props.messageItem.progress === 1"
        class="video-play"
        :file="playIcon"
      ></Icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults } from "../../../../adapter-vue";
import type { IMessageModel } from "@tencentcloud/chat-uikit-engine";
import Icon from "../../../common/Icon.vue";
import playIcon from "../../../../assets/icon/video-play.png";
import type { IVideoMessageContent } from "../../../../interface";

const props = withDefaults(
  defineProps<{
    content: IVideoMessageContent;
    messageItem: IMessageModel;
  }>(),
  {
    content: () => ({} as IVideoMessageContent),
    messageItem: () => ({} as IMessageModel),
  }
);

function handlerVideoPlay()  {
  uni.navigateTo({
    url: `/TUIKit/components/TUIChat/video-play?videoUrl=${props.content.url}`,
  });
}
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
    font-size: 0;
  }
  .video-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
