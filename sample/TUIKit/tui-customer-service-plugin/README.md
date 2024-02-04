## 简介
tui-customer-service-plugin 是基于 uikit 的客服插件，专为企业客服人员设计，用于为客户提供咨询解答服务。它具备丰富的功能，如消息快速回复、自动回复、访客信息查看、营销数据分析、客户管理等，并且支持多渠道接入，可以实现多样化集成。 在电商行业中，客服插件的功能更加贴合电商行业的特点，例如购物车信息互通、链接自动识别、多店铺管理等功能。它具有以下优势：
 - 提高客服效率：客服插件可以快速回复客户的问题，并且支持自动回复功能，可以大大减少客服人员的工作量；
 - 提升客户体验：客服插件可以实时显示客户信息，方便客服人员了解客户需求，提供更加精准的服务，提升客户体验；
 - 加强客户管理：客服插件可以记录客户的历史对话内容，方便了解客户的需求和反馈，提升客户管理水平；
 - 优化营销策略：客服插件可以收集客户的意见和建议，帮助企业优化营销策略，提升营销效果。


### 前提条件
集成 @tencentcloud/chat-uikit-vue2 ≥ 0.1.6 / @tencentcloud/chat-uikit-vue3 ≥ 0.1.6 或@tencentcloud/chat-uikit-uniapp
 ≥ 0.1.6
> 如未集成，请务必先根据 [Vue2 版本 TUIKit 快速集成指引](https://cloud.tencent.com/document/product/269/68493)、[Vue3 版本 TUIKit 快速集成指引](https://cloud.tencent.com/document/product/269/68493) 或 [uniapp 版本 TUIKit 快速集成指引](https://cloud.tencent.com/document/product/269/64507) 进行集成。<br />
> 如已集成，请务必升级版本 ≥ 0.1.6.


## 快速集成

### 步骤1：接入 chat-uikit-vue2 / chat-uikit-vue3 或 chat-uikit-uniapp

已集成  @tencentcloud/chat-uikit-vue2 ≥ 0.1.6 / @tencentcloud/chat-uikit-vue3 ≥ 0.1.6 / @tencentcloud/chat-uikit-uniapp ≥ 0.1.6 请忽略此步骤。
如未集成，首先请您跟随指引 [Vue2 版本 TUIKit 快速集成指引](https://cloud.tencent.com/document/product/269/68493)、[Vue3 版本 TUIKit 快速集成指引](https://cloud.tencent.com/document/product/269/68493) 或 [uniapp 版本 TUIKit 快速集成指引](https://cloud.tencent.com/document/product/269/64507)的集成。
TUIKit Demo 登录成功后，如果您已经开通了客服插件，可以直接体验 Demo 的客服号 “线上商城”和 “线上医疗问诊”。

如果您需要创建属于自己的客服号，可以参见后续步骤操作。


### 步骤2：控制台开通客服插件

请单击 [插件市场 > 客服插件](https://console.cloud.tencent.com/im/plugin/DesKKit) 免费试用或购买插件。详情请参见：[插件市场 > 概述与开通指引](https://cloud.tencent.com/document/product/269/92648)。

>!注意：<br/>
    每个插件限免费试用 1 次，有效期 7 天，试用结束后将停服，请提前购买。


## 自定义客服号
详见: [在线客服插件](https://cloud.tencent.com/document/product/269/102783)