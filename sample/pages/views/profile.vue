<template>
  <div :class="['TUI-profile', !isPC && 'TUI-profile-h5']">
    <div
      v-if="displayType !== 'setting'"
      :class="['TUI-profile-basic', !isPC && 'TUI-profile-h5-basic']"
    >
      <img
        :class="[
          'TUI-profile-basic-avatar',
          !isPC && 'TUI-profile-h5-basic-avatar',
        ]"
        :src="
          userProfile.avatar ||
          'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'
        "
      />
      <div
        :class="[
          'TUI-profile-basic-info',
          !isPC && 'TUI-profile-h5-basic-info',
        ]"
      >
        <div
          :class="[
            'TUI-profile-basic-info-nick',
            !isPC && 'TUI-profile-h5-basic-info-nick',
          ]"
        >
          {{ userProfile.nick || "-" }}
        </div>
        <div
          :class="[
            'TUI-profile-basic-info-id',
            !isPC && 'TUI-profile-h5-basic-info-id',
          ]"
        >
          <label
            :class="[
              'TUI-profile-basic-info-id-label',
              !isPC && 'TUI-profile-h5-basic-info-id-label',
            ]"
            >{{ TUITranslateService.t("TUIProfile.用户ID") }}:</label
          >
          <div
            :class="[
              'TUI-profile-basic-info-id-value',
              !isPC && 'TUI-profile-h5-basic-info-id-value',
            ]"
          >
            {{ userProfile.userID }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="displayType !== 'profile' && (!isPC || showSetting)"
      ref="settingDomRef"
      :class="['TUI-profile-setting', !isPC && 'TUI-profile-h5-setting']"
    >
      <div
        v-for="(item, key) in settingList"
        :key="key"
        :class="[
          'TUI-profile-setting-item',
          !isPC && 'TUI-profile-h5-setting-item',
          item.value === 'exit' && 'TUI-profile-h5-setting-item-exit',
        ]"
      >
        <div
          @click="handleSettingListItemOnClick(item)"
          :class="[
            'TUI-profile-setting-item-label',
            !isPC && 'TUI-profile-h5-setting-item-label',
          ]"
        >
          <div :class="['label-left']">
            <div :class="['label-title']">
              {{ item.label }}
            </div>
            <div
              :class="['label-desc']"
              v-if="
                item.children && !isPC && item.childrenShowType === 'switch'
              "
            >
              {{ item.value }}
            </div>
          </div>
          <div :class="['label-right']">
            <div
              v-if="
                !isPC &&
                item.children &&
                item.selectedChild &&
                item.childrenShowType === 'bottomPopup'
              "
              :class="[
                'TUI-profile-setting-item-label-value',
                !isPC && 'TUI-profile-h5-setting-item-label-value',
              ]"
            >
              {{ generateLabel(item) }}
            </div>
            <Icon
              v-if="item.children"
              :file="rightArrowIcon"
              width="14px"
              height="14px"
              style="width: 14px; height: 14px; display: flex"
            ></Icon>
          </div>
        </div>
        <!-- 移动端 children显示，分多个类型 -->
        <BottomPopup
          v-if="
            item.children && !isPC && item.childrenShowType === 'bottomPopup'
          "
          :show="item.showChildren"
          @onClose="bottomPopupOnClose(item)"
        >
          <div
            :class="[
              'TUI-profile-setting-item-bottom-popup',
              !isPC && 'TUI-profile-h5-setting-item-bottom-popup',
            ]"
            v-for="child in item.children"
            @click="handleSettingListItemOnClick(child)"
          >
            {{ child.label }}
          </div>
        </BottomPopup>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import TUIChatEngine, {
  TUITranslateService,
  TUIUserService,
  TUIStore,
  StoreName,
} from "@tencentcloud/chat-uikit-engine";
import { TUILogin } from "@tencentcloud/tui-core";
import { ref, defineProps, onMounted } from "../../TUIKit/adapter-vue";
import { isPC } from "../../TUIKit/utils/env";
import { TUIGlobal } from "../../TUIKit/utils/universal-api/index";
import { Toast, TOAST_TYPE } from "../../TUIKit/components/common/Toast/index";
import BottomPopup from "../../TUIKit/components/common/BottomPopup/index.vue";
import Icon from "../../TUIKit/components/common/Icon.vue";
import rightArrowIcon from "../../TUIKit/assets/icon/right-icon.svg";
import { IUserProfile } from "../../TUIKit/interface";
import { onHide } from "@dcloudio/uni-app";

const props = defineProps({
  displayType: {
    type: String,
    default: "all", // "profile"/"setting"/"all"
  },
  showSetting: {
    type: Boolean,
    default: false,
  },
});

const settingDomRef = ref();
const userProfile = ref<IUserProfile>({});
const settingList = ref<{
  [propsName: string]: {
    value: string;
    label: string;
    onClick?: any;
    // children相关
    selectedChild?: string;
    childrenShowType?: string; // "bottomPopup"/"switch"
    showChildren?: boolean;
    children?: {
      [propsName: string]: {
        value: string;
        label: string;
        onClick?: any;
      };
    };
  };
}>({
  editProfile: {
    value: "editProfile",
    label: "编辑资料（暂未开放）",
    onClick: (item: any) => {
      console.warn("编辑资料功能努力开发中，敬请期待");
    },
  },
  allowType: {
    value: "allowType",
    label: "加我为好友时",
    selectedChild: "",
    childrenShowType: "bottomPopup",
    showChildren: false,
    onClick: (item: any) => {
      if (!isPC) {
        item.showChildren = true;
      }
    },
    children: {
      [TUIChatEngine.TYPES.ALLOW_TYPE_ALLOW_ANY]: {
        value: TUIChatEngine.TYPES.ALLOW_TYPE_ALLOW_ANY,
        label: "同意任何用户加好友",
        onClick: (item: any) => {
          updateMyProfile({ allowType: item.value });
        },
      },
      [TUIChatEngine.TYPES.ALLOW_TYPE_NEED_CONFIRM]: {
        value: TUIChatEngine.TYPES.ALLOW_TYPE_NEED_CONFIRM,
        label: "需要验证",
        onClick: (item: any) => {
          updateMyProfile({ allowType: item.value });
        },
      },
      [TUIChatEngine.TYPES.ALLOW_TYPE_DENY_ANY]: {
        value: TUIChatEngine.TYPES.ALLOW_TYPE_DENY_ANY,
        label: "拒绝任何人加好友",
        onClick: (item: any) => {
          updateMyProfile({ allowType: item.value });
        },
      },
    },
  },
  exit: {
    value: "exit",
    label: "退出登录",
    onClick: (item: any) => {
      TUILogin.logout().then(() => {
        TUIGlobal?.reLaunch({
          url: "/pages/views/login",
        });
      });
    },
  },
});

const handleSettingListItemOnClick = (item: any) => {
  if (item?.onClick && typeof item?.onClick === "function") {
    item.onClick(item);
  }
};

const bottomPopupOnClose = (item: any) => {
  item.showChildren = false;
};

const generateLabel = (item: any) => {
  return item?.children[item?.selectedChild]?.label;
};

const updateMyProfile = (props: object) => {
  TUIUserService.updateMyProfile(props)
    .then((res: any) => {
      Toast({
        message: "更新用户资料成功",
        type: TOAST_TYPE.SUCCESS,
        duration: 0,
      });
    })
    .catch((err: any) => {
      console.warn("更新用户资料失败", err);
      Toast({
        message: "更新用户资料失败",
        type: TOAST_TYPE.ERROR,
        duration: 0,
      });
    });
};

TUIStore.watch(StoreName.USER, {
  userProfile: (userProfileData: IUserProfile) => {
    userProfile.value = userProfileData;
    if (userProfile?.value?.allowType) {
      settingList.value.allowType.selectedChild = userProfile?.value?.allowType;
    }
  },
});

// 规避TUIStore.watch userProfile 登录后暂时不能及时触发更新
onMounted(() => {
  // 查询自己的资料
  TUIUserService.getUserProfile().then((res: any) => {
    userProfile.value = res.data;
  });
});

// tabbar 切换其他tab，关闭profile已经打开的设置弹窗
onHide(() => {
  for (let settingItemKey in settingList.value) {
    if (settingList?.value[settingItemKey]?.hasOwnProperty("showChildren")) {
      settingList.value[settingItemKey].showChildren = false;
    }
  }
});
</script>

<style lang="scss" scoped src="../../styles/profile/index.scss"></style>
