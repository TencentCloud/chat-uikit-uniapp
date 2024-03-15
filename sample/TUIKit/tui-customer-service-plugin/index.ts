import TUICustomerPluginServer from './server';
import { isMessageInvisible } from './utils/index';

const TUICustomerServer = TUICustomerPluginServer.getInstance();

// 判断消息是否为客服号的自定义消息
const isCustomerServicePluginMessage = TUICustomerServer.isCustomerServicePluginMessage.bind(TUICustomerServer);
// 设置客服号
const setCustomerServiceAccounts = TUICustomerServer.setCustomerServiceAccounts.bind(TUICustomerServer);
// 获取客服号
const getCustomerServiceAccounts = TUICustomerServer.getCustomerServiceAccounts.bind(TUICustomerServer);

export {
  isCustomerServicePluginMessage,
  isMessageInvisible,
  setCustomerServiceAccounts,
  getCustomerServiceAccounts,
};
