<template>
  <div :class="['message-input', !isPC && 'message-input-h5']">
    <div class="flex-row">
      <MessageInputAudio
        v-if="isWeChat || isApp"
        :class="{
          'message-input-audio': true,
          'message-input-wx-audio': isWeChat,
          'message-input-wx-audio-open': isFunctionShow('audio'),
        }"
        :is-enable-audio="isFunctionShow('audio')"
        @switchAudio="switchAudio"
      />
      <MessageInputEditor
        v-show="!isFunctionShow('audio')"
        ref="editor"
        class="message-input-editor"
        :placeholder="props.placeholder"
        :isMuted="props.isMuted"
        :muteText="props.muteText"
        :enableInput="props.enableInput"
        :enableAt="props.enableAt"
        :enableTyping="props.enableTyping"
        :isGroup="isGroup"
        @sendMessage="sendMessage"
        @onTyping="onTyping"
        @onAt="onAt"
        @onFocus="onFocus"
      />
      <MessageInputAt
        v-if="props.enableAt"
        ref="messageInputAtRef"
        @insertAt="insertAt"
        @onAtListOpen="onAtListOpen"
      />
      <div
        class="message-input-emoji"
        @click="switchEmojiAndFeature('emoji')"
      >
        <Icon
          :file="faceIcon"
          class="icon icon-face"
        />
      </div>
      <div
        class="message-input-more"
        @click="switchEmojiAndFeature('more')"
      >
        <Icon
          :file="moreIcon"
          class="icon icon-more"
        />
      </div>
    </div>
    <div>
      <MessageQuote
        :style="{minWidth: 0}"
        :currentFunction="currentFunction"
      />
      <div
        v-show="isFunctionShow('emoji')"
        class="message-input-emoji-picker"
      >
        <EmojiPickerDialog
          @insertEmoji="insertEmoji"
          @sendMessage="sendMessage"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TUIChatEngine, {
  TUIStore,
  StoreName,
  IMessageModel,
  IConversationModel,
} from '@tencentcloud/chat-uikit-engine';
import { ref, nextTick, onMounted, onUnmounted } from '../../../adapter-vue';
import MessageInputEditor from './message-input-editor.vue';
import MessageInputAt from './message-input-at/index.vue';
import MessageInputAudio from './message-input-audio.vue';
import EmojiPickerDialog from '../message-input-toolbar/emoji-picker/emoji-picker-dialog.vue';
import MessageQuote from './message-input-quote/index.vue';
import Icon from '../../common/Icon.vue';
import faceIcon from '../../../assets/icon/face-uni.png';
import moreIcon from '../../../assets/icon/more-uni.png';
import { isPC, isH5, isWeChat, isApp } from '../../../utils/env';
import { sendMessages, sendTyping } from '../utils/sendMessage';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'this is placeholder',
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
    default: '',
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
  'sendMessage',
  'resetReplyOrReference',
  'onTyping',
  'handleToolbarListShow',
]);
const editor = ref();
const messageInputAtRef = ref();
const currentConversation = ref<IConversationModel>();
const currentFunction = ref<string>('');
const isGroup = ref<boolean>(false);

onMounted(() => {
  TUIStore.watch(StoreName.CONV, {
    currentConversation: onCurrentConversationUpdated,
  });

  TUIStore.watch(StoreName.CHAT, {
    quoteMessage: onQuoteMessageUpdated,
  });
});

onUnmounted(() => {
  TUIStore.unwatch(StoreName.CONV, {
    currentConversation: onCurrentConversationUpdated,
  });

  TUIStore.unwatch(StoreName.CHAT, {
    quoteMessage: onQuoteMessageUpdated,
  });
});

const switchAudio = (isAudioShow: boolean) => {
  if (isAudioShow) {
    switchEmojiAndFeature('audio');
  } else {
    switchEmojiAndFeature('');
  }
};

const switchEmojiAndFeature = (funcName: string) => {
  if (currentFunction.value === 'emoji') {
    if (funcName === 'emoji') {
      currentFunction.value = '';
    } else {
      currentFunction.value = funcName;
    }
    if (funcName === 'more') {
      nextTick(() => {
        emit('handleToolbarListShow');
      });
    }
  } else if (currentFunction.value === 'more') {
    emit('handleToolbarListShow');
    if (funcName === 'more') {
      currentFunction.value = '';
    } else {
      nextTick(() => {
        currentFunction.value = funcName;
      });
    }
  } else {
    currentFunction.value = funcName;
    if (funcName === 'more') {
      emit('handleToolbarListShow');
    }
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

const onFocus = () => {
  if (isH5) {
    switchEmojiAndFeature('');
  }
};

const sendMessage = async () => {
  let messageList;
  if (editor?.value?.getEditorContent) {
    messageList = editor?.value?.getEditorContent();
  }
  editor?.value?.resetEditor && editor?.value?.resetEditor();
  await sendMessages(messageList, currentConversation.value!);
  emit('sendMessage');
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
  editor?.value?.setEditorContent(content);
};

function onCurrentConversationUpdated(conversation: IConversationModel) {
  currentConversation.value = conversation;
  isGroup.value = currentConversation.value?.type === TUIChatEngine.TYPES.CONV_GROUP;
}

function onQuoteMessageUpdated(options?: { message: IMessageModel; type: string }) {
  // 当有引用消息时切换为文字输入模式
  // switch text input mode when there is a quote message
  if (options?.message && options?.type === 'quote') {
    switchAudio(false);
  }
}

defineExpose({
  insertEmoji,
  reEdit,
});
</script>

<style scoped lang="scss">
@import "../../../assets/styles/common";

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
      margin: 7px 0;
    }
  }

  &-wx {
    &-audio {
      &-open {
        flex: 1;
      }
    }
  }

  &-emoji-picker {
    padding-top: 10px;
  }
}

.message-input-h5 {
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  max-height: 100%;
  max-width: calc(100% - 20px);
  padding: 10px;
  overflow: hidden;
}

.flex-row {
  display: flex;
  flex-direction: row;
}
</style>
