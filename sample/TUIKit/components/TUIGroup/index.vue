<template>
  <div :class="[(isShowCreateGroup || isShowManageGroup || isShowSelectMember) && 'tui-group']">
    <Navigation
      :title="title"
      customStyle="manage-navigation"
    >
      <template
        #left
      >
        <div v-show="isShowCreateGroup || isShowManageGroup"  @click="back">
          <Icon
            :file="backSVG"
          />
        </div>
      </template>
    </Navigation>
    <CreateGroup
      v-if="isShowCreateGroup"
      ref="createGroupRef"
    />
    <ManageGroup
      v-if="isShowManageGroup"
      ref="manageGroupRef"
      @updateTabName="updateTabName"
    />
    <SelectMember v-if="isShowSelectMember" />
  </div>
</template>
<script lang="ts" setup>
import {
  TUIStore,
  StoreName,
  TUITranslateService,
} from '@tencentcloud/chat-uikit-engine-lite';
import { ref } from '../../adapter-vue';

import Navigation from '../common/Navigation/index.vue';
import Icon from '../common/Icon.vue';
import backSVG from '../../assets/icon/back.svg';
import CreateGroup from './create-group/index.vue';
import ManageGroup from './manage-group/index.vue';
import SelectMember from './select-member/index.vue';

const title = ref('');
const isShowCreateGroup = ref(false);
const isShowManageGroup = ref(false);
const isShowSelectMember = ref(false);
const createGroupRef = ref<any>(null);
const manageGroupRef = ref<any>(null);

TUIStore.watch(StoreName.GRP, {
  isShowCreateComponent: (data: any) => {
    if (data) {
      isShowCreateGroup.value = true;
      title.value = TUITranslateService.t('TUIConversation.发起群聊');
    } else {
      isShowCreateGroup.value = false;
    }
  },
  isShowManageComponent: (data: any) => {
    if (data) {
      isShowManageGroup.value = true;
      title.value = TUITranslateService.t('TUIGroup.群管理');
    } else {
      isShowManageGroup.value = false;
    }
  },
  isShowSelectComponent: (data: any) => {
    if (data) {
      isShowSelectMember.value = true;
    } else {
      isShowSelectMember.value = false;
    }
  },
});

const updateTabName = (tabName: string) => {
  if (isShowManageGroup.value) {
    title.value = TUITranslateService.t(`TUIGroup.${tabName}`);
  }
};

const back = () => {
  if (isShowCreateGroup.value) {
    createGroupRef.value.closeCreated();
  } else if (isShowManageGroup.value) {
    manageGroupRef.value.back();
  }
};

</script>
<style lang="scss" scoped>
.tui-group {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.manage-navigation {
  background: #fff;
  border-bottom: 0.5px solid #e5e5e5;
}
</style>
