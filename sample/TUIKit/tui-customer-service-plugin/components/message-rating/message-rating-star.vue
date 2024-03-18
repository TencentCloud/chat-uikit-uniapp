<template>
  <div class="message-rating-star">
    <p class="rating-head">
      {{ props.ratingTemplate.head }}
    </p>
    <div class="rating-card">
      <span class="card-title">请对本次服务进行评价</span>
      <div class="card-wrapper">
        <div style="max-width: 200px">
          <div
            v-for="(item, index) in starList"
            :key="index"
            style="display: inline-block"
            @click="setValue(index)"
            @mouseenter="setHoverValue(index)"
            @mouseleave="setHoverValue(-1)"
          >
            <Icon
              v-if="item === 1"
              :src="star"
              width="30px"
              height="30px"
            />
            <Icon
              v-else
              :src="starLine"
              width="30px"
              height="30px"
            />
          </div>
        </div>
      </div>
      <div :style="{ marginTop: 10 + 'px', marginBottom: 10 + 'px' }">
        {{
          hoverValue === -1
            ? value === -1
              ? "如果满意请给好评哦～"
              : desc[value]
            : desc[hoverValue]
        }}
      </div>
      <button
        class="submit-button"
        :disabled="hasReply || hasExpire"
        @click="submitRatingStar"
      >
        提交评价
      </button>
    </div>
    <p
      v-if="hasReply"
      class="rating-tail"
      :style="{
        marginTop: 20 + 'px',
      }"
    >
      {{ props.ratingTemplate.tail }}
    </p>
  </div>
</template>

<script lang="ts">
import vue from '../../adapter-vue';
import { CUSTOM_MESSAGE_SRC } from '../../constant';
import { ratingTemplateType } from '../../interface';
import star from '../../assets/star.png';
import starLine from '../../assets/starLine.png';
import Icon from '../customer-icon.vue';

const { computed, ref, watchEffect } = vue;

interface Props {
  ratingTemplate: ratingTemplateType;
}

export default {
  components: {
    Icon,
  },
  props: {
    ratingTemplate: {
      type: Object as () => ratingTemplateType,
      default: () => ({}),
    },
  },
  emits: ['sendMessage'],
  setup(props: Props, { emit }) {
    const hasReply = ref<boolean>(false);
    const sessionId = ref<string>('');
    const value = ref<number>(-1);
    const hoverValue = ref<number>(-1);
    const hasExpire = ref<boolean>(false);

    watchEffect(() => {
      sessionId.value = props.ratingTemplate.sessionId || '';
      if (props.ratingTemplate.selected != undefined) {
        for (let i = 0; i < props.ratingTemplate.menu.length; i++) {
          if (props.ratingTemplate.menu[i].id == props.ratingTemplate.selected.id) {
            hasReply.value = true;
            value.value = i;
            break;
          }
        }
      }
      const timestamp = Math.floor(new Date().getTime() / 1000);
      if (timestamp > props.ratingTemplate.expireTime) {
        hasExpire.value = true;
      }
    });

    const desc = computed(() => {
      return props.ratingTemplate?.menu.map((item) => {
        return item.content;
      });
    });

    const starList = computed(() => {
      return props.ratingTemplate?.menu.map((item, index) => {
        if (hoverValue.value !== -1) {
          return index <= hoverValue.value ? 1 : 0;
        } else {
          return index <= value.value ? 1 : 0;
        }
      });
    });

    const setValue = (val: number) => {
      if (hasReply.value) {
        return;
      }
      value.value = val;
    };

    const setHoverValue = (value: number) => {
      if (hasReply.value) {
        return;
      }
      hoverValue.value = value;
    };

    const submitRatingStar = async () => {
      if (value.value < 0) {
        return;
      }
      const submitData = {
        data: JSON.stringify({
          src: CUSTOM_MESSAGE_SRC.MENU_SELECTED,
          menuSelected: {
            id: props.ratingTemplate.menu[value.value].id,
            content: props.ratingTemplate.menu[value.value].content,
            sessionId: sessionId.value,
          },
          customerServicePlugin: 0,
        }),
      };
      hasReply.value = true;
      emit('sendMessage', submitData);
    };
    return {
      props,
      hasReply,
      sessionId,
      value,
      hoverValue,
      hasExpire,
      desc,
      starList,
      setValue,
      setHoverValue,
      submitRatingStar,
      star,
      starLine,
    };
  },
};
</script>
<style lang="scss" scoped>
.rating-head {
  font-size: 14px;
  font-weight: 400;
  color: #999;
}

.rating-tail {
  font-size: 14px;
  font-weight: 400;
  color: #999;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
}

.rating-card {
  min-width: 270px;
  width: 50%;
  background: #fbfbfb;
  border-radius: 20px;
  border: 0;
  margin-top: 10px;
  padding-top: 20px;
  padding-bottom: 20px;

  button:disabled {
    background: #d8d8d8;
  }
}

.message-rating-star {
  text-align: center;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding-bottom: 30px;
  align-items: center;
}

.card-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 10px;
}

.submit-button {
  width: 50%;
  height: 50px;
  background-color: #0365f9;
  font-size: 18px;
  font-weight: 400;
  color: white;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

</style>
