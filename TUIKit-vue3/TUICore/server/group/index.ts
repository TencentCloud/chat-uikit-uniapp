import IComponentServer from "../IComponentServer";

import { TUIChatStoreType } from "../types";

import { useStore } from "vuex";
import store from "../../store";

/**
 * class TUIGroupServer
 *
 * TUIGroupServer 逻辑主体
 */
export default class TUIGroupServer extends IComponentServer {
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
   * 数据监听回调
   *
   * @param {any} newValue 新数据
   * @param {any} oldValue 旧数据
   */
  updateStore(newValue: any, oldValue: any) {
    this.currentStore.groupList = newValue.groupList;
    this.currentStore.searchGroup = newValue.searchGroup;
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
      uni.$TIM.EVENT.GROUP_LIST_UPDATED,
      this.handleGroupListUpdated,
      this
    );
    this.TUICore.on(
      uni.$TIM.EVENT.GROUP_ATTRIBUTES_UPDATED,
      this.handleGroupAttributesUpdated,
      this
    );
  }

  private unbindTIMEvent() {
    this.TUICore.off(
      uni.$TIM.EVENT.GROUP_LIST_UPDATED,
      this.handleGroupListUpdated
    );
    this.TUICore.off(
      uni.$TIM.EVENT.GROUP_ATTRIBUTES_UPDATED,
      this.handleGroupAttributesUpdated
    );
  }

  private handleGroupListUpdated(event: any) {}
  private handleGroupAttributesUpdated(event: any) {
    const { groupID, groupAttributes } = event.data; // 群组ID // 更新后的群属性
    console.log(groupID, groupAttributes);
  }
}
