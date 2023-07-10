import IComponentServer from "../IComponentServer";

import { TUIChatStoreType } from "../types";

import { useStore } from "vuex";
import store from "../../store";

/**
 * class TUIProfileServer
 *
 * TUIProfile 逻辑主体
 */
export default class TUIProfileServer extends IComponentServer {
  public TUICore: any;
  public store = store.state.timStore;
  public currentStore: any = {};
  constructor(TUICore: any) {
    super();
    this.TUICore = uni.$TUIKit;
    this.bindTIMEvent();
  }

  /**
   * 组件销毁
   */
  public destroyed() {
    this.unbindTIMEvent();
  }

  /**
   * /////////////////////////////////////////////////////////////////////////////////
   * //
   * //                                    TIM 事件监听注册接口
   * //
   * /////////////////////////////////////////////////////////////////////////////////
   */

  private bindTIMEvent() {
    this.TUICore.on(
      uni.$TIM.EVENT.PROFILE_UPDATED,
      this.handleProfileUpdated,
      this
    );
  }

  private unbindTIMEvent() {
    this.TUICore.off(uni.$TIM.EVENT.PROFILE_UPDATED, this.handleProfileUpdated);
  }

  private handleProfileUpdated(event: any) {}
}
