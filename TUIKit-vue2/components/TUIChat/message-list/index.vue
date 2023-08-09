<template>
  <div class="TUIChat" :class="[!isPC ? 'TUIChat-H5' : '']">
    <div class="TUIChat-main">
      <div class="TUIChat-safe-tips">
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
      <div
        class="TUIChat-application-tips"
        v-if="isGroup && groupApplicationCount > 0"
        @click="toggleApplicationList()"
      >
        <span
          >{{ groupApplicationCount }}
          {{ TUITranslateService.t("TUIChat.条入群申请") }}
          <span class="application-tips-btn">{{
            TUITranslateService.t("TUIChat.点击处理")
          }}</span>
        </span>
      </div>
      <scroll-view
        class="TUI-message-list"
        scroll-y="true"
        :scroll-top="scrollTop"
      >
        <p
          class="message-more"
          @click="getHistoryMessageList"
          v-if="!isCompleted"
        >
          {{ TUITranslateService.t("TUIChat.查看更多") }}
        </p>
        <li
          v-for="(item, index) in messageList"
          :key="index"
          :id="item.ID"
          ref="messageAimID"
          class="message-li"
        >
          <MessageTimestamp
            :currTime="item.time"
            :prevTime="index > 0 ? messageList[index - 1].time : 0"
          ></MessageTimestamp>
          <div
            class="message-item"
            v-if="!item.isDeleted"
            @click.stop="toggleID = ''"
          >
            <MessageTip
              v-if="item.type === TYPES.MSG_GRP_TIP"
              :content="item.getMessageContent()"
            />
            <div
              v-else-if="!item.isRevoked && !item.getSignalingInfo()"
              @longpress="handleToggleMessageItem($event, item, index, true)"
              @click.prevent.right="
                handleToggleMessageItem($event, item, index)
              "
              @touchstart="handleH5LongPress($event, item, index, 'touchstart')"
              @touchend="handleH5LongPress($event, item, index, 'touchend')"
              @mouseover="handleH5LongPress($event, item, index, 'touchend')"
            >
              <MessageBubble
                :messageItem="item"
                @resendMessage="resendMessage(item)"
              >
                <MessageText
                  v-if="item.type === TYPES.MSG_TEXT"
                  :content="item.getMessageContent()"
                />
                <MessageImage
                  v-if="item.type === TYPES.MSG_IMAGE"
                  :content="item.getMessageContent()"
                  :messageItem="item"
                  :isPC="isPC"
                  @previewImage="handleImagePreview"
                />
                <MessageVideo
                  v-if="item.type === TYPES.MSG_VIDEO"
                  :content="item.getMessageContent()"
                  :messageItem="item"
                  :isPC="isPC"
                />
                <MessageAudio
                  v-if="item.type === TYPES.MSG_AUDIO"
                  :content="item.getMessageContent()"
                  :messageItem="item"
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
              v-else-if="!item.isRevoked && item.getSignalingInfo()"
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
              :class="[
                'message-tool',
                item.flow === 'out' ? 'message-tool-out' : 'message-tool-in',
              ]"
              :messageItem="item"
              v-if="item.ID === toggleID"
            />
          </div>
        </li>
      </scroll-view>
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
      <ImagePreviewer
        v-if="showImagePreview"
        :currentImage="currentImagePreview"
        :imageList="imageMessageList"
        @close="onImagePreviewerClose"
      ></ImagePreviewer>
      <MessageGroupSystem
        v-if="showGroupApplication"
        :groupID="groupID"
        @toggleApplicationList="toggleApplicationList"
        @handleGroupApplication="handleGroupApplication"
      ></MessageGroupSystem>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  defineProps,
  defineEmits,
  getCurrentInstance,
  defineExpose,
  nextTick,
  onMounted,
  computed,
  onUnmounted,
} from "../../../adapter-vue";
import TUIChatEngine, {
  TUIGlobal,
  IMessageModel,
  TUIStore,
  StoreName,
  TUITranslateService,
  TUIChatService,
  TUIGroupService,
} from "@tencentcloud/chat-uikit-engine";

import Link from "./link";
import MessageText from "./message-elements/message-text.vue";
import MessageImage from "./message-elements/message-image.vue";
import MessageAudio from "./message-elements/message-audio.vue";
import MessageFile from "./message-elements/message-file.vue";
import MessageFace from "./message-elements/message-face.vue";
import MessageCustom from "./message-elements/message-custom.vue";
import MessageTip from "./message-elements/message-tip.vue";
import MessageBubble from "./message-elements/message-bubble.vue";
import MessageLocation from "./message-elements/message-location.vue";
import MessageTimestamp from "./message-elements/message-timestamp.vue";
import MessageVideo from "./message-elements/message-video.vue";
import MessageTool from "./message-tool/index.vue";
import MessageRevoked from "./message-tool/message-revoked.vue";
import MessageGroupSystem from "./message-elements/message-group-system.vue";
import MessagePlugin from "../../../plugins/plugin-components/message-plugin.vue";

import Dialog from "../../common/Dialog";
import ImagePreviewer from "../../common/ImagePreviewer/index";
import { getImgLoad } from "../utils/utils";
import { CHAT_SCROLL_TYPE } from "../../../constant";
const props = defineProps({
  groupID: {
    type: String,
    default: "",
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
});
const isPC = ref(TUIGlobal.getPlatform() === "pc");
const isH5 = ref(TUIGlobal.getPlatform() === "h5");
const messageListRef = ref();
const title = ref("TUIChat");
const messageList = ref();
const isCompleted = ref(false);
const currentConversationID = ref("");
const nextReqMessageID = ref();
const toggleID = ref("");
const scrollTop = ref(5000); // 首次是 15 条消息，最大消息高度为300
const TYPES = ref(TUIChatEngine.TYPES);
const listRef = ref();
const isLoadMessage = ref(false);
const isLongpressing = ref(false);

// 加群申请系统消息
const groupApplicationCount = ref(0);
const showGroupApplication = ref(false);
const applicationUserIDList = ref([]);

// 消息重发 Dialog
const reSendDialogShow = ref(false);
const resendMessageData = ref();
const emits = defineEmits(["handleEditor"]);

// 图片预览相关
const showImagePreview = ref(false);
const currentImagePreview = ref<typeof IMessageModel>();
const imageMessageList = computed(() =>
  messageList?.value?.filter((item: typeof IMessageModel) => {
    return !item.isRevoked && item.type === TYPES.value.MSG_IMAGE;
  })
);

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
  TUIGroupService.getGroupApplicationList().then((res: any) => {
    const applicationList = res.data.applicationList.filter(
      (application: any) => application.groupID === props.groupID
    );
    applicationUserIDList.value = applicationList.map((application: any) => {
      return application.applicationType === 0
        ? application.applicant
        : application.userID;
    });
    TUIStore.update(
      StoreName.CUSTOM,
      "groupApplicationCount",
      applicationList.length
    );
  });
};

// operationType 操作类型 1: 有用户申请加群   23: 普通群成员邀请用户进群
const onGroupSystemNoticeList = (list: Array<typeof IMessageModel>) => {
  const systemNoticeList = list.filter((message) => {
    const { operationType } = message.payload;
    return (
      (operationType === 1 || operationType === 23) &&
      message.to === props.groupID
    );
  });

  systemNoticeList.forEach((systemNotice) => {
    const { operationType } = systemNotice.payload;
    if (operationType === 1) {
      const { operatorID } = systemNotice.payload;
      if (!applicationUserIDList.value.includes(operatorID)) {
        applicationUserIDList.value.push(operatorID);
      }
    }
    if (operationType === 23) {
      const { inviteeList } = systemNotice.payload;
      inviteeList.forEach((invitee) => {
        if (!applicationUserIDList.value.includes(invitee)) {
          applicationUserIDList.value.push(invitee);
        }
      });
    }
  });
  const applicationCount = applicationUserIDList.value.length;
  TUIStore.update(StoreName.CUSTOM, "groupApplicationCount", applicationCount);
};

// 消息列表监听
TUIStore.watch(StoreName.CHAT, {
  messageList: (list: Array<typeof IMessageModel>) => {
    messageList.value = list;
    // 点击加载更多的消息不需要滑动到底部
    if (!isLoadMessage.value) {
      scrollToBottom();
    }
  },
  isCompleted: (flag: boolean) => {
    isCompleted.value = flag;
  },
});

TUIStore.watch(StoreName.CONV, {
  currentConversationID: onCurrentConversationIDUpdated,
});

// 群系统消息
TUIStore.watch(StoreName.GRP, {
  groupSystemNoticeList: onGroupSystemNoticeList,
});

// 群系统消息数量
TUIStore.watch(StoreName.CUSTOM, {
  groupApplicationCount: (count: Number) => {
    groupApplicationCount.value = count;
  },
});

// 取消监听
onUnmounted(() => {
  TUIStore.unwatch(StoreName.CONV, {
    currentConversationID: onCurrentConversationIDUpdated,
  });
  // 群系统消息
  TUIStore.unwatch(StoreName.GRP, {
    groupSystemNoticeList: onGroupSystemNoticeList,
  });
});

// 获取历史消息
const getHistoryMessageList = () => {
  isLoadMessage.value = true;
  TUIChatService.getMessageList().then((res: any) => {
    const { nextReqMessageID: ID } = res.data;
    nextReqMessageID.value = ID;
    isLoadMessage.value = false;
  });
};

const toggleApplicationList = () => {
  showGroupApplication.value = !showGroupApplication.value;
};

const handleGroupApplication = (userID: string) => {
  const index = applicationUserIDList.value.indexOf(userID);
  if (index !== -1) {
    applicationUserIDList.value.splice(index, 1);
  }
};
// todo: webview 跳转
const openComplaintLink = (type: any) => {};

// 消息操作
const handleToggleMessageItem = (
  e: any,
  message: typeof IMessageModel,
  index: number,
  isLongpress = false
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
  message: typeof IMessageModel,
  index: number,
  type: string
) => {
  if (!isH5.value) return;
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
    case "touchstart":
      touchStartHandler();
      break;
    case "touchend":
      touchEndHandler();
      setTimeout(() => {
        isLongpressing.value = false;
      }, 200);
      break;
  }
};

// 消息撤回后，编辑消息
const handleEdit = (message: typeof IMessageModel) => {
  emits("handleEditor", message, "reedit");
};

// 重发消息
const resendMessage = (message: typeof IMessageModel) => {
  reSendDialogShow.value = true;
  resendMessageData.value = message;
};

// 图片预览
// 开启图片预览
const handleImagePreview = (message: typeof IMessageModel) => {
  if (
    showImagePreview.value ||
    currentImagePreview.value ||
    isLongpressing.value
  ) {
    return;
  }
  showImagePreview.value = true;
  currentImagePreview.value = message;
};
// 关闭图片预览
const onImagePreviewerClose = () => {
  showImagePreview.value = false;
  setTimeout(() => {
    currentImagePreview.value = null;
  }, 50);
};

const resendMessageConfirm = () => {
  reSendDialogShow.value = !reSendDialogShow.value;
  const messageModel = resendMessageData.value;
  messageModel.resendMessage();
};
</script>
<style lang="scss" scoped src="./style/index.scss"></style>
