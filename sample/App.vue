<script lang="ts">
import { TUIChatKit } from "./TUIKit";
// 接入离线推送插件
// 可实现应用切换到后台和杀死应用的情况，收到消息或接听视频
// #ifdef APP-PLUS
const TIMPush = uni.requireNativePlugin("TencentCloud-TIMPush");
console.log(TIMPush, "---TIMPush ｜ ok");
uni.$TIMPush = TIMPush;
// #endif

TUIChatKit.init();
const SDKAppID = 0; // Your SDKAppID
const secretKey = "xxx"; //Your secretKey

uni.$chat_SDKAppID = SDKAppID;
uni.$chat_secretKey = secretKey;

// #ifdef APP-PLUS
// 接入音视频通话插件 TUICallkit,这里是客户后续需要添加的，记得删除
uni.$TUICallKit = uni.requireNativePlugin("TencentCloud-TUICallKit");
console.log(uni.$TUICallKit, "TUICallKit ｜ ok");
// #endif

export default {
 onLaunch: function () {
   // #ifdef APP-PLUS
   // 在 App.vue, 生命钩子 onLaunch 中监听
   if (typeof uni.$TIMPush === "undefined") {
     console.warn("如果您使用推送功能，需集成 TIMPush 插件，使用真机运行并且自定义基座调试，请参考官网文档：https://cloud.tencent.com/document/product/269/103522");
   } else {
    uni.$TIMPush.setOfflinePushListener((data) => {
        // 透传 entity 中的内容，不包含推送的 Message
        console.log('setOfflinePushListener', data);
    });
   }
   // #endif
 },
 
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};

</script>
<style>
/*每个页面公共css */
uni-page-body,
html,
body,
page {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
}
</style>
