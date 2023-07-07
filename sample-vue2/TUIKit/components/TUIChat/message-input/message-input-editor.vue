<template>
  <div
    :class="['message-input-container', !isPC && 'message-input-container-h5']"
  >
    <div class="message-input-mute" v-if="props.isMuted">
      {{ props.muteText }}
    </div>
    <input
      :adjust-position="true"
      v-model="inputText"
      cursor-spacing="20"
      confirm-type="send"
      :confirm-hold="true"
      maxlength="140"
      type="text"
      placeholder-class="input-placeholder"
      id="editor"
      class="message-input-area"
      :placeholder="props.placeholder"
      auto-blur
      @confirm="handleSendMessage"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
      ref="inputRef"
    />
  </div>
</template>
<script lang="ts" setup>
import { TUIGlobal } from "@tencentcloud/chat-uikit-engine";
import {
  defineProps,
  defineEmits,
  ref,
  defineExpose,
  nextTick,
  watch,
} from "../../../adapter-vue";
import { ISendMessagePayload } from "../../../interface";

const props = defineProps({
  placeholder: {
    type: String,
    default: "this is placeholder",
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
const emits = defineEmits(["sendMessage", "onTyping", "onFocus", "onAt"]);
const isPC = ref(TUIGlobal.getPlatform() === "pc");
const inputText = ref("");
const inputRef = ref();
const inputBlur = ref(true);
const inputContentEmpty = ref(true);
const allInsertedAtInfo = new Map();

const handleSendMessage = () => {
  emits("sendMessage");
};

const addEmoji = (emoji: any) => {
  nextTick(() => {
    inputText.value += emoji?.name;
  });
};

const insertAt = (atInfo: any) => {
  if (!allInsertedAtInfo?.has(atInfo?.id)) {
    allInsertedAtInfo?.set(atInfo?.id, atInfo?.label);
  }
  inputText.value += atInfo?.label;
};

const getEditorContent = () => {
  const text = inputText.value;
  const atUserList: Array<string> = [];
  allInsertedAtInfo?.forEach((value: string, key: string) => {
    if (text?.includes("@" + value)) {
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
      type: "text",
      payload,
    },
  ];
};

const resetEditor = () => {
  inputText.value = "";
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
  emits("onFocus", e?.detail?.height);
};

const isEditorContentEmpty = () => {
  inputContentEmpty.value = inputText?.value?.length ? false : true;
};

const onInput = (e: any) => {
  // uniapp 识别 @ 消息
  const text = e?.detail?.value;
  isEditorContentEmpty();
  if (text.endsWith("@") || text.endsWith("@\n")) {
    uni.hideKeyboard();
    emits("onAt", true);
  }
};

watch(
  () => [inputContentEmpty.value, inputBlur.value],
  (newVal: any, oldVal: any) => {
    if (newVal !== oldVal) {
      emits("onTyping", inputContentEmpty.value, inputBlur.value);
    }
  },
  {
    immediate: true,
    deep: true,
  }
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
@import url("../../../assets/styles/common.scss");
.message-input {
  &-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: calc(100% - 13px);
    width: calc(100% - 20px);
    padding: 3px 10px 10px 10px;
    overflow: hidden;
  }
  &-area {
    flex: 1;
    display: flex;
    overflow-y: scroll;
    height: fit-content;
    min-height: 20px;
  }
  &-mute {
    flex: 1;
    display: flex;
    color: #999999;
    font-size: 14px;
    justify-content: center;
    align-items: center;
  }
}
.message-input-container-h5 {
  flex: 1;
  height: auto;
  background: #ffffff;
  border-radius: 9.4px;
  padding: 8px 0px 8px 10px;
  font-size: 16px !important;
  max-height: 86px;
}
.ql-container {
  ::v-deep .ql-blank:before {
    font-style: initial;
  }
}
</style>
