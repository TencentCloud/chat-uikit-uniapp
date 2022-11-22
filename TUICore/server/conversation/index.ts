import IComponentServer from "../IComponentServer";
import { useStore } from "vuex";
import store from "../../store";

/**
 * class TUIConversationServer
 *
 * TUIConversation 逻辑主体
 */
export default class TUIConversationServer extends IComponentServer {
  public TUICore: any;
  public store = store.state.timStore;
  constructor(TUICore: any) {
    super();
    this.TUICore = uni.$TUIKit;
		uni.setStorageSync(`TIM_${uni.$chat_SDKAppID}_isTUIKit`, true);
		// #ifdef  APP-PLUS
		if (uni.$aegis) {
			uni.$aegis.reportEvent({
				name: 'platform',
				ext1: 'platform-APP-npm',
				ext2: 'uniTuikitExternalVue3',
				ext3: `${uni.$chat_SDKAppID}`,
			})
		}
		// #endif
	
		// #ifdef MP-WEIXIN  
		if (uni.$aegis) {
			uni.$aegis.reportEvent({
				name: 'platform',
				ext1: 'platform-MP-WEIXIN',
				ext2: 'uniTuikitExternalVue3',
				ext3: `${uni.$chat_SDKAppID}`,
			})
		}
		// #endif
		
		// #ifdef H5
		if (uni.$aegis) {
			uni.$aegis.reportEvent({
				name: 'platform',
				ext1: 'platform-H5-npm',
				ext2: 'uniTuikitExternalVue3',
				ext3: `${uni.$chat_SDKAppID}`,
			})
		}
		// #endif
    uni.showLoading({ title: '加载中' });
    this.bindTIMEvent();
		//this.getConversationList();
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
      uni.$TIM.EVENT.CONVERSATION_LIST_UPDATED,
      this.handleConversationListUpdate,
      this
    );
  }

  private unbindTIMEvent() {
    this.TUICore.off(
      uni.$TIM.EVENT.CONVERSATION_LIST_UPDATED,
      this.handleConversationListUpdate
    );
  }

  public handleConversationListUpdate(res: any) {
    uni.hideLoading();
    if (res.data.length === 0) {
      uni.showToast({
        title: "暂无回话哦～",
      });
    }
    store.commit("timStore/setConversationList", res.data);
  }

  /**
   * 组件销毁
   *
   */
  public destroyed() {
    this.unbindTIMEvent();
  }

  /*
   * 获取 conversationList
   *
   * @returns {Promise}
   */
  private async getConversationList() {
    return new Promise<void>(async (resolve, reject) => {
			try {
			    const imResponse = await uni.$TUIKit.getConversationList();
				  store.commit("timStore/setConversationList", imResponse.data.conversationList);
					uni.hideLoading();
			    resolve(imResponse);
			  } catch (error) {
			    reject(error);
			  }
			})
  }

  /**
   * 获取 conversationList
   *
   * @param {string} conversationID 会话ID
   * @returns {Promise}
   */
  public async getConversationProfile(conversationID: string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const imResponse = await this.TUICore.getConversationProfile(
          conversationID
        );
        resolve(imResponse);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 删除会话
   *
   * @param {string} conversationID 会话ID
   * @returns {Promise}
   */

  public async deleteConversation(conversationID: string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const imResponse: any = await this.TUICore.deleteConversation(
          conversationID
        );
        resolve(imResponse);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 置顶会话
   *
   * @param {Object} options 置顶参数
   * @returns {Promise}
   */
  public async pinConversation(options: any) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const imResponse: any = await this.TUICore.pinConversation(options);
        resolve(imResponse);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * C2C消息免打扰
   *
   * @param {Object} options 消息免打扰参数
   * @returns {Promise}
   */
  public async muteConversation(options: any) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const imResponse: any = await this.TUICore.setMessageRemindType(
          options
        );
        resolve(imResponse);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 设置已读
   *
   * @param {string} conversationID 会话ID
   * @returns {Promise}
   */
  public async setMessageRead(conversationID: string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const imResponse: any = await this.TUICore.setMessageRead({
          conversationID,
        });
        resolve(imResponse);
      } catch (error) {
        reject(error);
      }
    });
  }
}
