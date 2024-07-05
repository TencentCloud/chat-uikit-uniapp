## 关于 chat-uikit-uniapp

chat-uikit-uniapp （vue2 / vue3）是基于腾讯云 Chat SDK 的一款 uniapp UI 组件库，它提供了一些通用的 UI 组件，包含会话、聊天、群组、关系链等功能。基于这些精心设计的 UI 组件，您可以快速构建优雅的、可靠的、可扩展的 Chat 应用。

> [!IMPORTANT]
> 为尊重表情设计版权，IM Demo/TUIKit 工程中不包含大表情元素切图，正式上线商用前请您替换为自己设计或拥有版权的其他表情包。默认的小黄脸表情包版权归腾讯云所有，可有偿授权使用，如您希望获得授权可 提交工单 联系我们。
>
> 提交工单链接：https://console.cloud.tencent.com/workorder/category?level1_id=29&level2_id=40&source=14&data_title=%E5%8D%B3%E6%97%B6%E9%80%9A%E4%BF%A1%20IM&step=1

chat-uikit-uniapp 界面效果如下图所示：
![](https://qcloudimg.tencent-cloud.cn/raw/2f16b1be0591a325250f9066af898036.png)

## chat-uikit-uniapp 支持平台

- Android
- iOS
- 微信小程序
- H5

## 快速跑通DEMO

### 第一步：下载 chat-uikit-uniapp 项目并安装依赖

下载源码到你当前的工作空间 `${workspace}` 并将项目命名为 `chat-uikit-uniapp`。

切换路径到 `${workspace}/chat-uikit-uniapp/sample` 中，并下载项目依赖。

```bash
git clone https://github.com/TencentCloud/chat-uikit-uniapp.git && cd chat-uikit-uniapp/sample && npm i
```

### 第二步：通过 HBuilderX 打开项目

通过 [HBuilderX](https://dcloud.io/hbuilderx.html) 打开项目中的 sample 文件夹 `${workspace}/chat-uikit-uniapp/sample`。

### 第三步：获取 SDKAppID 与 secretKey

设置 App.vue 文件示例代码中的相关参数 SDKAppID 与 secretKey 。

SDKAppID 和 secretKey 等信息，可通过 [即时通信 IM 控制台](https://console.cloud.tencent.com/im) 获取，单击目标应用卡片，进入应用的基础配置页面。例如：  
![image](https://user-images.githubusercontent.com/57951148/192587785-6577cc5e-acf9-423c-86d0-52c67234ab1f.png)

将获得的SDKAppID和secretKey，赋值给 `${workspace}/chat-uikit-uniapp/sample/App.vue` 文件中第12行和第13行的 `SDKAppID` 和 `secretKey` 参数。

```js
const SDKAppID = 0; // Your SDKAppID
const secretKey = "xxx"; //Your secretKey
```

### 第四步：使用 HBuilderX 运行 sample

打开 HBuilderX 工具栏 -> 运行 -> 运行到小程序模拟器 -> 微信开发者工具 - [sample]。

### 第五步：使用微信开发者工具打开小程序（可选）

在第四步中，HBuilderX 编译之后可能出现无法自动拉起[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)的情况，您可以手动使用微信开发者工具打开小程序。

使用微信开发者工具打开项目 `${workspace}/chat-uikit-uniapp/sample/unpackage/dist/dev/mp-weixin` 后，手动编译小程序。

## 相关链接

[即时通信 IM 快速入门 chat-uikit-uniapp（uniapp vue2/vue3）](https://cloud.tencent.com/document/product/269/64506)
