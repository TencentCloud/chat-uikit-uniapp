<template>
  <div
    class="tui-conversation"
    @click="handleClickConv"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <TUISearch searchType="global" />
    <ConversationHeader
      v-if="isShowConversationHeader"
      ref="headerRef"
    />
    <ConversationNetwork />
    <ConversationList
      ref="conversationListDomRef"
      class="tui-conversation-list"
      @handleSwitchConversation="handleSwitchConversation"
      @getPassingRef="getPassingRef"
    />
  </div>
</template>
<script lang="ts" setup>
import { TUIStore, StoreName } from '@tencentcloud/chat-uikit-engine';
import { TUIGlobal } from '@tencentcloud/universal-api';
import { ref } from '../../adapter-vue';
import TUISearch from '../TUISearch/index.vue';
import ConversationList from './conversation-list/index.vue';
import ConversationHeader from './conversation-header/index.vue';
import ConversationNetwork from './conversation-network/index.vue';
import { onHide } from '@dcloudio/uni-app'; // 该方法只能用在父组件内，子组件内不生效

const emits = defineEmits(['handleSwitchConversation']);

const totalUnreadCount = ref(0);
const headerRef = ref<typeof ConversationHeader>();
const conversationListDomRef = ref<typeof ConversationList>();
const touchX = ref<number>(0);
const touchY = ref<number>(0);
const isShowConversationHeader = ref<boolean>(true);

TUIStore.watch(StoreName.CONV, {
  totalUnreadCount: (count: number) => {
    totalUnreadCount.value = count;
  },
});

TUIStore.watch(StoreName.CUSTOM, {
  isShowConversationHeader: (showStatus: boolean) => {
    isShowConversationHeader.value = showStatus !== false;
  },
});

const handleSwitchConversation = (conversationID: string) => {
  TUIGlobal?.navigateTo({
    url: '/TUIKit/components/TUIChat/index',
  });
  emits('handleSwitchConversation', conversationID);
};

const closeChildren = () => {
  headerRef?.value?.closeChildren();
  conversationListDomRef?.value?.closeChildren();
};

const handleClickConv = () => {
  closeChildren();
};

onHide(closeChildren);

const handleTouchStart = (e: any) => {
  touchX.value = e.changedTouches[0].clientX;
  touchY.value = e.changedTouches[0].clientY;
};

const handleTouchEnd = (e: any) => {
  const x = e.changedTouches[0].clientX;
  const y = e.changedTouches[0].clientY;
  let turn = '';
  if (x - touchX.value > 50 && Math.abs(y - touchY.value) < 50) {
    // 右滑
    turn = 'right';
  } else if (x - touchX.value < -50 && Math.abs(y - touchY.value) < 50) {
    // 左滑
    turn = 'left';
  }
  if (y - touchY.value > 50 && Math.abs(x - touchX.value) < 50) {
    // 下滑
    turn = 'down';
  } else if (y - touchY.value < -50 && Math.abs(x - touchX.value) < 50) {
    // 上滑
    turn = 'up';
  }
  // 根据方向进行操作
  if (turn === 'down' || turn === 'up') {
    closeChildren();
  }
};

const getPassingRef = (ref) => {
  ref.value = conversationListDomRef.value;
};
</script>

<style lang="scss" scoped src="./style/index.scss"></style>
