import { TUILogin } from '@tencentcloud/tui-core';
import { TUIConversationService } from '@tencentcloud/chat-uikit-engine';
// #ifdef MP-WEIXIN
import { TUIChatKit } from '../../index.ts';
// #endif

export const initChat = (options: Record<string, string>) => {
  // #ifdef MP-WEIXIN
  // uni-app packages the mini program.
  // If you call TUIChatKit.init() directly during import, an error will be reported.
  // You need to init during the page onLoad.
  TUIChatKit.init();
  // #endif

  // When opening TUIChat, the options and options.conversationID parameters carried in the url,
  // determine whether to enter the Chat from the [Conversation List] or [Online Communication].
  const { chat } = TUILogin.getContext();
  if (options && options.conversationID && chat?.isReady()) {
    const { conversationID } = options;
    // verify conversationID
    if (!conversationID.startsWith('C2C') && !conversationID.startsWith('GROUP')) {
      console.warn('conversationID from options is invalid.');
      return;
    }
    // open chat
    TUIConversationService.switchConversation(conversationID);
  }
};

export const logout = (flag: boolean) => {
  if (flag) {
    return TUILogin.logout();
  }
  return Promise.resolve();
};
