<script lang="ts">
import { TUIChatKit } from './TUIKit';
import { TUITranslateService } from '@tencentcloud/chat-uikit-engine-lite';
// #ifndef MP-WEIXIN
import { locales } from './locales';
// #endif
// #ifdef APP-PLUS
// register TencentCloud-TIMPush
import { IEnterChatConfig, loginFromStorage, openChat } from './loginChat';
import TUIChatEngine from '@tencentcloud/chat-uikit-engine-lite';
import { EVENT, addPushListener, createNotificationChannel } from '@/uni_modules/TencentCloud-Push';
const enterChatConfig: IEnterChatConfig = {
  isLoginChat: false,
  conversationID: '',
};
const notificationChannelInfo = {
  channelID: 'tuikit', // 控制台配置 oppo 的 channelID
  channelName: 'tuikit', // 自定义名称
  channelDesc: '自定义铃音', // 自定义描述
  channelSound: 'private_ring', // 自定义铃音的名称且不需要后缀名
};
createNotificationChannel(notificationChannelInfo, () => {
  console.log('createNotificationChannel success');
});
const onNotificationClicked = (res: any) => {
  console.log('App.vue | onNotificationClicked', res);
  const { notification = '' } = res?.data || {};
  if (!notification) {
    return;
  }
  const { entity } = JSON.parse(notification);
  const type = entity.chatType === 1 ? TUIChatEngine.TYPES.CONV_C2C : TUIChatEngine.TYPES.CONV_GROUP;
  enterChatConfig.conversationID = `${type}${entity.sender}`;
  if (enterChatConfig.isLoginChat && entity.sender) {
    openChat(enterChatConfig);
  }
};
addPushListener(EVENT.NOTIFICATION_CLICKED, onNotificationClicked);

// 监听在线新消息
const onMessageReceived = (res: any) => {
  console.log('App.vue | onMessageReceived', res, JSON.stringify(res));
};
addPushListener(EVENT.MESSAGE_RECEIVED, onMessageReceived);
// 监听在线撤回消息
const onMessageRevoked = (res: any) => {
  console.log('App.vue | onMessageRevoked', res);
};
addPushListener(EVENT.MESSAGE_REVOKED, onMessageRevoked);

// register TencentCloud-TUICallKit
const TUICallKit: any = uni.requireNativePlugin('TencentCloud-TUICallKit');
console.warn(`TencentCloud-TUICallKit: uni.requireNativePlugin ${TUICallKit ? 'success' : 'fail'}`);
uni.$TUICallKit = TUICallKit;
// #endif

// #ifndef MP-WEIXIN
TUITranslateService.provideLanguages(locales);
TUITranslateService.useI18n();
// #endif

TUIChatKit.init();
const SDKAppID = 0; // Your SDKAppID
const secretKey = 'xxx'; // Your secretKey
const appKey = 'xxx'; // 客户端密钥

uni.$chat_SDKAppID = SDKAppID;
uni.$chat_secretKey = secretKey;
uni.$push_appKey = appKey;

export default {
  onLaunch: function () {
    loginFromStorage();
  },

  onShow: function () {},
  onHide: function () {},
};

</script>
<style>
/* 每个页面公共css */
uni-page-body,
html,
body,
page {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
}
</style>
