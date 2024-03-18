import { TUIGlobal } from '@tencentcloud/universal-api';
import TOAST_TYPE from './type';

interface IToast {
  message: string;
  type?: string;
  duration?: number;
}

const Toast = (options: IToast): void => {
  TUIGlobal.showToast({
    title: options.message || 'Toast',
    duration: options.duration || 1500,
    icon: handleIconType(options.type),
  });
};

const handleIconType = (type: string | undefined) => {
  if (!type) {
    return 'none';
  }
  switch (type) {
    case TOAST_TYPE.ERROR:
      return 'none';
    case TOAST_TYPE.WARNING:
      return 'none';
    case TOAST_TYPE.SUCCESS:
      return 'success';
    case TOAST_TYPE.NORMAL:
      return 'none';
    default:
      return 'none';
  }
};

export { Toast, TOAST_TYPE };
