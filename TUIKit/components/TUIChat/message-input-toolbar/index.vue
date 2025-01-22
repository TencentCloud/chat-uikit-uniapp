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
          <ImageUpload
            v-if="featureConfig.InputImage"
            imageSourceType="camera"
          />
          <ImageUpload
            v-if="featureConfig.InputImage"
            imageSourceType="album"
          />
          <VideoUpload
            v-if="featureConfig.InputVideo"
            videoSourceType="album"
          />
          <VideoUpload
            v-if="featureConfig.InputVideo"
            videoSourceType="camera"
          />
          <template v-if="currentExtensionList.length > 0">
            <div
              v-for="(extension, index) in currentExtensionList.slice(0, slicePos)"
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
          <template v-if="neededCountFirstPage === 1">
            <Evaluate
              v-if="featureConfig.InputEvaluation"
              @onDialogPopupShowOrHide="handleSwiperDotShow"
            />
            <Words
              v-else-if="featureConfig.InputQuickReplies"
              @onDialogPopupShowOrHide="handleSwiperDotShow"
            />
          </template>
          <template v-if="neededCountFirstPage > 1">
            <Evaluate
              v-if="featureConfig.InputEvaluation"
              @onDialogPopupShowOrHide="handleSwiperDotShow"
            />
            <Words
              v-if="featureConfig.InputQuickReplies"
              @onDialogPopupShowOrHide="handleSwiperDotShow"
            />
          </template>
        </swiper-item>
        <swiper-item
          v-if="neededCountFirstPage <= 1"
          :class="[
            'message-input-toolbar-list',
            'message-input-toolbar-h5-list',
            'message-input-toolbar-uni-list',
          ]"
        >
          <div
            v-for="(extension, index) in currentExtensionList.slice(slicePos)"
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
          <template v-if="neededCountFirstPage === 1">
            <Words
              v-if="featureConfig.InputQuickReplies"
              @onDialogPopupShowOrHide="handleSwiperDotShow"
            />
          </template>
          <template v-else>
            <Evaluate
              v-if="featureConfig.InputEvaluation"
              @onDialogPopupShowOrHide="handleSwiperDotShow"
            />
            <Words
              v-if="featureConfig.InputQuickReplies"
              @onDialogPopupShowOrHide="handleSwiperDotShow"
            />
          </template>
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
  TUIReportService,
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
import OfflinePushInfoManager, { PUSH_SCENE } from '../offlinePushInfoManager/index';

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
const featureConfig = TUIChatConfig.getFeatureConfig();
const neededCountFirstPage = ref<number>(8);
const slicePos = ref<number>(0);

const computeToolbarPaging = () => {
  if (featureConfig.InputImage && featureConfig.InputVideo) {
    neededCountFirstPage.value -= 4;
  } else if (featureConfig.InputImage || featureConfig.InputVideo) {
    neededCountFirstPage.value -= 2;
  }

  slicePos.value = neededCountFirstPage.value;
  neededCountFirstPage.value -= currentExtensionList.value.length;

  if (neededCountFirstPage.value === 1) {
    isSwiperIndicatorDotsEnable.value = (featureConfig.InputEvaluation && featureConfig.InputQuickReplies);
  } else if (neededCountFirstPage.value < 1) {
    isSwiperIndicatorDotsEnable.value = featureConfig.InputEvaluation || featureConfig.InputQuickReplies;
  }
};

onMounted(() => {
  TUIStore.watch(StoreName.CUSTOM, {
    activeConversation: onActiveConversationUpdate,
  });
});

onUnmounted(() => {
  TUIStore.unwatch(StoreName.CUSTOM, {
    activeConversation: onActiveConversationUpdate,
  });
});

const onActiveConversationUpdate = (conversationID: string) => {
  if (!conversationID) {
    return;
  }
  if (conversationID !== currentConversation.value?.conversationID) {
    getExtensionList();
    computeToolbarPaging();
    currentConversation.value = TUIStore.getData(StoreName.CONV, 'currentConversation');
    isGroup.value = conversationID.startsWith(TUIChatEngine.TYPES.CONV_GROUP);
  }
};

const getExtensionList = () => {
  const chatType = TUIChatConfig.getChatType();
  const params: Record<string, boolean | string> = { chatType };
  // Backward compatibility: When callkit does not have chatType judgment, use filterVoice and filterVideo to filter
  if (chatType === TUIConstants.TUIChat.TYPE.CUSTOMER_SERVICE) {
    params.filterVoice = true;
    params.filterVideo = true;
    enableSampleTaskStatus('customerService');
  }
  // uni-app build ios app has null in last index need to filter
  currentExtensionList.value = [
    ...TUICore.getExtensionList(TUIConstants.TUIChat.EXTENSION.INPUT_MORE.EXT_ID, params),
  ].filter((extension: ExtensionInfo) => {
    if (extension?.data?.name === 'search') {
      return featureConfig.MessageSearch;
    }
    return true;
  });
  reportExtension(currentExtensionList.value);
};

function reportExtension(extensionList:ExtensionInfo[]){
  extensionList.forEach((extension: ExtensionInfo)=>{
    const _name = extension?.data?.name;
    if(_name === 'voiceCall'){
      TUIReportService.reportFeature(203, 'voice-call');
    } else if (_name === 'videoCall') {
      TUIReportService.reportFeature(203, 'video-call');
    } else if(_name === 'quickRoom'){
      TUIReportService.reportFeature(204);
    }
  });
}

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

const onCallExtensionClicked = (extension: ExtensionInfo, callType: number) => {
  selectorShowType.value = extension?.data?.name;
  if (currentConversation?.value?.type === TUIChatEngine.TYPES.CONV_C2C) {
    extension?.listener?.onClicked?.({
      userIDList: [currentConversation?.value?.conversationID?.slice(3)],
      type: callType,
      callParams: {
        offlinePushInfo: OfflinePushInfoManager.getOfflinePushInfo(PUSH_SCENE.CALL),
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
      offlinePushInfo: OfflinePushInfoManager.getOfflinePushInfo(PUSH_SCENE.CALL),
    },
  });
  currentUserSelectorExtension.value = null;
};

const onUserSelectorCancel = () => {
  currentUserSelectorExtension.value = null;
};

const handleSwiperDotShow = (showStatus: boolean) => {
  isSwiperIndicatorDotsEnable.value = (neededCountFirstPage.value <= 1 && !showStatus);
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
