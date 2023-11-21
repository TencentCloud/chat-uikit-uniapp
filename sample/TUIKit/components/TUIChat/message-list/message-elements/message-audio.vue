<template>
  <div class="message-audio" :class="[message.flow === 'out' && 'reserve']" @click="handlePlay">
    <Icon class="icon" :file="audioIcon"></Icon>
    <label class="time" :style="{ width: `${data.second * 10 + 20}px` }">
      {{ data.second || 1 }} "
    </label>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref, onMounted } from "../../../../adapter-vue";
import { TUIGlobal } from "../../../../utils/universal-api/index";
import Icon from "../../../common/Icon.vue";
import audioIcon from "../../../../assets/icon/msg-audio.svg";
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

const data = ref();
const message = ref();
const show = ref();
const isPlay = ref(false);
const audio = TUIGlobal?.createInnerAudioContext();
watchEffect(() => {
  data.value = props.content;
  message.value = props.messageItem;
});

onMounted(() => {
  audio.onPlay(() => {
    console.log("开始播放");
  });
  audio.onEnded(() => {
    console.log("停止播放");
  });
  audio.onError(() => {
    // ios 音频播放无声，可能是因为系统开启了静音模式
    TUIGlobal?.showToast({
      icon: "none",
      title: "该音频暂不支持播放",
    });
  });
});

const handlePlay = () => {
  if (message.value.hasRiskContent) {
    return;
  }
  if (data.value.url) {
    audio.src = data.value.url;
    audio.play();
  }
  isPlay.value = true;
};
</script>
<style lang="scss" scoped>
@import "../../../../assets/styles/common.scss";
.message-audio {
  display: flex;
  box-sizing: border-box;
  flex: 0 0 auto;
  cursor: pointer;
  overflow: hidden;
  .icon {
    margin-right: 7px;
    margin-left: 0px;
  }
  .time {
    max-width: 200px;
    text-align: start;
  }
}
.reserve {
  flex-direction: row-reverse;
  .time {
    text-align: end;
  }
  .icon {
    margin-right: 0px;
    margin-left: 7px;
    transform: rotate(180deg);
  }
}
</style>
