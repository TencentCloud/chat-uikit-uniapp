import { TUILogin } from '@tencentcloud/tui-core-lite';
import { StoreName, TUIConversationService, TUIStore, TUIUserService } from '@tencentcloud/chat-uikit-engine-lite';

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
      setEnterChatConfig({ isLoginChat: true });
      uni?.setStorage({
        key: 'userInfo',
        data: JSON.stringify(loginInfo),
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
  isLoginChat?: boolean;
  conversationID?: string;
}

export const enterChatConfig: IEnterChatConfig = {
  isLoginChat: false,
  conversationID: '',
};

export const setEnterChatConfig = (config: IEnterChatConfig) => {
  Object.assign(enterChatConfig, config);
  openChat(enterChatConfig);
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
