# 快速跑通 Demo 

## 关于 chat-uikit-uniapp（vue2）
chat-uikit-uniapp（vue2） 是基于腾讯云 Chat SDK 的一款 uniapp UI 组件库，它提供了一些通用的 UI 组件，包含会话、聊天、群组等功能。基于这些精心设计的 UI 组件，您可以快速构建优雅的、可靠的、可扩展的 Chat 应用。
chat-uikit-uniapp 界面效果如下图所示：
![](https://qcloudimg.tencent-cloud.cn/raw/0b21caf014aea40a96d401c68b465e9b.png)

(“TUIContact关系链功能”及“音视频通话功能”暂未开放，敬请期待)

### 快速跑通 Demo
#### 步骤 1：下载 Demo 源码并安装相关依赖

通过 `git clone` 方式下载 Demo。

```shell
# 项目根目录命令行执行
git clone https://github.com/TencentCloud/chat-uikit-uniapp.git
```
进入 Demo

```shell
cd sample-vue2
```
> **注意**
> 
> 请在项目 mianfest.json > 基础配置里边确认 Vue 版本选择。
>
> ![](https://qcloudimg.tencent-cloud.cn/raw/acd4566db21c225849fe7014346a674f.png)

HBuilder 不会默认创建 package.json 文件，因此您需要先创建 package.json 文件。请执行以下命令：
> 
> `npm init -y`

安装 Demo 依赖
```shell
npm i --legacy-peer-deps
```
#### 步骤 2：获取 SDKAppID 与 secretKey

设置 main.ts 文件示例代码中的相关参数 SDKAppID 与 secretKey 。 
SDKAppID 和 secretKey 等信息，可通过 [即时通信 IM 控制台](https://console.cloud.tencent.com/im) 获取，单击目标应用卡片，进入应用的基础配置页面。例如：  
![image](https://user-images.githubusercontent.com/57951148/192587785-6577cc5e-acf9-423c-86d0-52c67234ab1f.png)

#### 步骤 3：启动项目
在 App.vue 中填写相关信息
``` javascript
const SDKAppID = 0; // Your SDKAppID
const secretKey = ""; //Your secretKey
```
> **注意**
> 
> 请在项目 mianfest.json > 基础配置里边确认 Vue 版本选择。
>
> ![](https://qcloudimg.tencent-cloud.cn/raw/acd4566db21c225849fe7014346a674f.png)

#### 步骤4：运行效果
![](https://qcloudimg.tencent-cloud.cn/raw/0d01fb6e6a156fe8720ae268c1491048.png)

> **注意**
> 
> 请在项目 mianfest.json > 微信小程序配置,勾选以下选项
>
> ![](https://qcloudimg.tencent-cloud.cn/raw/7be1ab6cac29853d6ad5c50fa8e3eefc.png)

### 相关链接
- [@tencentcloud/chat-uikit-uniapp-vue2 npm仓库](https://www.npmjs.com/package/@tencentcloud/chat-uikit-uniapp-vue2)
- [@tencentcloud/chat-uikit-uniapp（vue3版本） npm仓库](https://www.npmjs.com/package/@tencentcloud/chat-uikit-uniapp)

### 相关文档
- [常见问题(uniapp)](https://cloud.tencent.com/document/product/269/68183)
- [快速入门（uniapp / vue3）](https://cloud.tencent.com/document/product/269/64506)
- [快速入门（Web & H5）](https://cloud.tencent.com/document/product/269/68433)
- [快速入门（小程序）](https://cloud.tencent.com/document/product/269/68376)
- [chat-uikit-uniapp （vue2/ vue3） github 源码](https://github.com/TencentCloud/chat-uikit-uniapp)
- [chat-uikit-uniapp 日志](https://github.com/TencentCloud/chat-uikit-uniapp/blob/main/CHANGELOG.md)

