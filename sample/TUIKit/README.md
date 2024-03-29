## 关于 chat-uikit-uniapp

chat-uikit-uniapp （vue2 / vue3）是基于腾讯云 Chat SDK 的一款 uniapp UI 组件库，它提供了一些通用的 UI 组件，包含会话、聊天、群组、关系链等功能。基于这些精心设计的 UI 组件，您可以快速构建优雅的、可靠的、可扩展的 Chat 应用。
chat-uikit-uniapp 界面效果如下图所示：
![](https://qcloudimg.tencent-cloud.cn/raw/2f16b1be0591a325250f9066af898036.png)

## chat-uikit-uniapp 支持平台

- Android
- iOS
- 微信小程序
- H5

## 含 UI 集成 TUILogin 使用说明

``` javascript
// 引入 TUILogin 模块
import { TUILogin } from '@tencentcloud/tui-core';
```
初始化登录参数 options 配置说明：
| 参数 | 类型 | 含义 |
| --- | --- | --- |
| SDKAppID | number | 云通信应用的 SDKAppID，必填 |
| userID | string | 用户 ID，必填 |
| userSig |string | 用户登录密钥，必填 |
| TIMPush | any | 推送插件实例，uniapp 打包 app 时集成推送插件可用 |
| pushConfig | object | 推送插件配置信息，uniapp 打包 app 时集成推送插件可用 |
| useUploadPlugin | boolean | 是否使用上传插件， 默认 false |
| proxyServer | string | WebSocket 服务器代理地址 |
| fileUploadProxy | string | 图片、视频、文件上传代理地址 |
| fileDownloadProxy | string | 图片、视频、文件下载代理地址 |
| framework | string \| undefined | 使用的 UI 框架，可选值： vue2、vue3、undefined，必填 |

``` javascript
// 初始化登录
TUILogin.login(options);
```

``` javascript
// 登出
TUILogin.logout();
```

``` javascript
// 设置 Chat SDK 日志输出级别
TUILogin.setLogLevel(0); // 0：普通日志级别 1：release 级别日志 2：告警级别 3：错误级别 4：无日志级别
```

``` javascript
// 获取 Chat SDK 实例
const { chat } = TUILogin.getContext();
```

## 【源码集成】[请参考 TUIKit 集成文档](https://cloud.tencent.com/document/product/269/64507)
