<template>
  <div class="login-h5">
    <main class="login-main">
      <div class="login-main-content">
        <div
          label-width="0"
          class="login-form"
        >
          <div class="login-title">
            <Icon
              :file="logo"
              width="60px"
              height="60px"
            />
            <p>{{ TUITranslateService.t("免费体验") }}</p>
          </div>
          <div class="login-from-item">
            <input
              v-model="inputValue"
              :placeholder="TUITranslateService.t('请输入userID')"
              type="string"
              class="login-input-uniapp"
            >
          </div>
          <div class="login-from-item">
            <div class="checked-text">
              <div
                class="private-switch"
                @click="onAgreePrivateProtocol"
              >
                <image
                  v-if="privateAgree"
                  class="selected-icon icon-default"
                  src="@/static/selected.svg"
                />
                <i
                  v-else
                  class="icon-unselected icon-default"
                />
              </div>
              <div class="private-content">
                <span>{{ TUITranslateService.t("我已阅读并同意") }}</span>
                <a
                  class="private-content-link"
                  @click="openFullPlatformLink(Link.privacy.url)"
                >《{{ TUITranslateService.t(`${Link.privacy.label}`) }}》</a>{{ TUITranslateService.t("和") }}
                <a
                  class="private-content-link"
                  @click="openFullPlatformLink(Link.agreement.url)"
                >《{{ TUITranslateService.t(`${Link.agreement.label}`) }}》</a>
              </div>
            </div>
          </div>
          <div class="login-btn">
            <button
              class="btn btn-primary"
              @click="handleLoginInfo"
            >
              {{ TUITranslateService.t("登录") }}
            </button>
          </div>
          <footer class="login-form-footer">
            <a @click="openFullPlatformLink(Link.demo.url)">{{
              TUITranslateService.t(`${Link.demo.label}`)
            }}</a>
          </footer>
        </div>
      </div>
    </main>
    <div class="login-footer">
      <ul class="login-footer-list">
        <li
          v-for="(item, index) in Link.advList"
          :key="index"
          class="login-footer-list-item"
        >
          <a
            class="login-footer-list-item-link"
            @click="openFullPlatformLink(item)"
          >
            <aside class="aside">
              <h1 class="h1">{{ `${item.label}` }}</h1>
              <h1
                v-if="item.subLabel"
                class="sub h1"
              >
                {{ `${item.subLabel}` }}
              </h1>
            </aside>
            <span class="span"><text class="text">{{ TUITranslateService.t(`${item.btnText}`) }}</text></span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, vueVersion } from '../../TUIKit/adapter-vue';
import { TUITranslateService } from '@tencentcloud/chat-uikit-engine';
import Link from '../../utils/link';
import { genTestUserSig } from '../../TUIKit/debug';
import { isPC, isH5, isApp } from '../../TUIKit/utils/env';
import Icon from '../../TUIKit/components/common/Icon.vue';
import logo from '../../static/logo-back.svg';
import { loginChat } from '../../loginChat';
const privateAgree = ref(false);
const inputValue = ref('');

const onAgreePrivateProtocol = () => {
  privateAgree.value = !privateAgree.value;
};

const handleLoginInfo = () => {
  const options = genTestUserSig({
    SDKAppID: uni.$chat_SDKAppID,
    secretKey: uni.$chat_secretKey,
    userID: inputValue.value,
  });
  const loginInfo = {
    SDKAppID: uni.$chat_SDKAppID,
    userID: inputValue.value,
    userSig: options.userSig,
    useUploadPlugin: true,
    framework: `vue${vueVersion}`,
    TIMPush: uni.$TIMPush, // register TencentCloud-TIMPush
    pushConfig: {
      androidConfig: uni.$TIMPushConfigs, // Android timpush-configs.json
      iOSConfig: {
        iOSBusinessID: '', // iOS Certificate ID
      },
    },
  };
  login(loginInfo);
};

const login = (loginInfo: any) => {
  if (!inputValue.value) {
    uni.showToast({
      title: TUITranslateService.t('Login.请输入userID'),
      icon: 'none',
    });
  } else if (!privateAgree.value) {
    uni.showToast({
      title: TUITranslateService.t('Login.请先勾选用户协议'),
      icon: 'none',
    });
  } else {
    loginChat(loginInfo).catch(() => {
      uni.showToast({
        title: TUITranslateService.t('Login.登录失败'),
        icon: 'none',
      });
    });
  }
};

const openFullPlatformLink = (link: string) => {
  if (isPC || isH5) {
    window.open(link);
  } else if (isApp) {
    plus?.runtime?.openURL(link);
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/login";

.icon {
  display: inline;
}

.btn {
  background: none;
  border: none;
}

.icon-unselected {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.selected-icon {
  width: 14px;
  height: 14px;
}

.icon-default {
  margin: 7px 6px 0 0;
}

.login-input-uniapp {
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  height: 40px;
  padding: 0 0 0 14px;
}

.logo-back-png {
  width: 4.61rem;
  height: 3.23rem;
}

.private-content-link {
  display: inline-block;
}
</style>
