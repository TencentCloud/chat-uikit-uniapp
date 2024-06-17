// 自定义消息类型
export const CUSTOM_MESSAGE_SRC = {
  // 公众号
  OFFICIAL_ACCOUNT: '1',
  // 小程序
  MINI_APP: '2',
  // 小程序服务号
  MINI_APP_SERVICE_ACCOUNT: '3',
  // 后台内部
  BACKEND_INTERNAL: '4',
  // 网页
  WEB: '5',
  // 会话消息分割
  SESSION_MESSAGE_SLICE: '6',
  // 小程序自动触发
  MINI_APP_AUTO: '7',
  // 内部会话
  INTERNAL: '8',
  // 菜单消息
  MENU: '9',
  // 菜单选择
  MENU_SELECTED: '10',
  // 客户端在线状态
  CLIENT_STATE: '11',
  // 输入状态
  TYPING_STATE: '12',
  // 文本机器人
  ROBOT: '13',
  // 分支消息
  BRANCH: '15',
  // 分支消息, 兼容后台返回数据
  BRANCH_NUMBER: 15,

  MEMBER: '17',
  // 没有客服在线
  NO_SEAT_ONLINE: '18',
  // 会话结束
  END: '19',
  // 超时结束
  TIMEOUT: '20',
  //
  FROM_INPUT: '21',
  // 卡片
  PRODUCT_CARD: '22',
  //
  SATISFACTION_CON: '23',
  //
  USER_SATISFACTION: '24',
};

// 对 im 消息类型的扩充
export const IM_MESSAGE_EXTRA_TYPE = {
  INFO: 'INFO',
  ROBERT_REPLAY_PLACEHOLDER: 'ROBOT_REPLAY_PLACEHOLDER',
};

// 客服满意度评价类型
export const RATING_TEMPLATE_TYPE = {
  // 星星
  STAR: 1,
  // 数字
  NUMBER: 2,
};

// 客服满意度评价状态
export const RATING_STATE = {
  NONE: 1,
  IN_PROGRESS: 2,
  DONE: 3,
};

// 客服满意度评价规则
export const RATING_SEND_RULE = {
  ALLOW_AUTO_SEND: 1,
  ALLOW_SERVICE_SEND: 2,
  ALLOW_CLIENT_SEND: 4,
};

// 发送满意度错误码
export const SEND_RATING_ERROR_CODE = {
  // 会话过期或还未开始
  SESSION_EXPIRED_OR_NOT_START: 10150,
  // 数据访问失败
  ACCESS_DATA_ERROR: 10151,
  // 重复发送评价
  DUPLICATE_SUBMIT: 10152,
  // 内部错误
  INTERNAL_ERROR: 10153,
  // 坐席还未服务
  NO_STAFF: 10154,
};
// 客户端在线状态
export const CLIENT_STATE = {
  ONLINE: '1',
  OFFLINE: '2',
};

// IM 类型
export const IM_TYPE = {
  WEB: 'web',
  H5: 'h5',
};

// IM 消息状态
export const IM_STATUS = {
  SUCCESS: 'success',
  FAIL: 'fail',
  UN_SEND: 'unSend',
  READ: 'read',
};

// 文本机器人指令
export const ROBOT_COMMAND = {
  UPDATE_BUBBLE: 'updateBubble',
  UPDATE_SEARCH_TIPS: 'updateSearchTips',
  SHOW_DIALOG: 'showDialog',
  FEEDBACK: 'feedback',
  SELECT_RECOMMEND: 'selectRecommend',
  SELECT_SEARCH_TIP: 'selectSearchTips',
  UPDATE_BOT_STATUS: 'updateBotStatus',
};

// 文本机器人消息类型
export const ROBOT_MESSAGE_TYPE = {
  SIMPLE_TEXT: 'simpleText',
  RICH_TEXT: 'richText',
  MULTI_LINE_TEXT: 'multiLineText',
  CANDIDATE_ANSWER: 'candidateAnswer',
  QUESTION_LIST: 'questionList',
};

// 文本机器人状态
export const ROBOT_STATUS = {
  IN: 'inBot',
  LEAVE: 'leaveBot',
};

// 消息类型
export const TYPES = {
  MSG_CUSTOM: 'TIMCustomElem',
};
