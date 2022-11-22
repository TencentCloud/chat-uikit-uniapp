// #ifdef APP-PLUS
import TIM from "tim-wx-sdk";
import COS from "cos-wx-sdk-v5";
import Aegis from "aegis-weex-sdk";
export { TIM, COS as TIMUploadPlugin, Aegis };
// #endif

// #ifdef H5
import TIM from "tim-js-sdk";
import TIMUploadPlugin from "tim-upload-plugin";
import Aegis from "aegis-web-sdk";
export { TIM, TIMUploadPlugin, Aegis };

// #endif

// #ifdef MP-WEIXIN
import TIM from "tim-wx-sdk";
import TIMUploadPlugin from "tim-upload-plugin";
import Aegis from "aegis-mp-sdk";
export { TIM, TIMUploadPlugin, Aegis };
// #endif
