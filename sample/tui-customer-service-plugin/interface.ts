export interface customerServicePayloadType {
  customerServicePlugin: number,
  src: string,
  content: any,
}

export interface ratingTemplateType {
  allowClientSendRating: boolean;
  effectiveHour: number;
  head: string;
  tail: string;
  type: number;
  menu: { content: string; id: string }[];
  expireTime: number;
  selected?: { content: string; id: string };
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
  atUserList: Array<string>;
  cloudCustomData: string;
  isDeleted: boolean;
  isModified: boolean;
  needReadReceipt: boolean;
  readReceiptInfo: any;
  isBroadcastMessage: boolean;
  isSupportExtension: boolean;
  receiverList?: Array<string>;
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
  [key:string]: any;
}