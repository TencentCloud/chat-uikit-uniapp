import { BreakAiRobotPayload } from './interface';

export const ChatbotPlugin = 2;
export const ChatbotBreakMsgType = 22;
export const ChatbotErrorMsgType = 23;

export const breakAiRobotPayload: BreakAiRobotPayload = {
  chatbotPlugin: ChatbotPlugin,
  src: ChatbotBreakMsgType,
  msgKey: '',
};
