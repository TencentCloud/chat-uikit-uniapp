<template>
  <div
    :class="{
      'message-input-container': true,
      'message-input-container-h5': !isPC,
    }"
  >
    <div
      v-if="props.isMuted"
      class="message-input-mute"
    >
      {{ props.muteText }}
    </div>
    <!-- #ifdef APP-PLUS -->
    <div
      v-if="inputToolbarDisplayType === 'emojiPicker' || inputToolbarDisplayType === 'tools'"
      class="input-click-mask"
      @tap.stop.prevent="handleMaskClick"
    >
    </div>
    <!-- #endif -->
    <input
      id="editor"
      ref="inputRef"
      v-model="inputText"
      :adjust-position="true"
      cursor-spacing="20"
      confirm-type="send"
      :confirm-hold="true"
	    :focus="programmaticFocus"
      maxlength="140"
      type="text"
      placeholder-class="input-placeholder"
      class="message-input-area"
      :placeholder="props.placeholder"
      auto-blur
      @confirm="handleSendMessage"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    >
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from '../../../adapter-vue';
import { TUIStore, StoreName, IConversationModel, IMessageModel } from '@tencentcloud/chat-uikit-engine-lite';
import { TUIGlobal } from '@tencentcloud/universal-api';
import DraftManager from '../utils/conversationDraft';
import { transformTextWithEmojiNamesToKeys } from '../emoji-config';
import { isPC } from '../../../utils/env';
import { sendMessages } from '../utils/sendMessage';
import { ISendMessagePayload, ToolbarDisplayType } from '../../../interface';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'this is placeholder',
  },
  replayOrReferenceMessage: {
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
  isGroup: {
    type: Boolean,
    default: false,
  },
  inputToolbarDisplayType: {
	  type: String,
	  defult: '',
  }
});

const emits = defineEmits(['onTyping', 'onFocus', 'onAt']);
const inputText = ref('');
const inputRef = ref();
const inputBlur = ref(true);
const programmaticFocus = ref(false);
const inputContentEmpty = ref(true);
const allInsertedAtInfo = new Map();
const currentConversation = ref<IConversationModel>();
const currentConversationID = ref<string>('');
const currentQuoteMessage = ref<{ message: IMessageModel; type: string }>();

onMounted(() => {
  TUIStore.watch(StoreName.CONV, {
    currentConversation: onCurrentConversationUpdated,
  });

  TUIStore.watch(StoreName.CHAT, {
    quoteMessage: onQuoteMessageUpdated,
  });

  uni.$on('insert-emoji', (data) => {
    inputText.value += data?.emoji?.name;
  });

  uni.$on('send-message-in-emoji-picker', () => {
    handleSendMessage();
  });
});

onUnmounted(() => {
  if (currentConversationID.value) {
    DraftManager.setStore(currentConversationID.value, inputText.value, inputText.value, currentQuoteMessage.value);
  }

  uni.$off('insertEmoji');
  uni.$off('send-message-in-emoji-picker');

  TUIStore.unwatch(StoreName.CONV, {
    currentConversation: onCurrentConversationUpdated,
  });

  TUIStore.unwatch(StoreName.CHAT, {
    quoteMessage: onQuoteMessageUpdated,
  });

  reset();
});

const handleSendMessage = () => {
  const messageList = getEditorContent();
  resetEditor();
  sendMessages(messageList as any, currentConversation.value!);
};

const insertAt = (atInfo: any) => {
  if (!allInsertedAtInfo?.has(atInfo?.id)) {
    allInsertedAtInfo?.set(atInfo?.id, atInfo?.label);
  }
  inputText.value += atInfo?.label;
};

const getEditorContent = () => {
  let text = inputText.value;
  text = transformTextWithEmojiNamesToKeys(text);
  const atUserList: string[] = [];
  allInsertedAtInfo?.forEach((value: string, key: string) => {
    if (text?.includes('@' + value)) {
      atUserList.push(key);
    }
  });
  const payload: ISendMessagePayload = {
    text,
  };
  if (atUserList?.length) {
    payload.atUserList = atUserList;
  }
  return [
    {
      type: 'text',
      payload,
    },
  ];
};

const resetEditor = () => {
  inputText.value = '';
  inputContentEmpty.value = true;
  allInsertedAtInfo?.clear();
};

const setEditorContent = (content: any) => {
  inputText.value = content;
};

const onBlur = () => {
  inputBlur.value = true;
  programmaticFocus.value = false;
};

const onFocus = (e: any) => {
  inputBlur.value = false;
  emits('onFocus', e?.detail?.height);
  uni.$emit('scroll-to-bottom');
};

const isEditorContentEmpty = () => {
  inputContentEmpty.value = inputText?.value?.length ? false : true;
};

const onInput = (e: any) => {
  // uni-app recognizes mention messages
  const text = e?.detail?.value;
  isEditorContentEmpty();
  if (props.isGroup && (text.endsWith('@') || text.endsWith('@\n'))) {
    TUIGlobal?.hideKeyboard();
    emits('onAt', true);
  }
};

watch(
  () => [inputContentEmpty.value, inputBlur.value],
  (newVal: any, oldVal: any) => {
    if (newVal !== oldVal) {
      emits('onTyping', inputContentEmpty.value, inputBlur.value);
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

function onCurrentConversationUpdated(conversation: IConversationModel) {
  const prevConversationID = currentConversationID.value;
  currentConversation.value = conversation;
  currentConversationID.value = conversation?.conversationID;
  if (prevConversationID !== currentConversationID.value) {
    if (prevConversationID) {
      DraftManager.setStore(
        prevConversationID,
        inputText.value,
        inputText.value,
        currentQuoteMessage.value,
      );
    }
    resetEditor();
    if (currentConversationID.value) {
      DraftManager.getStore(currentConversationID.value, setEditorContent);
    }
  }
}

function onQuoteMessageUpdated(options?: { message: IMessageModel; type: string }) {
  currentQuoteMessage.value = options;
}

function reset() {
  inputBlur.value = true;
  currentConversation.value = null;
  currentConversationID.value = '';
  currentQuoteMessage.value = null;
  resetEditor();
}


function handleMaskClick(e: Event) {
  // #ifdef APP-PLUS
	e.stopPropagation();
	emits('onFocus');
	uni.$emit('scroll-to-bottom');
	setTimeout(() => {
		programmaticFocus.value = true;
    // IOS set 500ms timeout
	}, 100);
  // #endif
}
defineExpose({
  insertAt,
  resetEditor,
  setEditorContent,
  getEditorContent,
});
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/common";

.message-input-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 3px 10px 10px;
  overflow: hidden;
  position: relative;

  &-h5 {
    flex: 1;
    height: auto;
    background: #fff;
    border-radius: 10px;
    padding: 7px 0 7px 10px;
    font-size: 16px !important;
    max-height: 86px;
  }

  .message-input-mute {
    flex: 1;
    display: flex;
    color: #999;
    font-size: 14px;
    justify-content: center;
    align-items: center;
  }

  .message-input-area {
    flex: 1;
    overflow-y: scroll;
    min-height: 25px;
  }
}

.input-click-mask {
	background-color: transparent;
	position: absolute;
	inset: 0;
	z-index: 1;
}
</style>
