// TencentCloud-Push 推送服务独立模块
import TUIChatEngine from '@tencentcloud/chat-uikit-engine-lite';
import { TUIConstants, TUICore, TUILogin } from '@tencentcloud/tui-core-lite';
import {
  EVENT,
  addPushListener,
  createNotificationChannel,
  setRegistrationID,
  registerPush,
  getRegistrationID,
  unRegisterPush,
  removePushListener,
} from '@/uni_modules/TencentCloud-Push';
import { getNotificationAuth } from './utils/getNotificationAuth';
import { setEnterChatConfig } from './loginChat';

interface NotificationChannelInfo {
  channelID: string;
  channelName: string;
  channelDesc: string;
  channelSound: string;
}

class PushService {
  static instance: PushService;
  private notificationChannelInfo: NotificationChannelInfo;
  private isInitialized: boolean = false;

  constructor() {
    this.notificationChannelInfo = {
      channelID: 'tuikit', // 控制台配置 oppo 的 channelID
      channelName: 'tuikit', // 自定义名称
      channelDesc: '自定义铃音', // 自定义描述
      channelSound: 'private_ring', // 自定义铃音的名称且不需要后缀名
    };
  }

  static getInstance(): PushService {
    if (!PushService.instance) {
      PushService.instance = new PushService();
    }
    return PushService.instance;
  }

  public init() {
    if (this.isInitialized) {
      console.warn('PushService already initialized');
      return;
    }
    this.initNotificationChannel();
    this.initPushListeners();
    this.isInitialized = true;
    console.log('PushService initialized successfully');
    TUICore.registerEvent(
      TUIConstants.TUILogin.EVENT.LOGIN_STATE_CHANGED,
      TUIConstants.TUILogin.EVENT_SUB_KEY.USER_LOGIN_SUCCESS,
      this,
    );
  }

  /**
   * @param { TUIInitParam } params
   */
  public onNotifyEvent(eventName: string, subKey: string) {
    if (eventName === TUIConstants.TUILogin.EVENT.LOGIN_STATE_CHANGED) {
      switch (subKey) {
        case TUIConstants.TUILogin.EVENT_SUB_KEY.USER_LOGIN_SUCCESS:
          this.login(TUILogin.getContext().userID);
          break;
        case TUIConstants.TUILogin.EVENT_SUB_KEY.USER_LOGOUT_SUCCESS:
          this.logout();
          break;
        default:
          break;
      }
    }
  }

  private login(userID: string) {
    if (!uni.$chat_SDKAppID || !uni.$push_appKey) {
      return;
    }
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
    });
  }

  private logout() {
    this.reset();
    unRegisterPush(() => {
      console.log('PushInit | unRegisterPush ok');
    });
  }

  private initNotificationChannel(): void {
    createNotificationChannel(this.notificationChannelInfo, () => {
      console.log('createNotificationChannel success');
    });
  }

  private onNotificationClicked = (res: any): void => {
    console.log('PushService | onNotificationClicked', res);
    const notification = res?.data || {};
    if (!notification) {
      return;
    }
    try {
      const parsedNotification = JSON.parse(notification);
      if (!parsedNotification || !parsedNotification.entity) {
        return;
      }
      const { entity } = parsedNotification;
      const type = entity.chatType === 1 ? TUIChatEngine.TYPES.CONV_C2C : TUIChatEngine.TYPES.CONV_GROUP;
      setEnterChatConfig({
        conversationID: `${type}${entity.sender}`,
      });
    } catch (error) {
      console.error('PushService | onNotificationClicked error', error);
    }
  };

  private onMessageReceived = (res: any): void => {
    console.log('PushService | onMessageReceived', res, JSON.stringify(res));
  };

  private onMessageRevoked = (res: any): void => {
    console.log('PushService | onMessageRevoked', res);
  };

  private initPushListeners(): void {
    addPushListener(EVENT.NOTIFICATION_CLICKED, this.onNotificationClicked);
    addPushListener(EVENT.MESSAGE_RECEIVED, this.onMessageReceived);
    addPushListener(EVENT.MESSAGE_REVOKED, this.onMessageRevoked);
  }

  private reset(): void {
    this.isInitialized = false;
    removePushListener(EVENT.NOTIFICATION_CLICKED, this.onNotificationClicked);
    removePushListener(EVENT.MESSAGE_RECEIVED, this.onMessageReceived);
    removePushListener(EVENT.MESSAGE_REVOKED, this.onMessageRevoked);
    setEnterChatConfig({
      isLoginChat: false,
      conversationID: '',
    });
    console.log('PushService reset');
  }
}

export const pushService = PushService.getInstance();
