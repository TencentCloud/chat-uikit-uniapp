import TUICore, { TUIConstants } from '@tencentcloud/tui-core';
import {
  isCustomerServiceMessage,
  isMessageInvisible,
} from './utils/index';
import { IMessageModel } from './interface';

export default class TUICustomerServer {
  static instance: TUICustomerServer;
  private customerServiceAccounts: any[];
  constructor() {
    console.log('TUICustomerServer.init ok');
    TUICore.registerService(TUIConstants.TUICustomerServicePlugin.SERVICE.NAME, this);
    TUICore.registerExtension(TUIConstants.TUIContact.EXTENSION.CONTACT_LIST.EXT_ID, this);
    this.customerServiceAccounts = ['@customer_service_account'];
  }

  static getInstance(): TUICustomerServer {
    if (!TUICustomerServer.instance) {
      TUICustomerServer.instance = new TUICustomerServer();
    }
    return TUICustomerServer.instance;
  }

  // Set customer service number
  public setCustomerServiceAccounts(accounts: any[]) {
    this.customerServiceAccounts = accounts;
  }

  // Obtain customer service number
  public getCustomerServiceAccounts() {
    return this.customerServiceAccounts;
  }

  // Determine if the current session is a customer service session
  private isCustomerConversation(conversationID: string) {
    const userID = (conversationID && conversationID.slice(3)) || '';
    return this.customerServiceAccounts.indexOf(userID) > -1;
  }

  // Determine if the current message is a customer service message
  public isCustomerServicePluginMessage(message: IMessageModel) {
    if (!message || !this.isCustomerConversation(message.conversationID)) {
      return false;
    }
    return isCustomerServiceMessage(message) || isMessageInvisible(message);
  }

  public onGetExtension(extensionID: string) {
    if (extensionID === TUIConstants.TUIContact.EXTENSION.CONTACT_LIST.EXT_ID) {
      return [
        {
          weight: 0,
          icon: '',
          text: '客服号',
          data: {
            name: 'customer',
            accountList: this.customerServiceAccounts,
          },
        },
      ];
    }
  }

  public onCall(method: string, params: any) {
    switch (method) {
      case TUIConstants.TUICustomerServicePlugin.SERVICE.METHOD.ACTIVE_CONVERSATION:
        if (this.isCustomerConversation(params.conversationID)) {
          TUICore.callService({
            serviceName: TUIConstants.TUIChat.SERVICE.NAME,
            method: TUIConstants.TUIChat.SERVICE.METHOD.SET_CHAT_TYPE,
            params: { chatType: 'customerService' },
          });
          TUICore.callService({
            serviceName: TUIConstants.TUIChat.SERVICE.NAME,
            method: TUIConstants.TUIChat.SERVICE.METHOD.SEND_CUSTOM_MESSAGE,
            params: {
              to: params.conversationID.slice(3),
              conversationType: 'C2C',
              payload: {
                data: JSON.stringify({ src: '7', customerServicePlugin: 0 }),
              },
            },
          });
        }
        break;
    }
  }
}
