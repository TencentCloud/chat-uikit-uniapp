## 关于 chat-uikit-uniapp（vue2 /vue3）
chat-uikit-uniapp （vue2 /vue3）是基于腾讯云 Chat SDK 的一款 uniapp UI 组件库，它提供了一些通用的 UI 组件，包含会话、聊天、群组等功能。基于这些精心设计的 UI 组件，您可以快速构建优雅的、可靠的、可扩展的 Chat 应用。
chat-uikit-uniapp 界面效果如下图所示：
![](https://qcloudimg.tencent-cloud.cn/raw/0b21caf014aea40a96d401c68b465e9b.png)

(“音视频通话功能”暂未开放，敬请期待)

## chat-uikit-uniapp 支持平台
- Android
- iOS
- 微信小程序
- H5

## 开发环境要求
- HBuilderX
- Vue2 / Vue3
- sass（sass-loader 版本 ≤ 10.1.1）
- node（12.13.0 ≤ node 版本 ≤ 17.0.0, 推荐使用 Node.js 官方 LTS 版本 16.17.0）
- npm（版本请与 node 版本匹配）

> **注意**
> 
> HBuilderX （HBuilderX 版本 >= 3.8.4.20230531）或者升级到最新版本 
## TUIKit 源码集成

通过以下步骤发送您的第一条消息。

### 步骤1：创建项目 （已有项目可忽略）
 ![](https://qcloudimg.tencent-cloud.cn/raw/65f2b6fe9c219ff1ef9f69e096f926eb.png)
### 步骤2：下载并引入 TUIKit

通过 [npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-uniapp-vue2) 方式下载 TUIKit 并集成组件。

在 App.vue 页面引用 TUIKit 组件，为此您需要修改以下文件。

#### 1. 【工程配置】
- HBuilder 不会默认创建 package.json 文件，因此您需要先创建 package.json 文件。
请执行以下命令：
``` shell
npm init -y
```
- 在根目录下创建 vue.config.js
> **注意：**
> 
> 必须要创建此文件，否则会有 ts 警告。
``` javascript
const ScriptSetup = require('unplugin-vue2-script-setup/webpack').default;
module.exports = {
  parallel: false,
  configureWebpack: {
    plugins: [
      ScriptSetup({
        /* options */
      }),
    ],
  },
  chainWebpack(config) {
    // disable type check and let `vue-tsc` handles it
    config.plugins.delete('fork-ts-checker');
  },
};
```
> **注意：**
> 
> - 【此项目使用 ts 开发，同时也支持 js 项目直接集成】
> - 【暂时不支持 vue cli 创建的工程】
> -  打包小程序, 请在项目 mianfest.json > 微信小程序配置,勾选以下选项
> ![](https://qcloudimg.tencent-cloud.cn/raw/7be1ab6cac29853d6ad5c50fa8e3eefc.png)

#### 2.【npm 下载】

为了方便您后续的拓展，建议您将 TUIKit 组件复制到自己工程的 pages 目录下，在自己的项目目录下执行以下命令：
``` shell
# macOS
npm i @tencentcloud/chat-uikit-uniapp-vue2
```
``` shell
mkdir -p ./TUIKit && rsync -av --exclude={'node_modules','package.json','excluded-list.txt'} ./node_modules/@tencentcloud/chat-uikit-uniapp-vue2/ ./TUIKit
```
``` shell
# windows
npm i @tencentcloud/chat-uikit-uniapp-vue2
```
``` shell
xcopy .\node_modules\@tencentcloud\chat-uikit-uniapp-vue2 .\TUIKit /i /e /exclude:.\node_modules\@tencentcloud\chat-uikit-uniapp-vue2\excluded-list.txt
```


#### 3. 【main.js 文件】
``` javascript
import App from "./App";
// vue2 工程
// #ifndef VUE3
import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import unifyPromiseVue2 from "./TUIKit/utils/unifyPromiseVue2";
Vue.config.productionTip = false;
App.mpType = "app";
Vue.use(VueCompositionAPI);
unifyPromiseVue2();
const app = new Vue({
  ...App,
});
app.$mount();
// #endif
```
> **注意**
> 
> HBuilderX （HBuilderX 版本 >= 3.8.4.20230531）会默认创建 uni.promisify.adaptor ,可忽略引入

#### 4.【App.vue 文件】
``` javascript
<script lang="ts">
import { TUIChatKit, genTestUserSig } from "./TUIKit";
import { vueVersion } from "./TUIKit/adapter-vue";
import { TUILogin } from "@tencentcloud/tui-core";
// 必填信息
const config = {
  userID: "", //User ID
  SDKAppID: 0, // Your SDKAppID
  secretKey: "", // Your secretKey
};
const userSig = genTestUserSig(config).userSig;
uni.$chat_SDKAppID = config.SDKAppID;
uni.$chat_userID = config.userID;
uni.$chat_userSig = userSig;

// TUIChatKit 初始化
TUIChatKit.init();

export default {
  onLaunch: function () {
   // TUICore login
    TUILogin.login({
      SDKAppID: uni.$chat_SDKAppID,
      userID: uni.$chat_userID,
      // UserSig 是用户登录即时通信 IM 的密码，其本质是对 UserID 等信息加密后得到的密文。
      // 该方法仅适合本地跑通 Demo 和功能调试，详情请参见 https://cloud.tencent.com/document/product/269/32688     
      userSig: uni.$chat_userSig, 
      // 如果您需要发送图片、语音、视频、文件等富媒体消息，请设置为 true
      useUploadPlugin: true,
      // 本地审核可识别、处理不安全、不适宜的内容，为您的产品体验和业务安全保驾护航
      // 此功能为增值服务，请参考：https://cloud.tencent.com/document/product/269/79139
      // 如果您已购买内容审核服务，开启此功能请设置为 true
      useProfanityFilterPlugin: false,
      framework: `vue${vueVersion}` // 当前开发使用框架 vue2 / vue3
    });
  },
 onShow: function() {
      console.log('App Show')
  },
 onHide: function() {
      console.log('App Hide')
  }
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
```
#### 5.【pages.json 文件】
``` javascript
{
  "pages": [
    {
      "path": "TUIKit/components/TUIConversation/index",
      "style": {
        "navigationBarTitleText": "云通信 IM"
      }
    },
    {
      "path": "TUIKit/components/TUIChat/index",
      "style": {
        "navigationBarTitleText": "云通信 IM"
      }
    },
    {
      "path": "TUIKit/components/TUIChat/video-play"
    },
    {
      "path": "TUIKit/components/TUIContact/index",
      "style": {
        "navigationBarTitleText": "云通信 IM"
      }
    },
    {
      "path": "TUIKit/components/TUIGroup/manage-group/index",
      "style": {
        "navigationBarTitleText": "群管理"
      }
    }
  ],
  "tabBar": {
    "list": [
      {
        "pagePath": "TUIKit/components/TUIConversation/index",
        "text": "消息"
      },
      {
        "pagePath": "TUIKit/components/TUIContact/index",
        "text": "通讯录"
      }
    ]
  },
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  }
}
```
### 步骤3：获取 SDKAppID 、密钥与 userID

设置 App.vue 文件示例代码中的相关参数 SDKAppID、secretKey 以及 userID ，其中 SDKAppID 和密钥等信息，可通过 [即时通信 IM 控制台](https://console.cloud.tencent.com/im) 获取，单击目标应用卡片，进入应用的基础配置页面。例如：
![image](https://user-images.githubusercontent.com/57951148/192587785-6577cc5e-acf9-423c-86d0-52c67234ab1f.png)
userID 信息，可通过 [即时通信 IM 控制台](https://console.cloud.tencent.com/im) 进行创建和获取，单击目标应用卡片，进入应用的账号管理页面，即可创建账号并获取 userID。例如：![create user](https://user-images.githubusercontent.com/57951148/192585588-c5300d12-6bb5-45a4-831b-f7d733573840.png)

### 步骤4：运行效果
![](https://qcloudimg.tencent-cloud.cn/raw/0d01fb6e6a156fe8720ae268c1491048.png)

## 集成音视频通话 CallKit 组件
### 步骤1: 购买 uni-app 原生插件
登录 uni [原生插件市场](https://ext.dcloud.net.cn/)，在  [TencentCloud-TUICallKit](https://ext.dcloud.net.cn/plugin?id=9035) 插件 详情页中购买（免费插件也可以在插件市场0元购）。购买后才能够云端打包使用插件。购买插件时请选择正确的 appid，以及绑定正确包名。

### 步骤2: 使用自定义基座打包 uni 原生插件 （请使用真机运行自定义基座）
使用 uni 原生插件必须先提交云端打包才能生效，购买插件后在应用的 manifest.json 页面的 App原生插件配置 项下单击选择云端插件，选择腾讯云原生音视频插件。

### 步骤3：引入原生插件
在 App.vue 文件注册原生插件。
使用 uni.requireNativePlugin 在 App.vue 注册原生插件，参数为腾讯云原生音视频插件ID: TencentCloud-TUICallKit
``` javascript
uni.$TUICallKit = uni.requireNativePlugin('TencentCloud-TUICallKit');
console.log(uni.$TUICallKit, "TUICallKit ｜ ok"); // 本地日志
```
> **注意**
> 
> 更多 TUICallKit API详情可参考文档 [TUICallKit-API](https://cloud.tencent.com/document/product/647/78732)。
> TUIKit 组件目前仅支持 1v1 通话，群通话计划 9月。

### 步骤4：本地调试和发布
使用自定义基座开发调试 TencentCloud-TUICallKit 插件 后，不可直接将自定义基座 APK 作为正式版发布。
需要重新提交云端打包（不能勾选“自定义基座”）生成正式版本。

## 常见问题
### 1. 如何实现独立集成 TUIChat 组件?
请参考官网文档 [TUIChat 独立集成方案 (vue2)](https://cloud.tencent.com/document/product/269/96744)

### 2. HBuilder 报错: SyntaxError: Unexpected token '.'

如果按照以上接入步骤接入运行后，出现以下错误信息。则说明您当前的 HBuilder 版本过低，请升级至最新版本。

<img width="600" alt="截屏2023-08-11 14 28 54" src="https://github.com/TencentCloud/chat-uikit-vue/assets/57951148/28fdf9fe-5d4f-4a22-a5f0-61abd82dca66">

### 3. 运行时报错："TypeError: Cannot read properties of undefined (reading "getFriendList")"

若按照上述步骤接入后，运行时出现以下错误，请您**务必删除 TUIKit 目录下的 node_modules 目录**，以保证 TUIKit 的依赖唯一性，避免 TUIKit 多份依赖造成问题。

<img width="400" alt="image" src="https://github.com/TencentCloud/chat-uikit-vue/assets/57951148/f7c85dfe-b4bd-4c73-88d9-3a9f0d7797f2">


## 参考文档
- [常见问题(uniapp)](https://cloud.tencent.com/document/product/269/68183)
- [快速入门（uniapp / vue3）](https://cloud.tencent.com/document/product/269/64506)
- [快速入门（Web & H5）](https://cloud.tencent.com/document/product/269/68433)
- [快速入门（小程序）](https://cloud.tencent.com/document/product/269/68376)
- [chat-uikit-uniapp （vue2/ vue3） github 源码](https://github.com/TencentCloud/chat-uikit-uniapp)
- [chat-uikit-uniapp 日志](https://github.com/TencentCloud/chat-uikit-uniapp/blob/main/CHANGELOG.md)

## 技术咨询

[点此进入IM社群](https://zhiliao.qq.com/s/c5GY7HIM62CK)，享有专业工程师的支持，解决您的难题