<template>
  <div class="chat-header">
    <Navigation :title="title">
      <template #left>
        <div @click="back">
          <Icon
            :file="backSVG"
          />
        </div>
      </template>
      <template #right>
        <div @click="onNavigationBarButtonTap">
          <Icon
            v-if="isGroup"
            :file="More"
          />
        </div>
      </template>
    </Navigation>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from '../../../adapter-vue';
import {
  TUIStore,
  StoreName,
  IConversationModel,
  TUITranslateService,
} from '@tencentcloud/chat-uikit-engine-lite';
import { onLoad } from '@dcloudio/uni-app';
import Navigation from '../../common/Navigation/index.vue';
import Icon from '../../common/Icon.vue';
import More from '../../../assets/icon/more.svg';
import backSVG from '../../../assets/icon/back.svg';

const emits = defineEmits(['openGroupManagement']);
const props = defineProps(['isGroup']);

const currentConversation = ref<IConversationModel>();
const typingStatus = ref(false);
const title = ref('');

const setChatHeaderContent = (content: string) => {
  title.value = content || '云通信 IM';
};

const onNavigationBarButtonTap = () => {
  if (props.isGroup) {
    emits('openGroupManagement');
  }
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

function back() {
  uni.navigateBack();
}
</script>
<style lang="scss" scoped>

</style>
