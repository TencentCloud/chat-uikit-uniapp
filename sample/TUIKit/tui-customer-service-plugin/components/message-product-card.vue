<template>
  <div
    class="message-product-card"
    @click="jumpProductCard"
  >
    <image
      v-if="isApp"
      class="product-img"
      :src="props.payload.content.pic"
    />
    <img
      v-else
      class="product-img"
      :src="props.payload.content.pic"
    >
    <div class="product-card-information">
      <div class="product-card-title">
        {{ props.payload.content.header }}
      </div>
      <div class="product-card-description">
        {{ props.payload.content.desc }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { customerServicePayloadType } from '../interface';
import { isApp } from '../utils/env';

// eslint-disable-next-line
declare var uni: any;

interface Props {
  payload: customerServicePayloadType;
}

export default {
  props: {
    payload: {
      type: Object as () => customerServicePayloadType,
      default: () => ({}),
    },
  },
  emits: ['sendMessage'],
  setup(props: Props) {
    const jumpProductCard = () => {
      if (window) {
        window.open(props.payload.content.url, '_blank');
      } else {
        uni && uni.navigateTo({ url: `/TUIKit/components/TUIChat/web-view?url=${props.payload.content.url}` });
      }
    };
    return {
      props,
      isApp,
      jumpProductCard,
    };
  },
};
</script>
<style lang="scss" scoped>
.message-product-card {
  min-width: 224px;
  max-width: 288px;
  background: #fff;
  border: 1px solid #ddd;
  display: flex;
  padding: 12px;
  border-radius: 5px;

  .product-img {
    width: 86px;
    height: 86px;
  }

  .product-card-information {
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .product-card-title {
      font-size: 12px;
      max-width: 165px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }

    .product-card-description {
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
