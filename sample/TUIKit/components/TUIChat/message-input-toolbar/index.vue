<template>
  <div
    :class="[
      'message-input-toolbar',
      'message-input-toolbar-h5',
      'message-input-toolbar-uni',
    ]"
  >
    <div v-if="props.displayType === 'emojiPicker'">
      <EmojiPickerDialog />
    </div>
    <div v-else>
      <swiper
        :class="['message-input-toolbar-swiper']"
        :indicator-dots="isSwiperIndicatorDotsEnable"
        :autoplay="false"
        :circular="false"
      >
        <swiper-item
          :class="[
            'message-input-toolbar-list',
            'message-input-toolbar-h5-list',
            'message-input-toolbar-uni-list',
          ]"
        >
          <ImageUpload imageSourceType="camera" />
          <ImageUpload imageSourceType="album" />
          <VideoUpload videoSourceType="album" />
          <VideoUpload videoSourceType="camera" />
          <template v-if="currentExtensionList[0]">
            <div
              v-for="(extension, index) in currentExtensionList.slice(0, 4)"
              :key="index"
            >
              <ToolbarItemContainer
                v-if="extension"
                :iconFile="genExtensionIcon(extension)"
                :title="genExtensionText(extension)"
                iconWidth="25px"
                iconHeight="25px"
                :needDialog="false"
                @onIconClick="onExtensionClick(extension)"
              />
            </div>
          </template>
          <Evaluate
            v-if="currentExtensionList.length < 4"
            @onDialogPopupShowOrHide="handleSwiperDotShow"
          />
          <Words
            v-if="currentExtensionList.length < 3"
            @onDialogPopupShowOrHide="handleSwiperDotShow"
          />
        </swiper-item>
        <swiper-item
          v-if="currentExtensionList[2] && currentExtensionList.length >= 3"
          :class="[
            'message-input-toolbar-list',
            'message-input-toolbar-h5-list',
            'message-input-toolbar-uni-list',
          ]"
        >
          <div
            v-for="(extension, index) in currentExtensionList.slice(4)"
            :key="index"
          >
            <ToolbarItemContainer
              v-if="extension"
              :iconFile="genExtensionIcon(extension)"
              :title="genExtensionText(extension)"
              iconWidth="25px"
              iconHeight="25px"
              :needDialog="false"
              @onIconClick="onExtensionClick(extension)"
            />
          </div>
          <Evaluate
            v-if="currentExtensionList.length >= 4"
            @onDialogPopupShowOrHide="handleSwiperDotShow"
          />
          <Words
            v-if="currentExtensionList.length >= 3"
            @onDialogPopupShowOrHide="handleSwiperDotShow"
          />
        </swiper-item>
      </swiper>
    </div>
    <UserSelector
      ref="userSelectorRef"
      :type="selectorShowType"
      :currentConversation="currentConversation"
      :isGroup="isGroup"
      @submit="onUserSelectorSubmit"
      @cancel="onUserSelectorCancel"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onUnmounted, onMounted } from '../../../adapter-vue';
import TUIChatEngine, {
  IConversationModel,
  TUIStore,
  StoreName,
} from '@tencentcloud/chat-uikit-engine';
import TUICore, { ExtensionInfo, TUIConstants } from '@tencentcloud/tui-core';
import ImageUpload from './image-upload/index.vue';
import VideoUpload from './video-upload/index.vue';
import Evaluate from './evaluate/index.vue';
import Words from './words/index.vue';
import ToolbarItemContainer from './toolbar-item-container/index.vue';
import EmojiPickerDialog from './emoji-picker/emoji-picker-dialog.vue';
import UserSelector from './user-selector/index.vue';
import TUIChatConfig from '../config';
import { enableSampleTaskStatus } from '../../../utils/enableSampleTaskStatus';
import { ToolbarDisplayType } from '../../../interface';

interface IProps {
  displayType: ToolbarDisplayType;
}

const props = withDefaults(defineProps<IProps>(), {
});

const currentConversation = ref<IConversationModel>();
const isGroup = ref<boolean>(false);
const selectorShowType = ref<string>('');
const userSelectorRef = ref();
const currentUserSelectorExtension = ref<ExtensionInfo | null>();
const currentExtensionList = ref<ExtensionInfo[]>([]);
const isSwiperIndicatorDotsEnable = ref<boolean>(false);

// extensions
const extensionList: ExtensionInfo[] = [
  ...TUICore.getExtensionList(TUIConstants.TUIChat.EXTENSION.INPUT_MORE.EXT_ID),
];

const getExtensionList = (conversationID: string) => {
  if (!conversationID) {
    // uni-app build ios app has null in last index need to filter
    return (
      currentExtensionList.value = extensionList.filter(extension => extension)
    );
  }
  const chatType = TUIChatConfig.getChatType();
  const options: any = {
    chatType,
  };
  // Backward compatibility: When callkit does not have chatType judgment, use filterVoice and filterVideo to filter
  if (chatType === 'customerService') {
    options.filterVoice = true;
    options.filterVideo = true;
    enableSampleTaskStatus('customerService');
  }
  // uni-app build ios app has null in last index need to filter
  currentExtensionList.value = [
    ...TUICore.getExtensionList(
      TUIConstants.TUIChat.EXTENSION.INPUT_MORE.EXT_ID,
      options,
    ),
  ].filter(extension => extension);
};

const onCurrentConversationUpdate = (conversation: IConversationModel) => {
  if (
    conversation?.conversationID
    && currentConversation.value?.conversationID !== conversation?.conversationID
  ) {
    getExtensionList(conversation?.conversationID);
    if (currentExtensionList.value.length > 2) {
      isSwiperIndicatorDotsEnable.value = true;
    }
  }
  currentConversation.value = conversation;
  if (currentConversation?.value?.type === TUIChatEngine.TYPES.CONV_GROUP) {
    isGroup.value = true;
  } else {
    isGroup.value = false;
  }
};

onMounted(() => {
  TUIStore.watch(StoreName.CONV, {
    currentConversation: onCurrentConversationUpdate,
  });
});

onUnmounted(() => {
  TUIStore.unwatch(StoreName.CONV, {
    currentConversation: onCurrentConversationUpdate,
  });
});

// handle extensions onclick
const onExtensionClick = (extension: ExtensionInfo) => {
  // uniapp vue2 build wx lose listener proto
  const extensionModel = currentExtensionList.value.find(
    targetExtension => targetExtension?.data?.name === extension?.data?.name,
  );
  switch (extensionModel?.data?.name) {
    case 'voiceCall':
      onCallExtensionClicked(extensionModel, 1);
      break;
    case 'videoCall':
      onCallExtensionClicked(extensionModel, 2);
      break;
    case 'search':
      extensionModel?.listener?.onClicked?.();
      break;
    default:
      break;
  }
};

const genOfflinePushInfo = () => {
  // doc: https://cloud.tencent.com/document/product/269/105713
  return {
    title: 'call',
    description: 'you have a call',
    androidSound: 'private_ring',
    iOSSound: '01.caf',
  };
};

const onCallExtensionClicked = (extension: ExtensionInfo, callType: number) => {
  selectorShowType.value = extension?.data?.name;
  if (currentConversation?.value?.type === TUIChatEngine.TYPES.CONV_C2C) {
    extension?.listener?.onClicked?.({
      userIDList: [currentConversation?.value?.conversationID?.slice(3)],
      type: callType,
      callParams: {
        offlinePushInfo: genOfflinePushInfo(),
      },
    });
  } else if (isGroup.value) {
    currentUserSelectorExtension.value = extension;
    userSelectorRef?.value?.toggleShow && userSelectorRef.value.toggleShow(true);
  }
};

const genExtensionIcon = (extension: any) => {
  return extension?.icon;
};
const genExtensionText = (extension: any) => {
  return extension?.text;
};

const onUserSelectorSubmit = (selectedInfo: any) => {
  currentUserSelectorExtension.value?.listener?.onClicked?.({
    ...selectedInfo,
    callParams: {
      offlinePushInfo: genOfflinePushInfo(),
    },
  });
  currentUserSelectorExtension.value = null;
};

const onUserSelectorCancel = () => {
  currentUserSelectorExtension.value = null;
};

const handleSwiperDotShow = (showStatus: boolean) => {
  isSwiperIndicatorDotsEnable.value
    = currentExtensionList.value.length > 2 ? !showStatus : false;
};
</script>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared',
  },
};
</script>
<style lang="scss">
@import '../../../assets/styles/common';
@import './style/uni';
</style>
