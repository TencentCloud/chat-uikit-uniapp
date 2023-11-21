<template>
  <div class="dialog-video">
    <video
      v-if="show"
      class="video-box"
      :src="videoData"
      id="videoEle"
      controls
      autoplay
    ></video>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "../../adapter-vue";
import { TUIGlobal } from "../../utils/universal-api/index";
import { onLoad, onReady } from "@dcloudio/uni-app";
const props = defineProps({
  data: {
    type: String,
    default: () => "",
  },
});

const videoData = ref();
const show = ref(false);
const videoContext = ref();
onLoad((option: any) => {
  videoData.value = option && option.videoUrl;
  show.value = true;
});

onReady(() => {
  show.value = true;
  videoContext.value = TUIGlobal.createVideoContext("videoEle");
});
</script>
<style lang="scss" scoped>
.dialog-video {
  position: fixed;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(#000000, 0.6);
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
