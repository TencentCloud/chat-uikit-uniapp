import { TUIGlobal } from "@tencentcloud/chat-uikit-engine";
const configureWebpack = {};
if (TUIGlobal.getPlatform() === "wechat") {
  configureWebpack.externals = {
    "tim-wx-sdk": "commonjs tim-wx-sdk",
  };
}
export { configureWebpack };
