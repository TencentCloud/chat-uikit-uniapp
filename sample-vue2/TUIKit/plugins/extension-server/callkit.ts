import TUICore, { TUIConstants, TUILogin } from "@tencentcloud/tui-core";

export default class CallkitPluginServer {
  constructor() {
    // 监听登录成功
    TUICore.registerEvent(TUIConstants.TUILogin.EVENT.LOGIN_STATE_CHANGED, TUIConstants.TUILogin.EVENT_SUB_KEY.USER_LOGIN_SUCCESS, this);
    // 原生插件 callkit 注册通话服务
    TUICore.registerService(TUIConstants.TUICalling.SERVICE.NAME, this);
    // 原生插件 callkit 注册扩展
    TUICore.registerExtension(TUIConstants.TUIChat.EXTENSION.INPUT_MORE.EXT_ID, this);
  }

  /**
   * 监听 TUILogin.login 的成功通知后进行 callkit 登录
   */
  public onNotifyEvent(eventName: string, subKey: string) {
    if (eventName === TUIConstants.TUILogin.EVENT.LOGIN_STATE_CHANGED) {
      switch (subKey) {
        case TUIConstants.TUILogin.EVENT_SUB_KEY.USER_LOGIN_SUCCESS:
          const { SDKAppID, userID, userSig } = TUILogin.getContext();
          uni.$TUICallKit && uni.$TUICallKit.login({
            SDKAppID,
            userID,
            userSig,
          }, (res: any) => {
            if (res.code === 0) {
              console.log("TUICallkit login success!");
              // 悬浮窗功能
              uni.$TUICallKit.enableFloatWindow(true);
            } else {
              console.error(`TUICallkit login failed,${res.msg}`);
            }
          });
          break;
      }
    }
  }

  /**
   * 原生插件 callkit 实现 onGetExtension 方法
   */
  public onGetExtension(extensionID: string, params: Object) {
    if (!uni.$TUICallKit) {
      console.warn("请检查原生插件 TencentCloud-TUICallKit 是否已集成");
      return;
    }
    if (extensionID === TUIConstants.TUIChat.EXTENSION.INPUT_MORE.EXT_ID) {
      const list = [];
      const voiceCallExtension = {
        weight: 1000,
        text: '语音通话',
        icon: 'https://web.sdk.qcloud.com/component/TUIKit/assets/call.png',
        data: {
          name: 'voiceCall'
        },
        listener: {
          onClicked: (options: any) => {
            this.setCallExtension(options);
          }
        }
      };
      let videoCallExtension = {
        weight: 900,
        text: '视频通话',
        icon: 'https://web.sdk.qcloud.com/component/TUIKit/assets/call-video-reverse.svg',
        data: {
          name: 'videoCall'
        },
        listener: {
          onClicked: (options: any) => {
            this.setCallExtension(options);
          }
        }
      };
      if (!(params as any)?.filterVoice) {
        list.push(voiceCallExtension);
      }
      if (!(params as any)?.filterVideo) {
        list.push(videoCallExtension);
      }
      return list;
    }
  }

  /**
   * 原生插件 callkit 实现 onCall 方法
   */
  public onCall(method: String, params: any) {
    if (!uni.$TUICallKit) {
      console.warn("请检查原生插件 TencentCloud-TUICallKit 是否已集成");
      return;
    }
    if (method === TUIConstants.TUICalling.SERVICE.METHOD.START_CALL) {
      const { groupID = undefined, userIDList = [], type } = params;
      if (groupID) {
        uni.$TUICallKit.groupCall({
          groupID,
          userIDList,
          callMediaType: type,
        }, (res: any) => {
          if (res.code === 0) {
            console.log('TUICallkit groupCall success');
          } else {
            console.error(`TUICallkit groupCall failed,${res.msg}`);
          }
        });
      } else if (userIDList.length === 1) {
        uni.$TUICallKit.call(
          {
            userID: userIDList[0],
            callMediaType: type,
          },
          (res: any) => {
            if (res.code === 0) {
              console.log('TUICallkit call success');
            } else {
              console.log(`TUICallkit call failed,${res.msg}`);
            }
          });
      }
    }
  }

  public setCallExtension(options: any) {
    const { groupID = undefined, userIDList = [], type } = options;
    // 点击时发起通话
    try {
      if (groupID) {
        // 群通话
        uni.$TUICallKit.groupCall({
          groupID,
          userIDList,
          callMediaType: type,
        }, (res: any) => {
          if (res.code === 0) {
            console.log('TUICallkit groupCall success');
          } else {
            console.log(`TUICallkit groupCall failed,${res.msg}`);
          }
        });
      } else if (userIDList.length === 1) {
        // 1v1 通话
        uni.$TUICallKit.call(
          {
            userID: userIDList[0],
            callMediaType: type,
          },
          (res: any) => {
            if (res.code === 0) {
              console.log('TUICallkit call success');
            } else {
              console.log(`TUICallkit call failed,${res.msg}`);
            }
          }
        );
      }
    } catch (error: any) {
      uni.showToast({
        title: "拨打失败！",
        icon: "error"
      });
    }
  }
}