<template>
  <div class="message-video">
    <div
      class="message-video-box"
      @click="handlerVideoPlay"
    >
      <image
        :src="props.content.snapshotUrl"
        class="message-video-box"
      />
      <Icon
        v-if="props.messageItem.status === 'success' || props.messageItem.progress === 1"
        class="video-play"
        :file="playIcon"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults } from '../../../../adapter-vue';
import type { IMessageModel } from '@tencentcloud/chat-uikit-engine';
import Icon from '../../../common/Icon.vue';
import playIcon from '../../../../assets/icon/video-play.png';
import type { IVideoMessageContent } from '../../../../interface';

const props = withDefaults(
  defineProps<{
    content: IVideoMessageContent;
    messageItem: IMessageModel;
  }>(),
  {
    content: () => ({} as IVideoMessageContent),
    messageItem: () => ({} as IMessageModel),
  },
);

function handlerVideoPlay() {
  const encodedUrl = encodeURIComponent(props.content.url);
  uni.navigateTo({
    url: `/TUIKit/components/TUIChat/video-play?videoUrl=${encodedUrl}`,
  });
}
</script>
<style lang="scss" scoped>
.message-video {
  position: relative;

  &-box {
    width: 120px;
    max-width: 120px;
    background-color: rgba(#000, 0.3);
    border-radius: 6px;
    height: 200px;
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
