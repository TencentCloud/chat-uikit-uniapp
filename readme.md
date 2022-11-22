## 关于 chat-uikit-uniapp

chat-uikit-uniapp 是基于腾讯云 IM SDK 的一款 uniapp UI 组件库，它提供了一些通用的 UI 组件，包含会话、聊天、群组等功能。基于 UI 组件您可以像搭积木一样快速搭建起自己的业务逻辑。
chat-uikit-uniapp 界面效果如下图所示：
![](https://user-images.githubusercontent.com/37072197/201026468-96ec361a-4ba4-4535-842a-79e31d894834.png)

## chat-uikit-uniapp 支持平台

- Android
- iOS
- 微信小程序
- H5

## 发送您的第一条消息

### 开发环境要求

- HBuilderX
- Vue 3
- TypeScript
- sass（sass-loader 版本 <= 10.1.1）
- node（12.13.0 <= node 版本 <= 17.0.0, 推荐使用 Node.js 官方 LTS 版本 16.17.0）
- npm（版本请与 node 版本匹配）

### TUIKit 源码集成

#### 步骤 1：创建项目 （已有项目可忽略）

<img width="800" src="https://qcloudimg.tencent-cloud.cn/raw/37fbf00a489a5145b801784428d62b06.png"/>

> !
> 请在项目 mianfest.json => 基础配置里边确认 Vue3 版本选择
> ![](https://qcloudimg.tencent-cloud.cn/raw/456a65bd270b69ed6e8e9efe7c859ee4.png)

HBuilder 不会默认创建 package.json 文件，因此您需要先创建 package.json 文件。请执行以下命令:

```shell
npm init -y
```

#### 步骤 2：下载 TUIKit 组件

通过 [npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-uniapp) 方式下载 TUIKit 组件。
为了方便您后续的拓展，建议您将 TUIKit 组件复制到自己工程的 pages 目录下，在自己的项目目录下执行以下命令：

```shell
# macOS
npm i @tencentcloud/chat-uikit-uniapp
```

```shell
mkdir -p ./pages/TUIKit && cp -r ./node_modules/@tencentcloud/chat-uikit-uniapp/ ./pages/TUIKit
```

```shell
# windows
npm i @tencentcloud\chat-uikit-uniapp && xcopy .\node_modules\@tencentcloud\chat-uikit-uniapp .\pages\TUIKit /i /e
```

成功后目录结构如图所示：  
<img width="400" src="https://qcloudimg.tencent-cloud.cn/raw/4fa9ed4257ddf85a0a0bfe9a55dfe983.png"/>

#### 步骤 3：引入 TUIKit 组件

在 App.vue 文件引用 TUIKit 组件

```javascript
<script>
import { TIM, TIMUploadPlugin, Aegis} from './pages/TUIKit/debug/tim.js';
import { genTestUserSig, aegisID } from "./pages/TUIKit/debug/index.js";
const aegis = new Aegis({
	id: aegisID, // 项目key
	reportApiSpeed: true, // 接口测速
});
uni.$aegis = aegis;

const config = {
  userID: "", //User ID
  SDKAppID: 0, // Your SDKAppID
  secretKey: "", // Your secretKey
};
uni.$chat_SDKAppID = config.SDKAppID;
const userSig = genTestUserSig(config).userSig;
// 创建 sdk 实例
uni.$TUIKit = TIM.create({
  SDKAppID: uni.$chat_SDKAppID,
});
uni.$TIM = TIM;
// 注册文件上传插件
// #ifdef MP-WEIXIN || H5
uni.$TUIKit.registerPlugin({
  "tim-upload-plugin": TIMUploadPlugin,
});
// #endif
// #ifdef APP-PLUS
uni.$TUIKit.registerPlugin({
  "cos-wx-sdk": TIMUploadPlugin,
});
// #endif
export default {
  onLaunch: function () {
    this.bindTIMEvent();
    this.login();
  },
  methods: {
    login() {
      // login TUIKit
      uni.$TUIKit.login({ userID: config.userID, userSig }).then((res) => {
        // sdk 初始化，当 sdk 处于ready 状态，才可以使用API，文档
        uni.showLoading({
          title: "初始化...",
        });
      });
    },
    bindTIMEvent() {
      uni.$TUIKit.on(uni.$TIM.EVENT.SDK_READY, this.handleSDKReady);
      uni.$TUIKit.on(uni.$TIM.EVENT.SDK_NOT_READY,this.handleSDKNotReady);
      uni.$TUIKit.on(uni.$TIM.EVENT.KICKED_OUT, this.handleKickedOut);
    },
    // sdk ready 以后可调用 API
    handleSDKReady(event) {
      uni.setStorageSync('$chat_SDKReady', true);
      uni.hideLoading();
    },
    handleSDKNotReady(event) {
      uni.showToast({
        title: "SDK 未完成初始化",
      });
    },

    handleKickedOut(event) {
      uni.clearStorageSync();
      uni.showToast({
        title: `${this.kickedOutReason(event.data.type)}被踢出，请重新登录。`,
        icon: "none",
      });
    },

    kickedOutReason(type) {
      switch (type) {
        case uni.$TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
          return "由于多实例登录";
        case uni.$TIM.TYPES.KICKED_OUT_MULT_DEVICE:
          return "由于多设备登录";
        case uni.$TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
          return "由于 userSig 过期";
        case uni.$TIM.TYPES.KICKED_OUT_REST_API:
          return "由于 REST API kick 接口踢出";
        default:
          return "";
      }
    },
  },
};
</script>

<style>
/*每个页面公共css */
</style>
```

#### 步骤 4：配置 pages 路由

在 pages.json 文件中的更新 pages 路由：

```javascript
{
  "pages": [
    {
      "path": "pages/TUIKit/TUIPages/TUIConversation/index",
      "style": {
        "navigationBarTitleText": "云通信 IM",
        "app-plus": {
        }
      }
    },
    {
      "path": "pages/TUIKit/TUIPages/TUIConversation/create",
      "style": {
        "navigationBarTitleText": "选择联系人",
        "app-plus": {
          "scrollIndicator": "none"
        }
      }
    },
    {
      "path": "pages/TUIKit/TUIPages/TUIChat/index",
      "style": {
        "navigationBarTitleText": "云通信 IM",
        "app-plus": {
          "scrollIndicator": "none", // 当前页面不显示滚动条
          "softinputNavBar": "none", // App平台在iOS上，webview中的软键盘弹出时，默认在软键盘上方有一个横条，显示着：上一项、下一项和完成等按钮
          "bounce": "none", // 页面回弹
        }
      }
    },
    {
      "path": "pages/TUIKit/TUIPages/TUIMine/index",
      "style": {
        "navigationBarTitleText": "我的",
        "app-plus": {}
      }
    },
    {
      "path": "pages/TUIKit/TUIPages/TUIChat/components/message-elements/video-play",
      "style": {
        "navigationBarTitleText": "云通信 IM",
        "app-plus": {}
      }
    },
    {
      "path": "pages/TUIKit/TUIPages/TUIGroup/index",
      "style": {
        "navigationBarTitleText": "群管理",
        "app-plus": {
          "scrollIndicator": "none"
        }
      }
    },
    {
      "path": "pages/TUIKit/TUIPages/TUIGroup/memberOperate",
      "style": {
        "app-plus": {}
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  }
}
```

#### 步骤 4： 获取 SDKAppID 、密钥与 userID

设置 App.vue 文件示例代码中的相关参数 SDKAppID、secretKey 以及 userID ，其中 SDKAppID 和密钥等信息，可通过 [即时通信 IM 控制台](https://console.cloud.tencent.com/im) 获取，单击目标应用卡片，进入应用的基础配置页面。例如：
![image](https://user-images.githubusercontent.com/57951148/192587785-6577cc5e-acf9-423c-86d0-52c67234ab1f.png)
userID 信息，可通过 [即时通信 IM 控制台](https://console.cloud.tencent.com/im) 进行创建和获取，单击目标应用卡片，进入应用的账号管理页面，即可创建账号并获取 userID。例如：  
![create user](https://user-images.githubusercontent.com/57951148/192585588-c5300d12-6bb5-45a4-831b-f7d733573840.png)

#### 步骤 5：运行效果

![](https://qcloudimg.tencent-cloud.cn/raw/06ccb31cb4dd0ae0d93a15794f63bb81.png)

### 技术咨询

了解更多详情您可 QQ 咨询：<dx-tag-link link="#QQ" tag="技术交流群">309869925</dx-tag-link>

### 更多高级特性

#### 接入音视频通话能力

请参考官网文档 [TUICallKit 集成方案](https://cloud.tencent.com/document/product/647/78742)

### 接入离线推送能力

在 APP 中集成离线推送能力，请参考官网文档 [uni-app 离线推送](https://cloud.tencent.com/document/product/269/79124)

### 常见问题

#### 1. 什么是 UserSig？

UserSig 是用户登录即时通信 IM 的密码，其本质是对 UserID 等信息加密后得到的密文。

#### 2. 如何生成 UserSig？

UserSig 签发方式是将 UserSig 的计算代码集成到您的服务端，并提供面向项目的接口，在需要 UserSig 时由您的项目向业务服务器发起请求获取动态 UserSig。更多详情请参见 [服务端生成 UserSig](https://cloud.tencent.com/document/product/269/32688#GeneratingdynamicUserSig)。

> !
>
> 本文示例代码采用的获取 UserSig 的方案是在客户端代码中配置 SECRETKEY，该方法中 SECRETKEY 很容易被反编译逆向破解，一旦您的密钥泄露，攻击者就可以盗用您的腾讯云流量，因此**该方法仅适合本地跑通功能调试**。 正确的 UserSig 签发方式请参见上文。

#### 3. 运行在小程序端：选择运行时压缩代码

<img src="https://qcloudimg.tencent-cloud.cn/raw/ad80a950f32f702fb8ef20ddcc7308a9.png" width="600"/>

#### 4. 运行在小程序端出现异常报错

可能和微信开发者工具版本有关，请使用最新的开发者工具，以及确认稳定的调试基础库版本。
