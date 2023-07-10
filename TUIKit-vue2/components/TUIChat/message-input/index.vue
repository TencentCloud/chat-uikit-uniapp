<template>
  <div :class="['message-input', !isPC && 'message-input-h5']">
    <MessageInputAudio
      v-if="isAudioEnable"
      :class="[
        'message-input-audio',
        isWeChat && 'message-input-wx-audio',
        isFunctionShow('audio') && 'message-input-wx-audio-open',
      ]"
      @switchAudio="switchAudio"
      :isAudioMainShow="isFunctionShow('audio')"
    ></MessageInputAudio>
    <MessageInputEditor
      v-show="!isFunctionShow('audio')"
      class="message-input-editor"
      ref="editor"
      :placeholder="props.placeholder"
      :isMuted="props.isMuted"
      :muteText="props.muteText"
      :enableInput="props.enableInput"
      :enableAt="props.enableAt"
      :enableTyping="props.enableTyping"
      @sendMessage="sendMessage"
      @onTyping="onTyping"
      @onAt="onAt"
      @onFocus="onFocus"
    ></MessageInputEditor>
    <MessageInputAt
      v-if="props.enableAt"
      ref="messageInputAtRef"
      @insertAt="insertAt"
      @onAtListOpen="onAtListOpen"
    ></MessageInputAt>
    <div class="message-input-emoji" @click="switchEmojiAndFeature('emoji')">
      <Icon :file="faceIcon" class="icon icon-face"></Icon>
    </div>
    <div class="message-input-more" @click="switchEmojiAndFeature('more')">
      <Icon :file="moreIcon" class="icon icon-more"></Icon>
    </div>
    <div class="message-input-emoji-picker" v-if="isFunctionShow('emoji')">
      <EmojiPickerDialog
        @insertEmoji="insertEmoji"
        @sendMessage="sendMessage"
      ></EmojiPickerDialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  TUIGlobal,
  TUIStore,
  StoreName,
} from "@tencentcloud/chat-uikit-engine";
import {
  defineProps,
  defineEmits,
  ref,
  defineExpose,
  watch,
} from "../../../adapter-vue";
import MessageInputEditor from "./message-input-editor.vue";
import MessageInputAt from "./message-input-at/index.vue";
import MessageInputAudio from "./message-input-audio.vue";
import EmojiPickerDialog from "../message-input-toolbar/emoji-picker/emoji-picker-dialog.vue";
import Icon from "../../common/Icon.vue";
import faceIcon from "../../../assets/icon/face-uni.png";
import moreIcon from "../../../assets/icon/more-uni.png";

import { sendMessages, sendTyping } from "../utils/sendMessage";

const props = defineProps({
  placeholder: {
    type: String,
    default: "this is placeholder",
  },
  replyOrReference: {
    type: Object,
    default: () => ({}),
    required: false,
  },
  isMuted: {
    type: Boolean,
    default: true,
  },
  muteText: {
    type: String,
    default: "",
  },
  enableInput: {
    type: Boolean,
    default: true,
  },
  enableAt: {
    type: Boolean,
    default: true,
  },
  enableTyping: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "sendMessage",
  "resetReplyOrReference",
  "onTyping",
  "handleToolbarListShow",
]);
const replyOrReference = ref();
const editor = ref();
const messageInputAtRef = ref();
const currentConversation = ref<IConversationModel>();
const isPC = ref(TUIGlobal.getPlatform() === "pc");
const isH5 = ref(TUIGlobal.getPlatform() === "h5");
const isWeChat = ref(TUIGlobal.getPlatform() === "wechat");
const isApp = ref(TUIGlobal.getPlatform() === "app");
const isAudioEnable = ref(isWeChat.value || isApp.value);
const isAudioMainShow = ref<boolean>(false);
const currentFunction = ref<string>("");

TUIStore.watch(StoreName.CONV, {
  currentConversation: (conversation: IConversationModel) => {
    currentConversation.value = conversation;
  },
});

const switchAudio = (isAudioShow: boolean) => {
  if (isAudioShow) {
    switchEmojiAndFeature("audio");
  } else {
    switchEmojiAndFeature("");
  }
};

const switchEmojiAndFeature = (funcName: string) => {
  currentFunction.value = funcName;
  if (currentFunction.value === "more") {
    emit("handleToolbarListShow", true);
  } else {
    emit("handleToolbarListShow", false);
  }
};

const isFunctionShow = (funcName: string) => {
  if (currentFunction.value === funcName) {
    return true;
  }
  return false;
};

const onTyping = (inputContentEmpty: boolean, inputBlur: boolean) => {
  sendTyping(inputContentEmpty, inputBlur);
};

const onAt = (show: boolean) => {
  messageInputAtRef?.value?.toggleAtList(show);
};

const onFocus = (keyboardHeight?: number) => {
  if(isH5.value){
    switchEmojiAndFeature("");
  }
};

const resetReplyOrReference = () => {
  console.warn("resetReplyOrReference");
};

const sendMessage = async () => {
  let messageList;
  if(editor?.value?.getEditorContent){
    messageList = editor?.value?.getEditorContent();
  }
  editor?.value?.resetEditor && editor?.value?.resetEditor();
  resetReplyOrReference();
  await sendMessages(
    messageList,
    currentConversation.value,
    replyOrReference.value
  );
  emit("sendMessage");
};

const insertEmoji = (emoji: any) => {
  editor?.value?.addEmoji && editor?.value?.addEmoji(emoji);
};

const insertAt = (atInfo: any) => {
  editor?.value?.insertAt && editor?.value?.insertAt(atInfo);
};

const onAtListOpen = () => {
  editor?.value?.blur && editor?.value?.blur();
};

// 消息撤回后重新编辑
const reEdit = (content: any) => {
  editor?.value?.resetEditor();
  resetReplyOrReference();
  editor?.value?.setEditorContent(content);
};

defineExpose({
  insertEmoji,
  reEdit,
});
</script>

<style scoped lang="scss">
@import url("../../../assets/styles/common.scss");
.message-input {
  position: relative;
  display: flex;
  flex-direction: column;
  border: none;
  height: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  background: #ebf0f6;
  &-editor {
    flex: 1;
    display: flex;
  }
  &-button {
    width: fit-content;
  }
  .icon {
    width: 23px;
    height: 23px;
    &-face {
      margin: 7px;
    }
    &-more {
      margin: 7px 0px;
    }
  }
  &-wx {
    &-audio {
      &-open {
        flex: 1;
      }
    }
  }
  &-emoji-picker{
    padding-top: 10px;
  }
}
.message-input-h5 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  max-height: 100%;
  max-width: calc(100% - 20px);
  padding: 10px;
  overflow: hidden;
}
</style>
