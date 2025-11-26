<template>
  <div
    :ref="convHeaderRef"
    class="tui-conversation-header"
  >
    <Navigation :title="TUITranslateService.t('TUIChat.腾讯云 IM')">
      <template
        #right
      >
        <div v-show="!isGlobalSearching" class="menu-container">
          <ul
            v-if="menuList.length > 0"
            class="list"
          >
            <li
              v-for="(item, index) in menuList"
              :key="index"
              class="list-item"
            >
              <main
                class="list-item-item"
                @click.stop="handleMenu(item)"
              >
                <Icon
                  v-if="item.icon"
                  class="list-item-icon"
                  :file="item.icon"
                />
              </main>
            </li>
          </ul>
          <ul
            v-if="showChildren.length > 0"
            class="menu-container-children list"
          >
            <li
              v-for="(childrenItem, childrenIndex) in showChildren"
              :key="childrenIndex"
              class="list-item"
              @click="handleMenu(childrenItem)"
            >
              <Icon
                v-if="childrenItem.icon"
                class="list-item-icon"
                :file="childrenItem.icon"
              />
              <h1 class="list-item-title">
                {{ childrenItem.text }}
              </h1>
            </li>
          </ul>
        </div>
      </template>
    </Navigation>
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { StoreName, TUIStore, TUITranslateService } from '@tencentcloud/chat-uikit-engine-lite';
import { computed, ref, onMounted, onUnmounted } from '../../../adapter-vue';
import Icon from '../../common/Icon.vue';
import Navigation from '../../common/Navigation/index.vue';
import Server, { IMenuItem } from './server';
import type { ISearchingStatus } from '../../TUISearch/type';

const showChildren = ref<IMenuItem[]>([]);
const convHeaderRef = ref<HTMLElement | undefined>();
const isGlobalSearching = ref(false);

const menuList = computed(() => {
  return Server.getInstance().getMenu();
});

const onCurrentSearchingStatusChange = (data: ISearchingStatus) => {
  isGlobalSearching.value = data.searchType === 'global' && data.isSearching;
  if (isGlobalSearching.value) {
    closeChildren();
  }
};

onMounted(() => {
  showChildren.value = [];
  TUIStore.watch(StoreName.SEARCH, {
    currentSearchingStatus: onCurrentSearchingStatusChange,
  });
});

onUnmounted(() => {
  TUIStore.unwatch(StoreName.SEARCH, {
    currentSearchingStatus: onCurrentSearchingStatusChange,
  });
});

const handleMenu = (item: IMenuItem) => {
  const { data: { children }, listener = { onClicked: () => {} } } = item;
  if (children) {
    showChildren.value = showChildren.value.length > 0 ? [] : children;
  } else {
    listener.onClicked(item);
    closeChildren();
  }
};

const closeChildren = () => {
  showChildren.value = [];
};

defineExpose({
  closeChildren,
});

</script>
<style lang="scss" scoped>
.menu-container {
  position: relative;
}
</style>

<style lang="scss" scoped src="../style/index.scss"></style>
