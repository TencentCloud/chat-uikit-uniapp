import { customerServicePayloadType, IMessageModel } from '../interface';
import { CUSTOM_MESSAGE_SRC, TYPES } from '../constant';

// Determine if it is a JSON string
export function isJSON(str: string): boolean {
  // eslint-disable-next-line no-useless-escape
  if (typeof str === 'string') {
    try {
      const data = JSON.parse(str);
      if (data) {
        return true;
      }
      return false;
    } catch (error: any) {
      return false;
    }
  }
  return false;
}

// Determine if it is a JSON string
export function JSONToObject(str: string) {
  if (!isJSON(str)) {
    return str;
  }
  return JSON.parse(str);
}

export function isCustomerServiceMessage(message: IMessageModel): boolean {
  const customerServicePayload: customerServicePayloadType = JSONToObject(message?.payload?.data);
  return Number(customerServicePayload?.customerServicePlugin) === 0 || Number(customerServicePayload?.chatbotPlugin) === 1;
}

export const isMessageRating = (message: IMessageModel): boolean => {
  const customerServicePayload: customerServicePayloadType = JSONToObject(message?.payload?.data);
  return isCustomerServiceMessage(message) && customerServicePayload.src === CUSTOM_MESSAGE_SRC.MENU;
};

export const isMessageInvisible = (message: IMessageModel): boolean => {
  const customerServicePayload: customerServicePayloadType = JSONToObject(message?.payload?.data);
  const robotCommandArray = ['feedback', 'updateBotStatus'];
  const whiteList = [
    CUSTOM_MESSAGE_SRC.MENU,
    CUSTOM_MESSAGE_SRC.BRANCH,
    CUSTOM_MESSAGE_SRC.BRANCH_NUMBER,
    CUSTOM_MESSAGE_SRC.FROM_INPUT,
    CUSTOM_MESSAGE_SRC.PRODUCT_CARD,
  ];
  const isCustomerMessage = message?.type === TYPES.MSG_CUSTOM;
  const isExistWhiteList = whiteList.includes(customerServicePayload?.src);
  const isRobot = customerServicePayload?.src === CUSTOM_MESSAGE_SRC.ROBOT && robotCommandArray.indexOf(customerServicePayload?.content?.command) !== -1;
  return isCustomerMessage && (!isExistWhiteList || isRobot);
};
