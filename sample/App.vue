<script lang="ts">
import { TUIChatKit } from './TUIKit';
import { TUITranslateService } from '@tencentcloud/chat-uikit-engine-lite';
import { loginFromStorage } from './loginChat';
// #ifndef MP-WEIXIN
import { locales } from './locales';
// #endif
// #ifdef APP-PLUS
// register TencentCloud-Push
// 避免阻塞初始化，如需使用推送功能，请取消以下注释，并创建自定义基座使用。
// import { pushService } from './pushService';
// pushService.init();

// register TencentCloud-TUICallKit
const TUICallKit: any = uni.requireNativePlugin('TencentCloud-TUICallKit');
console.warn(`TencentCloud-TUICallKit: uni.requireNativePlugin ${TUICallKit ? 'success' : 'fail'}`);
uni.$TUICallKit = TUICallKit;
// #endif

// #ifndef MP-WEIXIN
TUITranslateService.provideLanguages(locales);
TUITranslateService.useI18n();
// #endif

TUIChatKit.init();
const SDKAppID = 0; // Your SDKAppID
const secretKey = ''; // Your secretKey
const appKey = ''; // 客户端密钥（用户实现离线推送）可参考：https://cloud.tencent.com/document/product/269/103522

uni.$chat_SDKAppID = SDKAppID;
uni.$chat_secretKey = secretKey;
uni.$push_appKey = appKey;

export default {
  onLaunch: function () {
    loginFromStorage();
  },

  onShow: function () {},
  onHide: function () {},
};

</script>
<style>
/* 每个页面公共css */
uni-page-body,
html,
body,
page {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
}
</style>
