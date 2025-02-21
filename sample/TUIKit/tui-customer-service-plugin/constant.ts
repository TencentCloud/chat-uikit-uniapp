// https://cloud.tencent.com/document/product/269/96058
export const CUSTOM_MESSAGE_SRC = {
  OFFICIAL_ACCOUNT: '1',
  MINI_APP: '2',
  MINI_APP_SERVICE_ACCOUNT: '3',
  BACKEND_INTERNAL: '4',
  WEB: '5',
  SESSION_MESSAGE_SLICE: '6',
  MINI_APP_AUTO: '7',
  INTERNAL: '8',
  MENU: '9',
  MENU_SELECTED: '10',
  CLIENT_STATE: '11',
  TYPING_STATE: '12',
  ROBOT: '13',
  BRANCH: '15',
  BRANCH_NUMBER: 15,
  MEMBER: '17',
  NO_SEAT_ONLINE: '18',
  END: '19',
  TIMEOUT: '20',
  FROM_INPUT: '21',
  PRODUCT_CARD: '22',
  SATISFACTION_CON: '23',
  USER_SATISFACTION: '24',
  ROBOT_MSG: '29',
  RICH_TEXT: '30',
  STREAM_TEXT: '31',
};

// im message extra type
export const IM_MESSAGE_EXTRA_TYPE = {
  INFO: 'INFO',
  ROBERT_REPLAY_PLACEHOLDER: 'ROBOT_REPLAY_PLACEHOLDER',
};

// rating template type
export const RATING_TEMPLATE_TYPE = {
  STAR: 1,
  NUMBER: 2,
};

// rating state
export const RATING_STATE = {
  NONE: 1,
  IN_PROGRESS: 2,
  DONE: 3,
};

// rating send rule
export const RATING_SEND_RULE = {
  ALLOW_AUTO_SEND: 1,
  ALLOW_SERVICE_SEND: 2,
  ALLOW_CLIENT_SEND: 4,
};

// send rating error code
export const SEND_RATING_ERROR_CODE = {
  SESSION_EXPIRED_OR_NOT_START: 10150,
  ACCESS_DATA_ERROR: 10151,
  DUPLICATE_SUBMIT: 10152,
  INTERNAL_ERROR: 10153,
  NO_STAFF: 10154,
};
// clent state
export const CLIENT_STATE = {
  ONLINE: '1',
  OFFLINE: '2',
};

// IM message type
export const IM_TYPE = {
  WEB: 'web',
  H5: 'h5',
};

// IM message status
export const IM_STATUS = {
  SUCCESS: 'success',
  FAIL: 'fail',
  UN_SEND: 'unSend',
  READ: 'read',
};

// robot command
export const ROBOT_COMMAND = {
  UPDATE_BUBBLE: 'updateBubble',
  UPDATE_SEARCH_TIPS: 'updateSearchTips',
  SHOW_DIALOG: 'showDialog',
  FEEDBACK: 'feedback',
  SELECT_RECOMMEND: 'selectRecommend',
  SELECT_SEARCH_TIP: 'selectSearchTips',
  UPDATE_BOT_STATUS: 'updateBotStatus',
};

// robot message type
export const ROBOT_MESSAGE_TYPE = {
  SIMPLE_TEXT: 'simpleText',
  RICH_TEXT: 'richText',
  MULTI_LINE_TEXT: 'multiLineText',
  CANDIDATE_ANSWER: 'candidateAnswer',
  QUESTION_LIST: 'questionList',
};

// robot status
export const ROBOT_STATUS = {
  IN: 'inBot',
  LEAVE: 'leaveBot',
};

// message type
export const TYPES = {
  MSG_CUSTOM: 'TIMCustomElem',
};
