<template>
  <view style="display: none;" />
</template>

<script setup lang="ts">
import {
  TUIStore,
  StoreName,
  IConversationModel,
  TUITranslateService,
} from '@tencentcloud/chat-uikit-engine';
import { TUIGlobal } from '@tencentcloud/universal-api';
import { onLoad } from '@dcloudio/uni-app';
import { onMounted, onUnmounted, ref } from '../../../adapter-vue';

const currentConversation = ref<IConversationModel>();
const typingStatus = ref(false);

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
