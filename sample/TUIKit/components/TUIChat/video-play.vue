<template>
  <div class="dialog-video">
    <video
      v-if="show"
      id="videoEle"
      class="video-box"
      :src="videoData"
      controls
      autoplay
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from '../../adapter-vue';
import { TUIGlobal } from '@tencentcloud/universal-api';
import { onLoad, onReady } from '@dcloudio/uni-app';

const videoData = ref();
const show = ref(false);
const videoContext = ref();
onLoad((option: any) => {
  videoData.value = option && option.videoUrl;
  show.value = true;
});

onReady(() => {
  show.value = true;
  videoContext.value = TUIGlobal.createVideoContext('videoEle');
});
</script>
<style lang="scss" scoped>
.dialog-video {
  position: fixed;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(#000, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .video-box {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
