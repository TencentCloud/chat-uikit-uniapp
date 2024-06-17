export interface customerServicePayloadType {
  chatbotPlugin?: number | string;
  customerServicePlugin?: number | string;
  src: string | number;
  content: any;
}

interface IMenuItem {
  content: string;
  id: string;
}

export interface ratingTemplateType {
  allowClientSendRating: boolean;
  effectiveHour: number;
  head: string;
  tail: string;
  type: number;
  menu: IMenuItem[];
  expireTime: number;
  selected?: IMenuItem;
  sessionId?: string;
}

export interface TextMessagePayload {
  text: string;
}

export interface CustomMessagePayload {
  data: string;
  description: string;
  extension: string;
}

export interface IMessageModel {
  ID: string;
  type: string;
  payload: any;
  conversationID: string;
  conversationType: string;
  to: string;
  from: string;
  flow: string;
  time: number;
  status: string;
  isRevoked: boolean;
  priority: string;
  nick: string;
  avatar: string;
  isPeerRead: boolean;
  nameCard: string;
  atUserList: string[];
  cloudCustomData: string;
  isDeleted: boolean;
  isModified: boolean;
  needReadReceipt: boolean;
  readReceiptInfo: any;
  isBroadcastMessage: boolean;
  isSupportExtension: boolean;
  receiverList?: string[];
  revoker: string;
  sequence: number;
  progress: number;
  revokerInfo: {
    userID: string;
    nick: string;
    avatar: string;
  };
  revokeReason: string;
  hasRiskContent: boolean;
  [key: string]: any;
}
