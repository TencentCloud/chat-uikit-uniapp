<template>
  <view style="display: none;" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from '../../../adapter-vue';
import {
  TUIStore,
  StoreName,
  IConversationModel,
  TUITranslateService,
} from '@tencentcloud/chat-uikit-engine';
import { TUIGlobal } from '@tencentcloud/universal-api';
import { onLoad, onNavigationBarButtonTap } from '@dcloudio/uni-app';

const emits = defineEmits(['openGroupManagement']);
const props = defineProps(['isGroup']);

const currentConversation = ref<IConversationModel>();
const typingStatus = ref(false);

// #ifdef APP-PLUS
onNavigationBarButtonTap(() => {
  if (props.isGroup) {
    emits('openGroupManagement');
  }
});

const pages = getCurrentPages();
const currentPage = pages[pages.length - 1];
const currentWebview = currentPage.$getAppWebview();

if (!props.isGroup) {
  // hidden menu button in C2C chat
  // override current webview titleNView
  currentWebview.setStyle({
    titleNView: {
      ...currentWebview.getStyle().titleNView,
      buttons: [],
    },
  });
}
// #endif

const setChatHeaderContent = (content: string) => {
  TUIGlobal?.setNavigationBarTitle({
    title: content || '云通信 IM',
  });
};

onMounted(() => {
  TUIStore.watch(StoreName.CONV, {
    currentConversation: onCurrentConversationUpdated,
  });
  TUIStore.watch(StoreName.CHAT, {
    typingStatus: onTypingStatusUpdated,
  });
});

onUnmounted(() => {
  TUIStore.unwatch(StoreName.CONV, {
    currentConversation: onCurrentConversationUpdated,
  });
  TUIStore.unwatch(StoreName.CHAT, {
    typingStatus: onTypingStatusUpdated,
  });
});

onLoad(() => {
  setChatHeaderContent(currentConversation.value?.getShowName());
});

function onCurrentConversationUpdated(conversation: IConversationModel) {
  currentConversation.value = conversation;
  if (!typingStatus.value) {
    setChatHeaderContent(currentConversation?.value?.getShowName());
  }
}

function onTypingStatusUpdated(status: boolean) {
  typingStatus.value = status;
  if (typingStatus.value) {
    setChatHeaderContent(TUITranslateService.t('TUIChat.对方正在输入'));
  } else {
    setChatHeaderContent(currentConversation.value?.getShowName());
  }
}
</script>
