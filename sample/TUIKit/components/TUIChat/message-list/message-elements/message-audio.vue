<template>
  <div
    :class="{
      'message-audio': true,
      'reserve': props.messageItem.flow === 'out',
    }"
    @click="toggleClick"
  >
    <div class="audio-icon-container">
      <div :class="{ 'mask': true, 'play': isAudioPlaying }" />
      <Icon
        class="icon"
        width="15px"
        height="20px"
        :file="audioIcon"
      />
    </div>
    <div
      class="time"
      :style="{ width: `${props.content.second * 5}px` }"
    >
      {{ props.content.second || 1 }} "
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, watch } from '../../../../adapter-vue';
import { IMessageModel } from '@tencentcloud/chat-uikit-engine';
import Icon from '../../../common/Icon.vue';
import { Toast } from '../../../common/Toast/index';
import audioIcon from '../../../../assets/icon/msg-audio.svg';
import { IAudioMessageContent, IAudioContext } from '../../../../interface';

interface IProps {
  broadcastNewAudioSrc: string;
  messageItem: IMessageModel;
  content: IAudioMessageContent;
}

interface IEmits {
  (
    e: 'getGlobalAudioContext',
    map: Map<string, IAudioContext>,
    options?: { newAudioSrc: string }
  ): void;
  (e: 'setAudioPlayed', messageID: string): void;
}

const emits = defineEmits<IEmits>();
const props = withDefaults(defineProps<IProps>(), {
  messageItem: () => ({}) as IMessageModel,
  content: () => ({}) as IAudioMessageContent,
});

const audioMap = new Map<string, IAudioContext>();
const isAudioPlaying = ref<boolean>(false);

onUnmounted(() => {
  const audioContext = getAudio();
  if (isAudioPlaying.value) {
    stopAudio();
  }
  audioContext?.destroy?.();
  audioMap.delete('audio');
});

watch(() => props.broadcastNewAudioSrc, (newSrc) => {
  if (newSrc !== props.content.url && isAudioPlaying.value) {
    stopAudio();
    // The audioContext may have been destroyed. Manually execute the pause
    isAudioPlaying.value = false;
  }
});

function toggleClick() {
  emits('getGlobalAudioContext', audioMap, { newAudioSrc: props.content.url });
  if (props.messageItem.hasRiskContent || !props.content.url) {
    Toast({
      message: '暂不支持播放',
    });
    return;
  }
  // audioContext will be cached, it must be get first
  const audioContext = getAudio();
  if (!audioContext) {
    audioMap.set('audio', uni.createInnerAudioContext() as IAudioContext);
    // #ifdef MP
    uni.setInnerAudioOption({
      obeyMuteSwitch: false,
    });
    // #endif
    initAudioSrc();
  }
  toggleAudioPlayState();
}

function toggleAudioPlayState() {
  if (!isAudioPlaying.value) {
    playAudio();
  } else {
    stopAudio();
  }
}

function initAudioSrc() {
  const audioContext = getAudio();
  if (!audioContext) {
    return;
  }
  audioContext.src = props.content.url;
  isAudioPlaying.value = false;
  audioContext.onPlay(onAudioPlay);
  audioContext.onStop(onAudioStop);
  audioContext.onEnded(onAudioEnded);
  audioContext.onError(onAudioError);
}

function playAudio() {
  const audioContext = getAudio();
  if (!audioContext) {
    return;
  }
  audioContext.play();
  if (props.messageItem.flow === 'in') {
    emits('setAudioPlayed', props.messageItem.ID);
  }
}

function stopAudio() {
  const audioContext = getAudio();
  if (!audioContext) {
    return;
  }
  try {
    // The memory of the audiocontext is in memory. But The play instance may have been destroyed.
    audioContext.stop();
  } catch {
    // ignore
  }
}

function onAudioPlay() {
  isAudioPlaying.value = true;
}

function onAudioStop() {
  isAudioPlaying.value = false;
}

function onAudioEnded() {
  isAudioPlaying.value = false;
}

function onAudioError() {
  console.warn('audio played error');
}

function getAudio(): IAudioContext | undefined {
  return audioMap.get('audio');
}
</script>

<style lang="scss" scoped>
$flow-in-bg-color: #fbfbfb;
$flow-out-bg-color: #dceafd;

:not(not) {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 0;
}

.message-audio {
  flex-direction: row;
  flex: 0 0 auto;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;

  .audio-icon-container {
    width: 16px;
    height: 20px;
    position: relative;
    flex: 0 0 auto;
    flex-direction: row;
    justify-content: flex-end;
    margin: 0 7px 0 0;
    overflow: hidden;

    .mask {
      position: absolute;
      z-index: 1;
      width: 105%;
      height: 105%;
      left: 0;
      top: 0;
      transform-origin: right;
      transform: scaleX(0);
      background-color: $flow-in-bg-color;

      &.play {
        animation: audio-play 2s steps(1, end) infinite;
      }
    }
  }

  @keyframes audio-play {
    0% {
      transform: scaleX(0.7056);
    }

    50% {
      transform: scaleX(0.3953);
    }

    75% {
      transform: scaleX(0);
      visibility: hidden;
    }

    100% {
      transform: scaleX(0);
      visibility: hidden;
    }
  }

  .time {
    max-width: 165px;
    min-width: 20px;
    text-align: start;
    white-space: nowrap;
  }

  &.reserve {
    flex-direction: row-reverse;

    .time {
      text-align: end;
    }

    .audio-icon-container {
      margin: 0 0 0 7px;

      .mask {
        transform-origin: left;
        background-color: $flow-out-bg-color;
      }
    }

    .icon {
      transform: rotate(180deg);
    }
  }
}
</style>
