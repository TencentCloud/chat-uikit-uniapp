<template>
  <SelectFriend v-if="isShowSelectFriend" />
  <div
    v-else-if="isShowContactList"
    :class="['tui-contact', !isPC && 'tui-contact-h5']"
  >
    <Navigation :title="currentContactKey ? contactInfoTitle : TUITranslateService.t('TUIChat.腾讯云 IM')">
      <template #left>
        <div v-show="currentContactKey" @click="resetContactType">
          <Icon
            :file="backSVG"
          />
        </div>
      </template>
      <template #right>
        <div v-show="!isShowContactSearch && !currentContactKey" @click="openContactSearch">
          <Icon
            :file="addCircle"
          />
        </div>
      </template>
    </Navigation>
    <div
      v-if="isShowContactInfo"
      :class="['tui-contact-right', !isPC && 'tui-contact-h5-right']"
    >
      <ContactInfo @switchConversation="switchConversation" />
    </div>
    <div
      v-else
      :class="['tui-contact-left', !isPC && 'tui-contact-h5-left']">
      <ContactSearch
        v-if="isShowContactSearch"
      />
      <ContactList :class="['tui-contact-left-list', !isPC && 'tui-contact-h5-left-list']" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { TUIStore, StoreName, TUITranslateService } from '@tencentcloud/chat-uikit-engine-lite';
import { TUIGlobal } from '@tencentcloud/universal-api';
import { onMounted, onUnmounted, ref, watchEffect } from '../../adapter-vue';
import { isPC, isUniFrameWork } from '../../utils/env';
import Navigation from '../common/Navigation/index.vue';
import Icon from '../common/Icon.vue';

import SelectFriend from './select-friend/index.vue';
import ContactSearch from './contact-search/index.vue';
import ContactList from './contact-list/index.vue';
import ContactInfo from './contact-info/index.vue';

import addCircle from '../../assets/icon/add-circle.svg';
import backSVG from '../../assets/icon/back.svg';
import { CONTACT_INFO_TITLE } from '../../constant';

const emits = defineEmits(['switchConversation']);

const props = defineProps({
  // web/h5 single page application display format, uniapp please ignore
  displayType: {
    type: String,
    default: 'contactList', // "contactList" /  "selectFriend"
    require: false,
  },
});

const displayTypeRef = ref<string>(props.displayType || 'contactList');
const isShowSelectFriend = ref(false);
const isShowContactList = ref(true);
const isShowContactInfo = ref(true);
const isShowContactSearch = ref(false);
const currentContactKey = ref('');
const contactInfoTitle = ref<string>('');

watchEffect(() => {
  isShowContactList.value = props?.displayType !== 'selectFriend';
});

const switchConversation = (data: any) => {
  isUniFrameWork
  && TUIGlobal?.navigateTo({
    url: '/TUIKit/components/TUIChat/index',
  });
  emits('switchConversation', data);
};

const openContactSearch = () => {
  TUIStore.update(
    StoreName.CUSTOM,
    'currentContactSearchingStatus',
    true,
  );
};

const resetContactType = () => {
  TUIStore.update(StoreName.CUSTOM, 'currentContactListKey', '');
};

const onCurrentContactSearchingStatusUpdated = (data: boolean) => {
  isShowContactSearch.value = data;
};

const onIsShowSelectFriendComponentUpdated = (data: any) => {
  if (!isUniFrameWork && props?.displayType === 'selectFriend') {
    isShowSelectFriend.value = data;
    isShowContactList.value = false;
    return;
  }
  if (data) {
    isShowSelectFriend.value = true;
    if (isUniFrameWork) {
      displayTypeRef.value = 'selectFriend';
      TUIGlobal?.hideTabBar();
    }
  } else {
    isShowSelectFriend.value = false;
    if (isUniFrameWork) {
      displayTypeRef.value = props.displayType;
      TUIGlobal?.showTabBar()?.catch(() => { /* ignore */ });
    }
  }
};

const onCurrentContactInfoUpdated = (contactInfo: any) => {
  isShowContactInfo.value = isPC || (contactInfo && typeof contactInfo === 'object' && Object.keys(contactInfo)?.length > 0);
};

const onCurrentContactListKeyUpdated = (key: string) => {
  currentContactKey.value = key;
  contactInfoTitle.value = TUITranslateService.t(`TUIContact.${CONTACT_INFO_TITLE[key]}`);
};

onMounted(() => {
  TUIStore.watch(StoreName.CUSTOM, {
    currentContactSearchingStatus: onCurrentContactSearchingStatusUpdated,
    isShowSelectFriendComponent: onIsShowSelectFriendComponentUpdated,
    currentContactInfo: onCurrentContactInfoUpdated,
    currentContactListKey: onCurrentContactListKeyUpdated,
  });
});

onUnmounted(() => {
  TUIStore.unwatch(StoreName.CUSTOM, {
    currentContactSearchingStatus: onCurrentContactSearchingStatusUpdated,
    isShowSelectFriendComponent: onIsShowSelectFriendComponentUpdated,
    currentContactInfo: onCurrentContactInfoUpdated,
    currentContactListKey: onCurrentContactListKeyUpdated,
  });
});

</script>
<style lang="scss" scoped>
@import "../../assets/styles/common";

.tui-contact {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &-left {
    min-width: 285px;
    flex: 0 0 24%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &-right {
    border-left: 1px solid #f4f5f9;
    flex: 1;
    overflow: hidden;
  }
}

.tui-contact-h5 {
  position: relative;

  &-left,
  &-right {
    width: 100%;
    height: 100%;
    flex: 1;
  }

  &-right {
    position: absolute;
    z-index: 100;
  }

  &-left {
    &-list {
      overflow-y: auto;
    }
  }
}
</style>
