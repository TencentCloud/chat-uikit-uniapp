<template>
  <div :class="['tui-contact-search', !isPC && 'tui-contact-search-h5']">
    <div
      :class="[
        'tui-contact-search-main',
        !isPC && 'tui-contact-search-h5-main',
      ]"
    >
      <input
        v-model="searchValue"
        class="tui-contact-search-main-input"
        type="text"
        :placeholder="searchingPlaceholder"
        enterkeyhint="search"
        @keyup.enter="search"
        @blur="search"
        @confirm="search"
      >
      <div
        class="tui-contact-search-main-cancel"
        @click="cancel"
      >
        {{ TUITranslateService.t("取消") }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from '../../../adapter-vue';
import {
  TUITranslateService,
  TUIStore,
  StoreName,
} from '@tencentcloud/chat-uikit-engine-lite';
import TUICore, { TUIConstants } from '@tencentcloud/tui-core-lite';
import { TUIGlobal } from '@tencentcloud/universal-api';
import { isPC } from '../../../utils/env';
import { IContactSearchResult } from '../../../interface';

const searchingPlaceholder = TUITranslateService.t('TUIContact.输入ID');
const searchValue = ref<string>('');
const searchResult = ref<IContactSearchResult>({
  user: {
    label: '联系人',
    list: [],
  },
  group: {
    label: '群聊',
    list: [],
  },
});

const cancel = () => {
  TUIStore.update(
    StoreName.CUSTOM,
    'currentContactSearchingStatus',
    false,
  );
};

const search = async () => {
  if (!searchValue.value) {
    return;
  }
  TUICore.callService({
    serviceName: TUIConstants.TUISearch.SERVICE.NAME,
    method: TUIConstants.TUISearch.SERVICE.METHOD.SEARCH_USER,
    params: {
      userID: searchValue.value,
    },
  })
    .then((res: any) => {
      searchResult.value.user.list = res.data;
    })
    .catch((error: any) => {
      searchResult.value.user.list = [];
      console.warn('search user error', error);
    });
  TUICore.callService({
    serviceName: TUIConstants.TUISearch.SERVICE.NAME,
    method: TUIConstants.TUISearch.SERVICE.METHOD.SEARCH_GROUP,
    params: {
      groupID: searchValue.value,
    },
  })
    .then((res: any) => {
      searchResult.value.group.list = [res.data.group];
    })
    .catch((error: any) => {
      searchResult.value.group.list = [];
      console.warn('search group error', error);
    });
};
watch(
  () => searchResult.value,
  () => {
    TUIStore.update(
      StoreName.CUSTOM,
      'currentContactSearchResult',
      searchResult.value,
    );
  },
  {
    deep: true,
    immediate: true,
  },
);

onMounted(() => {
  searchValue.value = '';
  searchResult.value.user.list = [];
  searchResult.value.group.list = [];
});

TUIGlobal.updateContactSearch = search;
TUIGlobal.closeSearching = () => {
  searchValue.value = '';
  searchResult.value.user.list = [];
  searchResult.value.group.list = [];
};
</script>
<style lang="scss" scoped>
.tui-contact-search {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #f4f5f9;
  flex-direction: column;

  &-main {
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &-main {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;

    &-input {
      flex: 1;
      font-size: 14px;
      border-radius: 5px;
      padding: 7px;
      border: 1px solid #ddd;
    }

    &-input:focus {
      outline: none;
      border: 1px solid #006eff;
    }

    &-cancel {
      padding-left: 10px;
      user-select: none;
      cursor: pointer;
    }
  }

  &-h5 {
    &-header {
      width: 100%;
    }
  }
}
</style>
