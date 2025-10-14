const defaultFeatures = {
  DownloadFile: true,
  CopyMessage: true,
  DeleteMessage: true,
  RevokeMessage: true,
  QuoteMessage: true,
  ForwardMessage: true,
  TranslateMessage: true,
  VoiceToText: true,
  MultiSelection: true,
  EmojiReaction: true,
  InputEmoji: true,
  InputStickers: true,
  InputImage: true,
  InputVoice: true,
  InputVideo: true,
  InputFile: true,
  InputAlbum: true,
  InputCamera: true,
  InputEvaluation: true,
  InputQuickReplies: true,
  InputMention: true,
  MessageSearch: true,
  ReadStatus: true,
  ClearHistory: false,
};

enum FeaturesType {
  DownloadFile = 'DownloadFile',
  CopyMessage = 'CopyMessage',
  DeleteMessage = 'DeleteMessage',
  RevokeMessage = 'RevokeMessage',
  QuoteMessage = 'QuoteMessage',
  ForwardMessage = 'ForwardMessage',
  TranslateMessage = 'TranslateMessage',
  VoiceToText = 'VoiceToText',
  MultiSelection = 'MultiSelection',
  EmojiReaction = 'EmojiReaction',
  InputEmoji = 'InputEmoji',
  InputStickers = 'InputStickers',
  InputImage = 'InputImage',
  InputVoice = 'InputVoice',
  InputVideo = 'InputVideo',
  InputFile = 'InputFile',
  InputAlbum = 'InputAlbum',
  InputCamera = 'InputCamera',
  InputEvaluation = 'InputEvaluation',
  InputQuickReplies = 'InputQuickReplies',
  InputMention = 'InputMention',
  MessageSearch = 'MessageSearch',
  ReadStatus = 'ReadStatus',
  ClearHistory = 'ClearHistory',
}

class TUIChatConfig {
  static instance: TUIChatConfig;
  private chatType: string;
  private features: Record<string, any>;
  private theme: string;
  constructor() {
    this.chatType = '';
    this.features = JSON.parse(JSON.stringify(defaultFeatures));
    this.theme = 'light';
  }

  static getInstance(): TUIChatConfig {
    if (!TUIChatConfig.instance) {
      TUIChatConfig.instance = new TUIChatConfig();
    }
    return TUIChatConfig.instance;
  }

  setChatType(chatType: string) {
    this.chatType = chatType;
  }

  getChatType() {
    return this.chatType;
  }

  showTUIChatFeatures(features?: string[]) {
    if (!features) {
      return;
    } else {
      features.forEach((feature: string) => {
        this.features[feature] = true;
      });
    }
  }

  hideTUIChatFeatures(features: string[]) {
    if (!features) {
      return;
    }
    features.forEach((feature: string) => {
      if (this.features[feature]) {
        this.features[feature] = false;
      }
    });
  }

  getFeatureConfig(key?: string) {
    if (key) {
      return this.features[key];
    }
    return this.features;
  }

  setTheme(theme: string) {
    this.theme = theme;
  }

  getTheme() {
    return this.theme;
  }

  resetFeatureConfig() {
    this.features = JSON.parse(JSON.stringify(defaultFeatures));
  }
}

const ChatConfig = TUIChatConfig.getInstance();
const hideTUIChatFeatures = ChatConfig.hideTUIChatFeatures.bind(ChatConfig);

export {
  hideTUIChatFeatures,
  FeaturesType,
};

export default ChatConfig;
