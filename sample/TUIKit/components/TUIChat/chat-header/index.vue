<template></template>
<script setup lang="ts">
import {
  TUIStore,
  StoreName,
  IConversationModel,
  TUITranslateService,
} from "@tencentcloud/chat-uikit-engine";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "../../../adapter-vue";
import { TUIGlobal } from "../../../utils/universal-api/index";

const currentConversation = ref<IConversationModel>();
const typingStatus = ref(false);

const setChatHeaderContent = (content: string) => {
  TUIGlobal?.setNavigationBarTitle({
    title: content || '云通信 IM',
  });
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
