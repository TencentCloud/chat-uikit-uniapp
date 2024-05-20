import { TUILogin } from '@tencentcloud/tui-core';
import { TUIUserService, TUIConversationService, TUIStore, StoreName } from '@tencentcloud/chat-uikit-engine';

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
      uni?.setStorage({
        key: 'userInfo',
        data: JSON.stringify({
          ...loginInfo,
          TIMPush: undefined,
          pushConfig: {},
        }),
      });
      return res;
    })
};

export const loginFromStorage = () => {
  uni?.getStorage({
    key: 'userInfo',
    success: function (res) {
      if (res.data) {
        const loginInfo = {
          ...JSON.parse(res.data)
        }
        if (uni?.$TIMPush) {
          loginInfo.TIMPush = uni?.$TIMPush;
          loginInfo.pushConfig = {
            androidConfig: uni?.$TIMPushConfigs, // Android 推送配置，如不需要可传空。
            iOSConfig: {
              iOSBusinessID: '29064', // iOS 推送配置，如不需要可传空。
            },
          }
        }
        loginChat(loginInfo).catch(() => {
          uni?.removeStorage({
            key: 'userInfo',
          });
        })
      }
    },
  });
};

export declare interface IEnterChatConfig {
  isLoginChat: boolean;
  conversationID: string;
}

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
