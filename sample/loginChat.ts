import { TUILogin } from '@tencentcloud/tui-core-lite';
import { TUIUserService, TUIConversationService, TUIStore, StoreName } from '@tencentcloud/chat-uikit-engine-lite';
// #ifdef APP-PLUS
import { setRegistrationID, registerPush, getRegistrationID } from '@/uni_modules/TencentCloud-Push';
import { getNotificationAuth } from './utils/getNotificationAuth';
// #endif

export const loginChat = (loginInfo) => {
  return TUILogin.login(loginInfo)
    .then((res: any) => {
      uni?.switchTab({
        url: '/TUIKit/components/TUIConversation/index',
        success: () => {
          uni?.$emit('uikitLogin', res);
        },
      });
      TUIUserService.switchUserStatus({ displayOnlineStatus: true });
      PushInit(loginInfo.userID);
      uni?.setStorage({
        key: 'userInfo',
        data: JSON.stringify({
          ...loginInfo,
          TIMPush: undefined,
          pushConfig: {},
        }),
      });
      return res;
    });
};

export const loginFromStorage = () => {
  uni?.getStorage({
    key: 'userInfo',
    success: function (res) {
      if (res.data) {
        const loginInfo = {
          ...JSON.parse(res.data),
        };
        loginChat(loginInfo).catch(() => {
          uni?.removeStorage({
            key: 'userInfo',
          });
        });
      }
    },
  });
};

export declare interface IEnterChatConfig {
  isLoginChat: boolean;
  conversationID: string;
}

export const PushInit = (userID: string) => {
  // #ifdef APP-PLUS
  getNotificationAuth();
  setRegistrationID(userID, () => {
  	console.log('PushInit | setRegistrationID ok');
  });
  registerPush(uni.$chat_SDKAppID, uni.$push_appKey, (data: any) => {
    console.log('PushInit | registerPush ok', data);
    getRegistrationID((registrationID: string) => {
      console.log('PushInit | getRegistrationID ok', registrationID);
    });
  }, (errCode: any, errMsg: any) => {
    console.error('PushInit | registerPush failed', errCode, errMsg);
  },
  );
  // #endif
};

export const openChat = (enterChatConfig: IEnterChatConfig) => {
  const { isLoginChat = false, conversationID = '' } = enterChatConfig || {};
  const chatPath = '/TUIKit/components/TUIChat/index';
  const currentConversationID = TUIStore.getData(StoreName.CONV, 'currentConversationID');
  if (!isLoginChat || !conversationID) {
    return;
  }
  if (!currentConversationID) {
    TUIConversationService.switchConversation(conversationID);
    uni?.navigateTo({
      url: chatPath,
    });
  } else if (currentConversationID !== conversationID) {
    uni.navigateBack({
      delta: 1,
      success: () => {
        TUIConversationService.switchConversation(conversationID);
        uni?.navigateTo({
          url: chatPath,
        });
      },
    });
  }
};
