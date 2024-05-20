<template>
  <div :class="['message-input', !isPC && 'message-input-h5']">
    <div class="flex-row">
      <MessageInputAudio
        v-if="isWeChat || isApp"
        :class="{
          'message-input-audio': true,
          'message-input-wx-audio': isWeChat,
          'message-input-wx-audio-open': displayType === 'audio',
        }"
        :isEnableAudio="displayType === 'audio'"
        @changeDisplayType="changeDisplayType"
      />
      <MessageInputEditor
        v-show="displayType === 'editor'"
        ref="editor"
        class="message-input-editor"
        :placeholder="props.placeholder"
        :isMuted="props.isMuted"
        :muteText="props.muteText"
        :enableInput="props.enableInput"
        :enableAt="props.enableAt"
        :enableTyping="props.enableTyping"
        :isGroup="isGroup"
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
        @click="changeToolbarDisplayType('emojiPicker')"
      >
        <Icon
          :file="faceIcon"
          class="icon icon-face"
        />
      </div>
      <div
        class="message-input-more"
        @click="changeToolbarDisplayType('tools')"
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
        :displayType="displayType"
      />
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
import { ref, watch, onMounted, onUnmounted } from '../../../adapter-vue';
import MessageInputEditor from './message-input-editor.vue';
import MessageInputAt from './message-input-at/index.vue';
import MessageInputAudio from './message-input-audio.vue';
import MessageQuote from './message-input-quote/index.vue';
import Icon from '../../common/Icon.vue';
import faceIcon from '../../../assets/icon/face-uni.png';
import moreIcon from '../../../assets/icon/more-uni.png';
import { isPC, isH5, isWeChat, isApp } from '../../../utils/env';
import { sendTyping } from '../utils/sendMessage';
import { ToolbarDisplayType, InputDisplayType } from '../../../interface';

interface IProps {
  placeholder: string;
  isMuted?: boolean;
  muteText?: string;
  enableInput?: boolean;
  enableAt?: boolean;
  enableTyping?: boolean;
  replyOrReference?: Record<string, any>;
  inputToolbarDisplayType: ToolbarDisplayType;
}
interface IEmits {
  (e: 'changeToolbarDisplayType', displayType: ToolbarDisplayType): void;
}

const emits = defineEmits<IEmits>();
const props = withDefaults(defineProps<IProps>(), {
  placeholder: 'this is placeholder',
  replyOrReference: () => ({}),
  isMuted: true,
  muteText: '',
  enableInput: true,
  enableAt: true,
  enableTyping: true,
  inputToolbarDisplayType: 'none',
});

const editor = ref();
const messageInputAtRef = ref();
const currentConversation = ref<IConversationModel>();
const isGroup = ref<boolean>(false);
const displayType = ref<InputDisplayType>('editor');

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

watch(() => props.inputToolbarDisplayType, (newVal: ToolbarDisplayType) => {
  if (newVal !== 'none') {
    changeDisplayType('editor');
  }
});

function changeDisplayType(display: InputDisplayType) {
  displayType.value = display;
  if (display === 'audio') {
    emits('changeToolbarDisplayType', 'none');
  }
}

function changeToolbarDisplayType(displayType: ToolbarDisplayType) {
  emits('changeToolbarDisplayType', displayType);
}

const onTyping = (inputContentEmpty: boolean, inputBlur: boolean) => {
  sendTyping(inputContentEmpty, inputBlur);
};

const onAt = (show: boolean) => {
  messageInputAtRef?.value?.toggleAtList(show);
};

const onFocus = () => {
  if (isH5) {
    emits('changeToolbarDisplayType', 'none');
  }
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
    changeDisplayType('editor');
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
