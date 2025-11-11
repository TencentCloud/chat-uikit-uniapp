import { ref, computed } from '../../../../adapter-vue';
import { TUIStore, StoreName, IConversationModel } from '@tencentcloud/chat-uikit-engine-lite';
import { TUIGlobal } from '@tencentcloud/universal-api';
import { isPC, isUniFrameWork } from '../../../../utils/env';
import TUIChatConfig from '../../config';
import {
  TOOLBAR_DISPLAY_CONFIG,
  ICON_SIZE_CONFIG,
  MEDIA_CHOOSE_CONFIG,
  UploadType,
  SourceType,
  PlatformType,
} from './constants';
import {
  sendImageMessage,
  sendVideoMessage,
  sendFileMessage,
  handleWebFileSelect,
} from './utils';

export function genSourceType(uploadType: UploadType): SourceType {
  if (uploadType === UploadType.CAMERA) {
    return SourceType.CAMERA;
  }
  return SourceType.ALBUM;
}

export function useUpload(uploadType: UploadType) {
  const inputRef = ref();
  const currentConversation = ref<IConversationModel>();
  const theme = TUIChatConfig.getTheme();

  TUIStore.watch(StoreName.CONV, {
    currentConversation: (conversation: IConversationModel) => {
      currentConversation.value = conversation;
    },
  });

  const sourceType = genSourceType(uploadType);

  const toolbarConfig = computed(() => {
    const config = TOOLBAR_DISPLAY_CONFIG[uploadType];

    if (isUniFrameWork) {
      const displayConfig = (config as any)[PlatformType.UNI];

      return {
        icon: displayConfig.icon,
        title: displayConfig.title,
        iconWidth: ICON_SIZE_CONFIG.UNI.WIDTH,
        iconHeight: ICON_SIZE_CONFIG.UNI.HEIGHT,
      };
    } else {
      const displayConfig = (config as any)[PlatformType.WEB];

      return {
        icon: displayConfig.getIcon ? displayConfig.getIcon(theme) : displayConfig.icon,
        title: displayConfig.title,
        iconWidth: ICON_SIZE_CONFIG.WEB.WIDTH,
        iconHeight: ICON_SIZE_CONFIG.WEB.HEIGHT,
      };
    }
  });

  const handleIconClick = () => {
    if (isUniFrameWork) {
      handleUniAppClick();
    } else {
      handleWebClick();
    }
  };

  const handleUniAppClick = () => {
    switch (uploadType) {
      case UploadType.IMAGE:
        chooseImageInUniApp();
        break;
      case UploadType.VIDEO:
        chooseVideoInUniApp();
        break;
      case UploadType.ALBUM:
        chooseMediaInUniApp();
        break;
      case UploadType.CAMERA:
        chooseCameraInUniApp();
        break;
      default:
        break;
    }
  };

  const handleWebClick = () => {
    if (inputRef.value?.click) {
      inputRef.value.click();
    }
  };

  const chooseImageInUniApp = () => {
    TUIGlobal?.chooseImage({
      count: MEDIA_CHOOSE_CONFIG.IMAGE.COUNT,
      sourceType: [sourceType],
      success: function (res: Record<string, any>) {
        if (currentConversation.value) {
          sendImageMessage(currentConversation.value, res);
        }
      },
    });
  };

  const chooseVideoInUniApp = () => {
    TUIGlobal?.chooseVideo({
      count: MEDIA_CHOOSE_CONFIG.VIDEO.COUNT,
      sourceType: [sourceType],
      compressed: MEDIA_CHOOSE_CONFIG.VIDEO.COMPRESSED,
      success: function (res: Record<string, any>) {
        if (currentConversation.value) {
          sendVideoMessage(currentConversation.value, res);
        }
      },
    });
  };

  const chooseMediaInUniApp = () => {
    TUIGlobal?.chooseImage({
      count: MEDIA_CHOOSE_CONFIG.IMAGE.COUNT,
      sourceType: [SourceType.ALBUM, SourceType.CAMERA],
      success: function (res: Record<string, any>) {
        if (currentConversation.value) {
          sendImageMessage(currentConversation.value, res);
        }
      },
    });
  };

  const chooseCameraInUniApp = () => {
    TUIGlobal?.chooseVideo({
      count: MEDIA_CHOOSE_CONFIG.VIDEO.COUNT,
      sourceType: [SourceType.ALBUM, SourceType.CAMERA],
      compressed: MEDIA_CHOOSE_CONFIG.VIDEO.COMPRESSED,
      success: function (res: Record<string, any>) {
        if (currentConversation.value) {
          sendVideoMessage(currentConversation.value, res);
        }
      },
    });
  };

  const handleWebFileChange = (event: Event) => {
    switch (uploadType) {
      case UploadType.IMAGE:
        handleWebFileSelect(event, (file) => {
          if (currentConversation.value) {
            sendImageMessage(currentConversation.value, file);
          }
        });
        break;
      case UploadType.VIDEO:
        handleWebFileSelect(event, (file) => {
          if (currentConversation.value) {
            sendVideoMessage(currentConversation.value, file);
          }
        });
        break;
      case UploadType.FILE:
        handleWebFileSelect(event, (file) => {
          if (currentConversation.value) {
            sendFileMessage(currentConversation.value, file);
          }
        });
        break;
    }
  };

  return {
    inputRef,
    currentConversation,
    toolbarConfig,
    isPC,
    isUniFrameWork,
    handleIconClick,
    handleWebFileChange,
  };
}
