<template>
  <div :class="{
    'message-input-audio': true,
    'message-input-audio-open': isAudioTouchBarShow,
  }">
    <Icon
      class="audio-message-icon"
      :file="audioIcon"
      @onClick="switchAudio"
    />
    <view
      v-if="props.isEnableAudio"
      class="TUI-message-input-main"
      @touchstart="handleTouchStart"
      @longpress="handleLongPress"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <span>{{ TUITranslateService.t(`TUIChat.${touchBarText}`) }}</span>
      <view v-if="isRecording" class="record-modal">
        <div class="red-mask"></div>
        <view class="float-element moving-slider"></view>
        <view class="float-element modal-title">{{ TUITranslateService.t(`TUIChat.${modalText}`) }}</view>
      </view>
    </view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "../../../adapter-vue";
import {
  TUIStore,
  StoreName,
  TUIChatService,
  SendMessageParams,
  IConversationModel,
  TUITranslateService,
} from "@tencentcloud/chat-uikit-engine";
import throttle from "lodash/throttle";
import Icon from "../../common/Icon.vue";
import audioIcon from "../../../assets/icon/audio.svg";
import { Toast, TOAST_TYPE } from "../../common/Toast/index";
import { TUIGlobal } from "../../../utils/universal-api/index";
import { isEnabledMessageReadReceiptGlobal } from "../utils/utils";

interface IProps {
  isEnableAudio: boolean;
}

interface RecordResult {
  tempFilePath: string;
  duration?: number;
  fileSize?: number;
}

type TouchBarText = "按住说话" | "抬起发送" | "抬起取消";
type ModalText = "正在录音" | "继续上滑可取消" | "松开手指 取消发送";

const emits = defineEmits(["switchAudio"]);
const props = withDefaults(defineProps<IProps>(), {
  isEnableAudio: false,
});

let recordTime: number = 0;
let isManualCancelBySlide = false;
let recordTimer: number | undefined;
let firstTouchPageY: number = -1;
let isFingerTouchingScreen = false;
let isFirstAuthrizedRecord = false;
const recorderManager = TUIGlobal?.getRecorderManager();

const isRecording = ref(false);
const touchBarText = ref<TouchBarText>("按住说话");
const modalText = ref<ModalText>("正在录音");
const isAudioTouchBarShow = ref<boolean>(false);
const currentConversation = ref<IConversationModel>();

const recordConfig = {
  // 录音的时长，单位 ms，最大值 600000（10 分钟）
  duration: 60000,
  // 采样率
  sampleRate: 44100,
  // 录音通道数
  numberOfChannels: 1,
  // 编码码率
  encodeBitRate: 192000,
  // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
  format: "mp3",
};

function switchAudio() {
  emits("switchAudio", !props.isEnableAudio);
}

onMounted(() => {
  // 为声音录制管理器注册事件
  recorderManager.onStart(onRecorderStart);
  recorderManager.onStop(onRecorderStop);
  recorderManager.onError(onRecorderError);

  TUIStore.watch(StoreName.CONV, {
    currentConversation: onCurrentConverstaionUpdated
  });
});

onUnmounted(() => {
  TUIStore.unwatch(StoreName.CONV, {
    currentConversation: onCurrentConverstaionUpdated
  });
});

function onCurrentConverstaionUpdated(conversation: IConversationModel) {
  currentConversation.value = conversation;
}

function initRecorder() {
  initRecorderData();
  initRecorderView();
}

function initRecorderView() {
  isRecording.value = false;
  touchBarText.value = "按住说话";
  modalText.value = "正在录音";
}

function initRecorderData(options?: { hasError: boolean }) {
  clearInterval(recordTimer);
  recordTimer = undefined;
  recordTime = 0;
  firstTouchPageY = -1;
  isManualCancelBySlide = false;
  if (!options?.hasError) {
    recorderManager.stop();
  }
}

function handleTouchStart() {
  if (isFingerTouchingScreen) {
    // 兼容 APP 首次由于用户授权产生的录音需要忽略
    isFirstAuthrizedRecord = true;
  }
}

function handleLongPress() {
  isFingerTouchingScreen = true;
  recorderManager.start(recordConfig);
}

const handleTouchMove = throttle(function (e) {
  if (isRecording.value) {
    const pageY = e.changedTouches[e.changedTouches.length - 1].pageY;
    if (firstTouchPageY < 0) {
      firstTouchPageY = pageY;
    }
    const offset = (firstTouchPageY as number) - pageY;
    // 录音时的手势上划移动距离对应文案变化
    if (offset > 150) {
      touchBarText.value = "抬起取消";
      modalText.value = "松开手指 取消发送";
      isManualCancelBySlide = true;
    } else if (offset > 50) {
      touchBarText.value = "抬起发送";
      modalText.value = "继续上滑可取消";
      isManualCancelBySlide = false;
    } else {
      touchBarText.value = "抬起发送";
      modalText.value = "正在录音";
      isManualCancelBySlide = false;
    }
  }
}, 100);

// 手指离开页面滑动
function handleTouchEnd() {
  isFingerTouchingScreen = false;
  recorderManager.stop();
}

function onRecorderStart() {
  if (!isFingerTouchingScreen) {
    // 如果开始录音但手指离开屏幕 说明是首次授权弹窗打断了录音 需要忽略
    isFirstAuthrizedRecord = true;
    recorderManager.stop();
    return;
  }
  recordTimer = setInterval(() => {
    recordTime += 1;
  }, 1000);
  touchBarText.value = "抬起发送";
  isRecording.value = true;
}

function onRecorderStop(res: RecordResult) {
  if (isFirstAuthrizedRecord) {
    // 兼容微信首次由于用户授权产生的录音需要忽略 对 APP 无效
    isFirstAuthrizedRecord = false;
    initRecorder();
    return;
  }
  if (isManualCancelBySlide || !isRecording.value) {
    initRecorder();
    return;
  };
  clearInterval(recordTimer);
  /**
   * 兼容 uniapp 打包 app
   * 兼容 uniapp 语音消息没有 duration
   * duration 和 fileSize 需要用户自己补充
   * 文件大小 = (音频码率) * 时间长度(单位:秒) / 8
   * res.tempFilePath 存储录音文件的临时路径
   */
  let tempFilePath = res.tempFilePath;
  let duration = res.duration ? res.duration : recordTime * 1000;
  let fileSize = res.fileSize ? res.fileSize : ((48 * recordTime) / 8) * 1024;

  if (duration < 1000) {
    Toast({
      message: "录音时间太短",
      type: TOAST_TYPE.NORMAL,
      duration: 1500,
    });
  } else {
    const options = {
      to:
        currentConversation?.value?.groupProfile?.groupID ||
        currentConversation?.value?.userProfile?.userID,
      conversationType: currentConversation?.value?.type,
      payload: { file: { duration, tempFilePath, fileSize } },
      needReadReceipt: isEnabledMessageReadReceiptGlobal(),
    } as SendMessageParams;
    TUIChatService?.sendAudioMessage(options);
  }
  initRecorder();
}

function onRecorderError(errorObject: { errMsg: string }) {
  initRecorderData({ hasError: true });
  initRecorderView();
}
</script>

<style lang="scss" scoped>
@import url("../../../assets/styles/common.scss");

.message-input-audio {
  display: flex;
  flex-direction: row;

  .audio-message-icon {
    width: 23px;
    height: 23px;
    justify-items: center;
    padding: 7px 7px 7px 0px;
  }

  .audio-contain {
    display: flex;
    justify-content: center;
    font-size: 32rpx;
    font-family: PingFangSC-Regular;
  }

  .TUI-message-input-main {
    flex: 1;
    border-radius: 9.4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;

    .record-modal {
      height: 300rpx;
      width: 60vw;
      background-color: rgba(0, 0, 0, 0.8);
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      overflow: hidden;


      .red-mask {
        position: absolute;
        inset: 0;
        background-color: rgba(#ff3e48, 0.5);
        opacity: 0;
        transition: opacity 10ms linear;
        z-index: 1;
      }

      .moving-slider {
        margin: 10vw;
        width: 40rpx;
        height: 16rpx;
        border-radius: 4rpx;
        background-color: #006fff;
        animation: loading 1s ease-in-out infinite alternate;
        z-index: 2;
      }

      .float-element {
        position: relative;
        z-index: 2;
      }
    }

    @keyframes loading {
      0% {
        transform: translate(0, 0);
      }

      100% {
        transform: translate(30vw, 0);
        background-color: #f5634a;
        width: 40px;
      }
    }

    .modal-title {
      text-align: center;
      color: #fff;
    }
  }

  &-open {
    flex: 1;
  }
}
</style>
