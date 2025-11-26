<template>
  <div
    v-if="Object.keys(friendListData.map).length > 0"
    class="friend-list"
  >
    <ul
      v-for="(groupData, groupKey) in friendListData.map"
      :key="groupKey"
    >
      <div class="friend-group-title">
        {{ groupKey }} ({{ groupData.length }})
      </div>
      <li
        v-for="contactListItem in groupData"
        :key="contactListItem.renderKey"
        class="friend-item"
        @click="enterConversation(contactListItem)"
      >
        <ContactListItem
          :key="contactListItem.renderKey"
          :item="deepCopy(contactListItem)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { deepCopy } from '../../../TUIChat/utils/utils';
import ContactListItem from '../contact-list-item/index.vue';
import { sortByFirstChar } from '../../utils/sortByFirstChar';
import { onMounted, onUnmounted, ref } from '../../../../adapter-vue';
import { Friend, StoreName, TUIStore } from '@tencentcloud/chat-uikit-engine-lite';
import { FriendListData } from '../../../../interface';

const emits = defineEmits(['enterConversation']);

const friendListData = ref<FriendListData>({
  key: 'friendList',
  title: '我的好友',
  map: {},
});

function onFriendListUpdated(friendList: Friend[]) {
  const { groupedList } = sortByFirstChar(
    friendList,
    (friend: Friend) => friend.remark || friend.profile?.nick || friend.userID || '');
  friendListData.value.map = groupedList;
}

onMounted(() => {
  TUIStore.watch(StoreName.FRIEND, {
    friendList: onFriendListUpdated,
  });
});

onUnmounted(() => {
  TUIStore.unwatch(StoreName.FRIEND, {
    friendList: onFriendListUpdated,
  });
});

const enterConversation = (item: any) => {
  emits('enterConversation', item);
};
</script>

<style scoped lang="scss">
.friend-list {
  ul, li {
    list-style: none;
    padding: 0;
  }
}

.friend-group-title {
  padding: 8px 16px;
  background-color: #f8f9fa;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  line-height: 20px;
}

.friend-item {
  margin: 0 15px;
  padding: 5px 0;
}
</style>
