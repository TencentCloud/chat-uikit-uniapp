<template>
  <div class="messageRatingStar">
    <p class="ratingHead">
      {{ props.ratingTemplate.head }}
    </p>
    <div class="ratingCard">
      <span class="cardTitle">请对本次服务进行评价</span>
      <div class="cardWrapper">
        <div style="max-width: 200px">
          <div
            style="display: inline-block"
            v-for="(item, index) in starList"
            :key="index"
            @click="setValue(index)"
            @mouseenter="setHoverValue(index)"
            @mouseleave="setHoverValue(-1)"
          >
            <Icon v-if="item === 1" :src="star" width="30px" height="30px" />
            <Icon v-else :src="starLine" width="30px" height="30px" />
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
        class="submitButton"
        @click="submitRatingStar"
        :disabled="hasReply || hasExpire"
      >
        提交评价
      </button>
    </div>
    <p
      v-if="hasReply"
      class="ratingTail"
      :style="{
        marginTop: 20 + 'px',
      }"
    >
      {{ props.ratingTemplate.tail }}
    </p>
  </div>
</template>

<script lang="ts">
import vue from "../../adapter-vue";
import { CUSTOM_MESSAGE_SRC } from "../../constant";
import { ratingTemplateType } from "../../interface";
import star from "../../assets/star.png";
import starLine from "../../assets/starLine.png";
import Icon from "../Icon.vue";

const { computed, ref, watchEffect } = vue;

interface Props {
  ratingTemplate: ratingTemplateType;
}

export default {
  props: ["ratingTemplate"],
  emits: ["sendMessage"],
  components: {
    Icon
  },
  setup(props:Props, { emit }) {
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
              return index <= hoverValue.value ? 1 : 0;
            }
          });
    })

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
        data: {
          src: CUSTOM_MESSAGE_SRC.MENU_SELECTED,
          menuSelected: {
            id: props.ratingTemplate.menu[value.value].id,
            content: props.ratingTemplate.menu[value.value].content,
            sessionId: sessionId.value,
          },
          customerServicePlugin: 0,
        },
      };
      hasReply.value = true;
      emit("sendMessage", submitData);
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
      starLine
    }
  }
}
</script>
<style lang="scss" scoped>
.ratingHead {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
}

.ratingTail {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
}

.cardTitle {
  font-size: 14px;
  font-weight: 500;
}

.ratingCard {
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

.messageRatingStar {
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 30px;
  flex-direction: column;
  align-items: center;
}

.cardWrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 10px;
}

.submitButton {
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

.deActive {
  height: 34px;
  width: 34px;
  display: inline-block;
  border: 0px solid #006eff0d;
  border-radius: 5px;
  color: #006eff;
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  line-height: 34px;
  background: #006eff0d;
}

.active {
  width: 34px;
  height: 34px;
  display: inline-block;
  background: linear-gradient(
    136.96deg,
    rgba(10, 124, 255, 0.3) -39.64%,
    #0a7cff 131.39%
  );
  border-radius: 5px;
  color: white;
  font-weight: 400;
  font-size: 16px;
  border: 0px solid #0a7cff;
  text-align: center;
  line-height: 34px;
}
</style>
