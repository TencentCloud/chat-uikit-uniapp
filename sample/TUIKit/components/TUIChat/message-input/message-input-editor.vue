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
    <input
      id="editor"
      ref="inputRef"
      v-model="inputText"
      :adjust-position="true"
      cursor-spacing="20"
      confirm-type="send"
      :confirm-hold="true"
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
import { ref, nextTick, watch } from '../../../adapter-vue';
import { TUIGlobal } from '@tencentcloud/universal-api';
import { ISendMessagePayload } from '../../../interface';
import { isPC } from '../../../utils/env';
import { transformEmojiValueToKey } from '../utils/emojiList';

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
});
const emits = defineEmits(['sendMessage', 'onTyping', 'onFocus', 'onAt']);
const inputText = ref('');
const inputRef = ref();
const inputBlur = ref(true);
const inputContentEmpty = ref(true);
const allInsertedAtInfo = new Map();
const emojiMap = new Map();

const handleSendMessage = () => {
  emits('sendMessage');
};

const addEmoji = (emojiData: any) => {
  emojiMap.set(emojiData?.emoji.key, emojiData?.emoji.name);
  nextTick(() => {
    inputText.value += emojiData?.emoji?.name;
  });
};

const insertAt = (atInfo: any) => {
  if (!allInsertedAtInfo?.has(atInfo?.id)) {
    allInsertedAtInfo?.set(atInfo?.id, atInfo?.label);
  }
  inputText.value += atInfo?.label;
};

const getEditorContent = () => {
  let text = inputText.value;
  text = transformEmojiValueToKey(text);
  const atUserList: Array<string> = [];
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
};

const onFocus = (e: any) => {
  inputBlur.value = false;
  emits('onFocus', e?.detail?.height);
};

const isEditorContentEmpty = () => {
  inputContentEmpty.value = inputText?.value?.length ? false : true;
};

const onInput = (e: any) => {
  // uniapp 识别 @ 消息
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

defineExpose({
  getEditorContent,
  addEmoji,
  insertAt,
  resetEditor,
  setEditorContent,
});
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/common";

.message-input-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100% - 13px);
  width: calc(100% - 20px);
  padding: 3px 10px 10px;
  overflow: hidden;

  &-h5 {
    flex: 1;
    height: auto;
    background: #fff;
    border-radius: 9.4px;
    padding: 7px 0 7px 10px;
    font-size: 16px !important;
    max-height: 86px;
  }

  .message-input-mute{
    flex: 1;
    display: flex;
    color: #999;
    font-size: 14px;
    justify-content: center;
    align-items: center;
  }

  .message-input-area {
    flex: 1;
    display: flex;
    overflow-y: scroll;
    min-height: 20px;
  }
}
</style>
