<template>
  <div
    :class="{
      'tui-chat': true,
      'tui-chat-h5': isMobile,
    }"
    @click="onMessageListBackgroundClick"
  >
    <!-- <JoinGroupCard /> -->
    <div class="tui-chat-main">
      <div class="tui-chat-safe-tips">
        <span>
          {{
            TUITranslateService.t(
              "TUIChat.【安全提示】本 APP 仅用于体验腾讯云即时通信 IM 产品功能，不可用于业务洽谈与拓展。请勿轻信汇款、中奖等涉及钱款的信息，勿轻易拨打陌生电话，谨防上当受骗。"
            )
          }}
        </span>
        <a @click="openComplaintLink(Link.complaint)">{{
          TUITranslateService.t("TUIChat.点此投诉")
        }}</a>
      </div>
      <MessageGroupApplication
        v-if="isGroup"
        :key="props.groupID"
        :groupID="props.groupID"
      />
      <scroll-view
        id="messageScrollList"
        class="tui-message-list"
        scroll-y="true"
        :scroll-top="scrollTop"
        :scroll-into-view="`tui-${historyFirstMessageID}`"
        @scroll="handelScrollListScroll"
      >
        <p
          v-if="!isCompleted"
          class="message-more"
          @click="getHistoryMessageList"
        >
          {{ TUITranslateService.t("TUIChat.查看更多") }}
        </p>
        <li
          v-for="(item, index) in messageList"
          :id="`tui-${item.ID}`"
          :key="item.vueForRenderKey"
          :class="'message-li ' + item.flow"
        >
          <MessageTimestamp
            :currTime="item.time"
            :prevTime="index > 0 ? messageList[index - 1].time : 0"
          />
          <div
            class="message-item"
            @click="toggleID = ''"
          >
            <MessageTip
              v-if="item.type === TYPES.MSG_GRP_TIP ||
                isCreateGroupCustomMessage(item)
              "
              :content="item.getMessageContent()"
            />
            <div
              v-else-if="!item.isRevoked && !isPluginMessage(item)"
              :id="`msg-bubble-${item.ID}`"
              class="message-bubble-container"
              @longpress="handleToggleMessageItem($event, item, index, true)"
              @touchstart="handleH5LongPress($event, item, index, 'touchstart')"
              @touchend="handleH5LongPress($event, item, index, 'touchend')"
              @mouseover="handleH5LongPress($event, item, index, 'touchend')"
            >
              <MessageBubble
                :messageItem="item"
                :content="item.getMessageContent()"
                :blinkMessageIDList="blinkMessageIDList"
                @resendMessage="resendMessage(item)"
                @blinkMessage="blinkMessage"
                @scrollTo="scrollTo"
                @setReadReceiptPanelVisible="setReadReceiptPanelVisible"
              >
                <MessageText
                  v-if="item.type === TYPES.MSG_TEXT"
                  :content="item.getMessageContent()"
                />
                <ProgressMessage
                  v-if="item.type === TYPES.MSG_IMAGE"
                  :content="item.getMessageContent()"
                  :messageItem="item"
                >
                  <MessageImage
                    :content="item.getMessageContent()"
                    :messageItem="item"
                    @previewImage="handleImagePreview(index)"
                  />
                </ProgressMessage>
                <ProgressMessage
                  v-if="item.type === TYPES.MSG_VIDEO"
                  :content="item.getMessageContent()"
                  :messageItem="item"
                >
                  <MessageVideo
                    :content="item.getMessageContent()"
                    :messageItem="item"
                  />
                </ProgressMessage>
                <MessageAudio
                  v-if="item.type === TYPES.MSG_AUDIO"
                  :content="item.getMessageContent()"
                  :messageItem="item"
                  :broadcastNewAudioSrc="broadcastNewAudioSrc"
                  @getGlobalAudioContext="getGlobalAudioContext"
                />
                <MessageFile
                  v-if="item.type === TYPES.MSG_FILE"
                  :content="item.getMessageContent()"
                />
                <MessageFace
                  v-if="item.type === TYPES.MSG_FACE"
                  :content="item.getMessageContent()"
                  :isPC="isPC"
                />
                <MessageLocation
                  v-if="item.type === TYPES.MSG_LOCATION"
                  :content="item.getMessageContent()"
                />
                <MessageCustom
                  v-if="item.type === TYPES.MSG_CUSTOM"
                  :content="item.getMessageContent()"
                  :messageItem="item"
                />
              </MessageBubble>
            </div>
            <MessagePlugin
              v-else-if="!item.isRevoked && isPluginMessage(item)"
              :message="item"
              @resendMessage="resendMessage"
              @handleToggleMessageItem="handleToggleMessageItem"
              @handleH5LongPress="handleH5LongPress"
            />
            <MessageRevoked
              v-else
              :isEdit="item.type === TYPES.MSG_TEXT"
              :messageItem="item"
              @messageEdit="handleEdit(item)"
            />
            <MessageTool
              v-if="item.ID === toggleID"
              :class="[
                'message-tool',
                item.flow === 'out' ? 'message-tool-out' : 'message-tool-in',
              ]"
              :messageItem="item"
            />
          </div>
        </li>
      </scroll-view>
      <!-- 滚动按钮 -->
      <ScrollButton
        ref="scrollButtonInstanceRef"
        @scrollToLatestMessage="scrollToLatestMessage"
      />
      <Dialog
        v-if="reSendDialogShow"
        :show="reSendDialogShow"
        :isH5="!isPC"
        :center="true"
        :isHeaderShow="isPC"
        @submit="resendMessageConfirm()"
        @update:show="(e) => (reSendDialogShow = e)"
      >
        <p class="delDialog-title">
          {{ TUITranslateService.t("TUIChat.确认重发该消息？") }}
        </p>
      </Dialog>
      <!-- 已读回执用户列表面板 -->
      <ReadReceiptPanel
        v-if="isShowReadUserStatusPanel"
        :message="Object.assign({}, readStatusMessage)"
        @setReadReceiptPanelVisible="setReadReceiptPanelVisible"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  nextTick,
  onMounted,
  onUnmounted,
  getCurrentInstance,
} from '../../../adapter-vue';
import TUIChatEngine, {
  IMessageModel,
  TUIStore,
  StoreName,
  TUITranslateService,
  TUIChatService,
} from '@tencentcloud/chat-uikit-engine';
import throttle from 'lodash/throttle';
import {
  setInstanceMapping,
  getBoundingClientRect,
  getScrollInfo,
} from '@tencentcloud/universal-api';
// import { JoinGroupCard } from '@tencentcloud/call-uikit-wechat';
import Link from './link';
import MessageGroupApplication from './message-group-application/index.vue';
import MessageText from './message-elements/message-text.vue';
import ProgressMessage from '../../common/ProgressMessage/index.vue';
import MessageImage from './message-elements/message-image.vue';
import MessageAudio from './message-elements/message-audio.vue';
import MessageFile from './message-elements/message-file.vue';
import MessageFace from './message-elements/message-face.vue';
import MessageCustom from './message-elements/message-custom.vue';
import MessageTip from './message-elements/message-tip.vue';
import MessageBubble from './message-elements/message-bubble.vue';
import MessageLocation from './message-elements/message-location.vue';
import MessageTimestamp from './message-elements/message-timestamp.vue';
import MessageVideo from './message-elements/message-video.vue';
import MessageTool from './message-tool/index.vue';
import MessageRevoked from './message-tool/message-revoked.vue';
import MessagePlugin from '../../../plugins/plugin-components/message-plugin.vue';
import ReadReceiptPanel from './read-receipt-panel/index.vue';
import ScrollButton from './scroll-button/index.vue';
import { isPluginMessage } from '../../../plugins/plugin-components/index';
import Dialog from '../../common/Dialog/index.vue';
import { Toast, TOAST_TYPE } from '../../common/Toast/index';
import { isCreateGroupCustomMessage } from '../utils/utils';
import { isEnabledMessageReadReceiptGlobal } from '../utils/utils';
import { isPC, isH5, isMobile } from '../../../utils/env';
import { IAudioContext } from '../../../interface';

interface IEmits {
  (e: 'closeInputToolBar'): void;
  (e: 'handleEditor', message: IMessageModel, type: string): void;
}

const emits = defineEmits<IEmits>();
const props = defineProps({
  groupID: {
    type: String,
    default: '',
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
});

let observer: any = null;
let groupType: string | undefined;
const sentReceiptMessageID = new Set<string>();
const thisInstance = getCurrentInstance()?.proxy || getCurrentInstance();
const messageList = ref<IMessageModel[]>();
const isCompleted = ref(false);
const currentConversationID = ref('');
const toggleID = ref('');
const scrollTop = ref(5000); // 首次是 15 条消息，最大消息高度为300
const TYPES = ref(TUIChatEngine.TYPES);
const isLoadingMessage = ref(false);
const isLongpressing = ref(false);
const blinkMessageIDList = ref<string[]>([]);
const messageTarget = ref<IMessageModel>();
const scrollButtonInstanceRef = ref<InstanceType<typeof ScrollButton>>();
const historyFirstMessageID = ref<string>('');
let selfAddValue = 0;

// audio control
const broadcastNewAudioSrc = ref<string>('');

// 阅读回执状态message
const readStatusMessage = ref<IMessageModel>();
const isShowReadUserStatusPanel = ref<boolean>(false);

// 消息重发 Dialog
const reSendDialogShow = ref(false);
const resendMessageData = ref();

// 消息滑动到底部，建议搭配 nextTick 使用
const scrollToBottom = () => {
  // 文本消息高度：60, 最大消息高度 280
  scrollTop.value += 300;
  // 解决 uniapp 打包到 app 首次进入滑动到底部，300 可设置
  const timer = setTimeout(() => {
    scrollTop.value += 1;
    clearTimeout(timer);
  }, 300);
};

// 监听回调函数
const onCurrentConversationIDUpdated = (conversationID: string) => {
  currentConversationID.value = conversationID;

  // 开启已读回执的状态 群聊缓存群类型
  if (isEnabledMessageReadReceiptGlobal()) {
    const { groupProfile }
      = TUIStore.getConversationModel(conversationID) || {};
    groupType = groupProfile?.type;
  }
};

onMounted(() => {
  // 消息列表监听
  TUIStore.watch(StoreName.CHAT, {
    messageList: onMessageListUpdated,
    messageSource: onMessageSourceUpdated,
    isCompleted: onChatCompletedUpdated,
  });

  TUIStore.watch(StoreName.CONV, {
    currentConversationID: onCurrentConversationIDUpdated,
  });

  setInstanceMapping('messageList', thisInstance);

  uni.$on('scroll-to-bottom', scrollToLatestMessage);
});

// 取消监听
onUnmounted(() => {
  TUIStore.unwatch(StoreName.CHAT, {
    messageList: onMessageListUpdated,
    isCompleted: onChatCompletedUpdated,
  });

  TUIStore.unwatch(StoreName.CONV, {
    currentConversationID: onCurrentConversationIDUpdated,
  });

  observer?.disconnect();
  observer = null;

  uni.$off('scroll-to-bottom');
});

const handelScrollListScroll = throttle(
  function (e: Event) {
    scrollButtonInstanceRef.value?.judgeScrollOverOneScreen(e);
  },
  500,
  { leading: true },
);

function getGlobalAudioContext(
  audioMap: Map<string, IAudioContext>,
  options?: { newAudioSrc: string },
) {
  if (options?.newAudioSrc) {
    broadcastNewAudioSrc.value = options.newAudioSrc;
  }
}

async function onMessageListUpdated(list: IMessageModel[]) {
  observer?.disconnect();
  messageList.value = list
    .filter(message => !message.isDeleted)
    .map((message) => {
      message.vueForRenderKey = `${message.ID}`;
      return message;
    });
  const newLastMessage = messageList.value?.[messageList.value?.length - 1];
  if (messageTarget.value) {
    // scroll to target message
    scrollAndBlinkMessage(messageTarget.value);
  } else if (!isLoadingMessage.value && !(scrollButtonInstanceRef.value?.isScrollButtonVisible && newLastMessage?.flow === 'in')) {
    // scroll to bottom
    nextTick(() => {
      scrollToBottom();
    });
  }
  if (isEnabledMessageReadReceiptGlobal()) {
    nextTick(() => bindIntersectionObserver());
  }
}

// 滚动到最新消息
async function scrollToLatestMessage() {
  try {
    const { scrollHeight } = await getScrollInfo(
      '#messageScrollList',
      'messageList',
    );
    if (scrollHeight) {
      scrollTop.value === scrollHeight
        ? (scrollTop.value = scrollHeight + 1)
        : (scrollTop.value = scrollHeight);
    } else {
      scrollToBottom();
    }
  } catch (error) {
    scrollToBottom();
  }
}

async function onMessageSourceUpdated(message: IMessageModel) {
  messageTarget.value = message;
  scrollAndBlinkMessage(messageTarget.value);
}

function scrollAndBlinkMessage(message: IMessageModel) {
  if (
    messageList.value?.some(
      messageListItem => messageListItem?.ID === message?.ID,
    )
  ) {
    nextTick(async () => {
      await scrollToTargetMessage(message);
      await blinkMessage(message?.ID);
      messageTarget.value = undefined;
    });
  }
}

function onChatCompletedUpdated(flag: boolean) {
  isCompleted.value = flag;
}

// 获取历史消息
const getHistoryMessageList = () => {
  isLoadingMessage.value = true;
  const currentFirstMessageID = messageList.value?.[0]?.ID || '';
  TUIChatService.getMessageList().then(() => {
    nextTick(() => {
      historyFirstMessageID.value = currentFirstMessageID;
      const timer = setTimeout(() => {
        historyFirstMessageID.value = '';
        isLoadingMessage.value = false;
        clearTimeout(timer);
      }, 500);
    });
  });
};

// todo: webview 跳转
const openComplaintLink = () => { };

// 消息操作
const handleToggleMessageItem = (
  e: any,
  message: IMessageModel,
  index: number,
  isLongpress = false,
) => {
  if (isLongpress) {
    isLongpressing.value = true;
  }
  toggleID.value = message.ID;
};

// h5 long press
let timer: number;
const handleH5LongPress = (
  e: any,
  message: IMessageModel,
  index: number,
  type: string,
) => {
  if (!isH5) return;
  function longPressHandler() {
    clearTimeout(timer);
    handleToggleMessageItem(e, message, index, true);
  }
  function touchStartHandler() {
    timer = setTimeout(longPressHandler, 500);
  }
  function touchEndHandler() {
    clearTimeout(timer);
  }
  switch (type) {
    case 'touchstart':
      touchStartHandler();
      break;
    case 'touchend':
      touchEndHandler();
      setTimeout(() => {
        isLongpressing.value = false;
      }, 200);
      break;
  }
};

// 消息撤回后，编辑消息
const handleEdit = (message: IMessageModel) => {
  emits('handleEditor', message, 'reedit');
};

// 重发消息
const resendMessage = (message: IMessageModel) => {
  reSendDialogShow.value = true;
  resendMessageData.value = message;
};

// 图片预览
// 开启图片预览
const handleImagePreview = (index: number) => {
  if (!messageList.value) {
    return;
  }
  const imageMessageIndex: number[] = [];
  const imageMessageList: IMessageModel[] = messageList.value.filter((item, index) => {
    if (
      !item.isRevoked
      && !item.hasRiskContent
      && item.type === TYPES.value.MSG_IMAGE
    ) {
      imageMessageIndex.push(index);
      return true;
    }
    return false;
  });
  uni.previewImage({
    current: imageMessageIndex.indexOf(index),
    urls: imageMessageList.map(message => message.payload.imageInfoArray?.[2].url),
    // #ifdef APP-PLUS
    indicator: 'number',
    // #endif
  });
};

const resendMessageConfirm = () => {
  reSendDialogShow.value = !reSendDialogShow.value;
  const messageModel = resendMessageData.value;
  messageModel.resendMessage();
};

function blinkMessage(messageID: string): Promise<void> {
  return new Promise((resolve) => {
    const index = blinkMessageIDList.value.indexOf(messageID);
    if (index < 0) {
      blinkMessageIDList.value.push(messageID);
      const timer = setTimeout(() => {
        blinkMessageIDList.value.splice(
          blinkMessageIDList.value.indexOf(messageID),
          1,
        );
        clearTimeout(timer);
        resolve();
      }, 3000);
    }
  });
}

function scrollTo(scrollHeight: number) {
  scrollTop.value = scrollHeight;
}

async function bindIntersectionObserver() {
  if (!messageList.value || messageList.value.length === 0) {
    return;
  }

  if (
    groupType === TYPES.value.GRP_AVCHATROOM
    || groupType === TYPES.value.GRP_COMMUNITY
  ) {
    // 直播群以及社群不进行消息的已读回执监听
    return;
  }

  observer?.disconnect();
  observer = uni
    .createIntersectionObserver(thisInstance, {
      threshold: [0.7],
      observeAll: true,
      // uni 下会把 safetip 也算进去 需要负 margin 来排除
    })
    .relativeTo('#messageScrollList', { top: -70 });

  observer?.observe('.message-li.in .message-bubble-container', (res: any) => {
    if (sentReceiptMessageID.has(res.id)) {
      return;
    }
    const matchingMessage = messageList.value.find((message: IMessageModel) => {
      return res.id.indexOf(message.ID) > -1;
    });
    if (
      matchingMessage
      && matchingMessage.needReadReceipt
      && matchingMessage.flow === 'in'
      && !matchingMessage.readReceiptInfo?.isPeerRead
    ) {
      TUIChatService.sendMessageReadReceipt([matchingMessage]);
      sentReceiptMessageID.add(res.id);
    }
  });
}

function setReadReceiptPanelVisible(visible: boolean, message?: IMessageModel) {
  if (!visible) {
    readStatusMessage.value = undefined;
  } else {
    readStatusMessage.value = message;
  }
  isShowReadUserStatusPanel.value = visible;
}

async function scrollToTargetMessage(message: IMessageModel) {
  const targetMessageID = message.ID;
  const isTargetMessageInScreen
    = messageList.value
    && messageList.value.some(msg => msg.ID === targetMessageID);
  if (targetMessageID && isTargetMessageInScreen) {
    const timer = setTimeout(async () => {
      try {
        const scrollViewRect = await getBoundingClientRect(
          '#messageScrollList',
          'messageList',
        );
        const originalMessageRect = await getBoundingClientRect(
          '#tui-' + targetMessageID,
          'messageList',
        );
        const { scrollTop } = await getScrollInfo(
          '#messageScrollList',
          'messageList',
        );
        const finalScrollTop
          = originalMessageRect.top
          + scrollTop
          - scrollViewRect.top
          - (selfAddValue++ % 2);
        scrollTo(finalScrollTop);
        clearTimeout(timer);
      } catch (error) {
        // todo
      }
    }, 500);
  } else {
    Toast({
      message: TUITranslateService.t('TUIChat.无法定位到原消息'),
      type: TOAST_TYPE.WARNING,
    });
  }
}

function onMessageListBackgroundClick() {
  emits('closeInputToolBar');
}
</script>
<style lang="scss" scoped src="./style/index.scss"></style>
