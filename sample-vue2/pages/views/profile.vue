<template>
  <div class="TUI-profile">
    <div class="profile">
      <div class="profile-header">
        <aside class="profile-avatar">
          <img
            class="avatar"
            :src="
              userProfile.avatar
                ? userProfile.avatar
                : 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'
            "
            onerror="this.src='https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
          />
        </aside>
        <div class="profile-main">
          <div class="profile-main-item">
            <div class="profile-main-name">{{ userProfile.nick || "-" }}</div>
          </div>
          <div class="profile-main-item">
            <span class="profile-main-label"
              >{{ TUITranslateService.t("用户ID") }}:</span>
            <span class="profile-main-label">{{ userProfile.userID }}</span>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer">
      <div class="btn" @click.prevent="exitLogin">
        {{ TUITranslateService.t("退出登录") }}
      </div>
    </footer>
  </div>
</template>
<script lang="ts" setup>
import {
  TUITranslateService,
  TUIUserService,
} from "@tencentcloud/chat-uikit-engine";
import {
  ref,
} from "../../TUIKit/adapter-vue";
import { onShow } from "@dcloudio/uni-app";
import { TUILogin } from "@tencentcloud/tui-core";
const userProfile = ref({});
onShow(() => {
  getUserProfile();
});
const getUserProfile = () => {
  TUIUserService.getUserProfile().then((res) => {
    userProfile.value = res.data;
  });
};
const exitLogin = () => {
  TUILogin.logout().then(() => {
    uni.reLaunch({
      url: './login'
    })
  });
}
</script>

<style lang="scss" scoped>
.TUI-profile {
  background: #efefef;
  height: 100%;
  .profile {
    padding: 14px 18px;
    flex-direction: row;
    align-items: center;
    background: #ffffff;
    &-header {
      flex: 1;
      display: flex;
      border-bottom: 1px solid #dddddd;
      border: none;
    }
    &-avatar {
      .avatar {
        width: 78px;
        height: 78px;
        border-radius: 8px;
      }
    }
    &-main {
      padding-top: 20px;
      padding-left: 20px;
      padding-bottom: 8px;
      flex: 1;
      &-item {
        padding: 5px;
      }
      &-name {
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: #000000;
        letter-spacing: 0;
        font-size: 15px;
      }
      &-label {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #999999;
        letter-spacing: 0;
        font-size: 14px;
     }
    }
  }
  .footer {
    display: flex;
    position: absolute;
    bottom: 110px;
    width: 100%;
    .btn {
      flex: 1;
      border: none;
      padding: 14px 0;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 19px;
      color: #e54545;
      text-align: center;
      line-height: 29px;
      background: #ffffff;
    }
  }
}
</style>
