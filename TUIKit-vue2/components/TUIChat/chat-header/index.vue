<template></template>
<script setup lang="ts">
import {
  TUIGlobal,
  TUIStore,
  StoreName,
  IConversationModel,
  TUITranslateService,
} from "@tencentcloud/chat-uikit-engine";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "../../../adapter-vue";
const currentConversation = ref<IConversationModel>();
const typingStatus = ref(false);

const setChatHeaderContent = (content: string) => {
  if (content) {
    uni.setNavigationBarTitle({
      title: content,
  });
  }
};

TUIStore.watch(StoreName.CONV, {
  currentConversation: (conversation: IConversationModel) => {
    currentConversation.value = conversation;
    if(!typingStatus.value){
      setChatHeaderContent(currentConversation?.value?.getShowName());
    }
  },
});

TUIStore.watch(StoreName.CHAT, {
  typingStatus: (status: boolean) => {
    typingStatus.value = status;
    switch (typingStatus.value) {
      case true:
        setChatHeaderContent(TUITranslateService.t("TUIChat.对方正在输入"));
        break;
      case false:
        setChatHeaderContent(currentConversation?.value?.getShowName());
        break;
    }
  },
});

onLoad((options: any) => {
  setChatHeaderContent(currentConversation?.value?.getShowName());
});
</script>
