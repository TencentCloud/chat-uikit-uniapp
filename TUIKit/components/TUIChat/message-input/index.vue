<template>
  <div :class="['message-input', !isPC && 'message-input-h5']">
    <div class="audio-main-content-line">
      <MessageInputAudio
        v-if="(isWeChat || isApp) && isRenderVoice"
        :class="{
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
      <Icon
        v-if="isRenderEmojiPicker"
        class="icon icon-face"
        :file="faceIcon"
        :size="'23px'"
        :hotAreaSize="'3px'"
        @onClick="changeToolbarDisplayType('emojiPicker')"
      />
      <Icon
        v-if="isRenderMore"
        class="icon icon-more"
        :file="moreIcon"
        :size="'23px'"
        :hotAreaSize="'3px'"
        @onClick="changeToolbarDisplayType('tools')"
      />
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
import TUIChatConfig from '../config';

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
const featureConfig = TUIChatConfig.getFeatureConfig();
const isRenderVoice = ref<boolean>(featureConfig.InputVoice);
const isRenderEmojiPicker = ref<boolean>(featureConfig.InputEmoji || featureConfig.InputStickers);
const isRenderMore = ref<boolean>(featureConfig.InputImage || featureConfig.InputVideo || featureConfig.InputEvaluation || featureConfig.InputQuickReplies);

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

const reEdit = (content: any) => {
  editor?.value?.resetEditor();
  editor?.value?.setEditorContent(content);
};

function onCurrentConversationUpdated(conversation: IConversationModel) {
  currentConversation.value = conversation;
  isGroup.value = currentConversation.value?.type === TUIChatEngine.TYPES.CONV_GROUP;
}

function onQuoteMessageUpdated(options?: { message: IMessageModel; type: string }) {
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

:not(not) {
  display: flex;
  flex-direction: column;
  min-width: 0;
  box-sizing: border-box;
}

.message-input {
  position: relative;
  display: flex;
  flex-direction: column;
  border: none;
  overflow: hidden;
  background: #ebf0f6;

  &-h5 {
    padding: 10px 10px 15px;
  }

  &-editor {
    flex: 1;
    display: flex;
  }

  .icon {
    margin-left: 3px;
  }

  &-wx-audio-open {
    flex: 1;
  }
}

.audio-main-content-line {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
