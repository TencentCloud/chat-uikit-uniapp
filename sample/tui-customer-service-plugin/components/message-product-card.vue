<template>
  <div class="messageProductCard" @click="jumpProductCard">
    <image v-if="isApp" class="productImg" :src="props.payload.content.pic" />
    <img v-else class="productImg" :src="props.payload.content.pic" />
    <div class="productCardInformation">
      <div class="productCardTitle">
        {{ props.payload.content.header }}
      </div>
      <div class="productCardDescription">
        {{ props.payload.content.desc }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import vue from "../adapter-vue";
import { customerServicePayloadType } from "../interface";
import { isApp } from "../utils/env";

// eslint-disable-next-line
declare var uni: any;

interface Props {
  payload: customerServicePayloadType;
}

export default {
  props: ["payload"],
  emits: ["sendMessage"],
  setup(props: Props, { emit }) {
    const jumpProductCard = () => {
      if (window) {
        window.open(props.payload.content.url, "_blank");
      } else {
        uni && uni.navigateTo({ url: `/TUIKit/components/TUIChat/web-view?url=${props.payload.content.url}` })
      }
    };
    return {
      props,
      isApp,
      jumpProductCard,
    }
  }
}
</script>
<style lang="scss" scoped>
.messageProductCard {
  min-width: 224px;
  max-width: 288px;
  background: #ffffff;
  border: 1px solid #dddddd;
  display: flex;
  padding: 12px;
  border-radius: 5px;
  .productImg {
    width: 86px;
    height: 86px;
  }
  .productCardInformation {
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .productCardTitle {
      font-size: 12px;
      max-width: 165px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
    .productCardDescription {
      font-size: 16px;
      max-width: 165px;
      color: #ff6c2e;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
