import { TUIGlobal } from "../../../utils/universal-api/index";
import TOAST_TYPE from "./type";

const Toast = (options: {
  message: string;
  type: string;
  duration?: number;
}): void => {
  TUIGlobal.showToast({
    title: options.message || "Toast",
    duration: options.duration || 2000,
    icon: handleIconType(options.type),
  });
};

const handleIconType = (type: string) => {
  if (!type) {
    return "none";
  }
  switch (type) {
    case TOAST_TYPE.ERROR:
      return "none";
    case TOAST_TYPE.WARNING:
      return "none";
    case TOAST_TYPE.SUCCESS:
      return "success";
    case TOAST_TYPE.NORMAL:
      return "none";
    default:
      return "none";
  }
};

export { Toast, TOAST_TYPE };
