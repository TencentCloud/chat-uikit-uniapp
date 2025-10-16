import imageIconLight from '../../../../assets/icon/image-light.svg';
import imageIconDark from '../../../../assets/icon/image-dark.svg';
import imageUniIcon from '../../../../assets/icon/image-uni.png';
import cameraUniIcon from '../../../../assets/icon/camera-uni.png';
import videoIconLight from '../../../../assets/icon/video-light.svg';
import videoIconDark from '../../../../assets/icon/video-dark.svg';
import videoUniIcon from '../../../../assets/icon/video-uni.png';
import fileIconLight from '../../../../assets/icon/file-light.svg';
import fileIconDark from '../../../../assets/icon/file-dark.svg';

export const ICON_SIZE_CONFIG = {
  WEB: {
    WIDTH: '20px',
    HEIGHT: '18px',
  },
  UNI: {
    WIDTH: '32px',
    HEIGHT: '25px',
  },
};

export const TOOLBAR_ICON_MAP = {
  IMAGE_WEB_LIGHT: imageIconLight,
  IMAGE_WEB_DARK: imageIconDark,
  IMAGE_UNI: imageUniIcon,
  CAMERA_UNI: cameraUniIcon,
  VIDEO_WEB_LIGHT: videoIconLight,
  VIDEO_WEB_DARK: videoIconDark,
  VIDEO_UNI: videoUniIcon,
  FILE_WEB_LIGHT: fileIconLight,
  FILE_WEB_DARK: fileIconDark,
};

export enum UploadType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
  ALBUM = 'ALBUM',
  CAMERA = 'CAMERA',
}

export enum SourceType {
  ALBUM = 'album',
  CAMERA = 'camera',
}

export enum PlatformType {
  WEB = 'WEB',
  UNI = 'UNI',
}

export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
}

export enum ToolbarTitle {
  IMAGE = '图片',
  PHOTO = '照片',
  VIDEO = '视频',
  FILE = '文件',
  CAMERA = '拍照',
  RECORD = '录制',
  SHOOT = '拍摄',
}

export const TOOLBAR_DISPLAY_CONFIG = {
  [UploadType.IMAGE]: {
    [PlatformType.WEB]: {
      title: ToolbarTitle.IMAGE,
      getIcon: (theme: string) => theme === ThemeType.DARK ? TOOLBAR_ICON_MAP.IMAGE_WEB_DARK : TOOLBAR_ICON_MAP.IMAGE_WEB_LIGHT,
    },
    [PlatformType.UNI]: {
      title: ToolbarTitle.PHOTO,
      icon: TOOLBAR_ICON_MAP.IMAGE_UNI,
    },
  },

  [UploadType.VIDEO]: {
    [PlatformType.WEB]: {
      title: ToolbarTitle.VIDEO,
      getIcon: (theme: string) => theme === ThemeType.DARK ? TOOLBAR_ICON_MAP.VIDEO_WEB_DARK : TOOLBAR_ICON_MAP.VIDEO_WEB_LIGHT,
    },
    [PlatformType.UNI]: {
      title: ToolbarTitle.VIDEO,
      icon: TOOLBAR_ICON_MAP.VIDEO_UNI,
    },
  },

  [UploadType.FILE]: {
    [PlatformType.WEB]: {
      title: ToolbarTitle.FILE,
      getIcon: (theme: string) => theme === ThemeType.DARK ? TOOLBAR_ICON_MAP.FILE_WEB_DARK : TOOLBAR_ICON_MAP.FILE_WEB_LIGHT,
    },
  },

  [UploadType.ALBUM]: {
    [PlatformType.UNI]: {
      title: ToolbarTitle.PHOTO,
      icon: TOOLBAR_ICON_MAP.IMAGE_UNI,
    },
  },

  [UploadType.CAMERA]: {
    [PlatformType.UNI]: {
      title: ToolbarTitle.SHOOT,
      icon: TOOLBAR_ICON_MAP.CAMERA_UNI,
    },
  },
} as const;

export const MEDIA_CHOOSE_CONFIG = {
  IMAGE: {
    COUNT: 1,
    MEDIA_TYPE: [MediaType.IMAGE],
    SIZE_TYPE: ['original', 'compressed'],
  },
  VIDEO: {
    COUNT: 1,
    MEDIA_TYPE: [MediaType.VIDEO],
    MAX_DURATION: 60,
    COMPRESSED: false,
  },
  MIXED: {
    COUNT: 1,
    MEDIA_TYPE: [MediaType.IMAGE, MediaType.VIDEO],
    SIZE_TYPE: ['original', 'compressed'],
  },
};
