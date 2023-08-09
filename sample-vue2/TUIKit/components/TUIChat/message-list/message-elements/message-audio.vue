<template>
  <div
    class="message-audio"
    :class="[message.flow === 'out' && 'reserve']"
    @click="handlePlay"
  >
    <Icon
      :file="voice"
      :class="[message.flow === 'out' && 'icon-reserve']"
    ></Icon>
    <label>{{ content.second }} "</label>
  </div>
</template>

<script lang="ts" setup>
import {
  watchEffect,
  ref,
  watch,
  defineProps,
  onMounted,
} from "../../../../adapter-vue";
import Icon from "../../../common/Icon.vue";
import voice from "../../../../assets/icon/voice.png";
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
const audio = uni.createInnerAudioContext();
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
  audio.onError((e) => {
    // ios 音频播放无声，可能是因为系统开启了静音模式
    uni.showToast({
      icon: "none",
      title: "该音频暂不支持播放",
    });
  });
});

const handlePlay = () => {
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
  align-items: center;
  position: relative;
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
  .icon {
    margin: 0 7px;
  }
}
.reserve {
  flex-direction: row-reverse;
  .icon {
    transform: rotate(180deg);
  }
}
</style>