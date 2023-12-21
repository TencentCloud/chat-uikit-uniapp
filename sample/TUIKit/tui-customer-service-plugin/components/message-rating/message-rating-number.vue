<template>
  <div class="messageRatingStar">
    <p class="ratingHead">
      {{ props.ratingTemplate.head }}
    </p>

    <div class="ratingCard">
      <span class="cardTitle">请对本次服务进行评价</span>
      <div class="cardWrapper">
        <div style="max-width: 250px">
          <div
            v-for="(item, index) in numberList"
            :class="{
              active: !(index !== selectValue && index !== hoverValue),
              deActive: index !== selectValue && index !== hoverValue,
            }"
            :style="{
              marginLeft: index === 0 ? 0 + 'px' : 20 + 'px',
              margin: 5 + 'px',
            }"
            :key="index"
            @click="setValue(index)"
            @mouseenter="setHoverValue(index)"
            @mouseleave="setHoverValue(-1)"
          >
            {{ item + 1 }}
          </div>
        </div>
      </div>
      <div :style="{ marginTop: 10 + 'px', marginBottom: 10 + 'px' }">
        {{
          hoverValue === -1
            ? selectValue === -1
              ? "如果满意请给好评哦～"
              : desc[selectValue]
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

const { computed, ref, watchEffect } = vue;

interface Props {
  ratingTemplate: ratingTemplateType;
}

export default {
  props: ["ratingTemplate"],
  emits: ["sendMessage"],
  setup(props: Props, { emit }) {
    const hasReply = ref<boolean>(false);
    const sessionId = ref<string>('');
    const selectValue = ref<number>(-1);
    const hoverValue = ref<number>(-1);
    const hasExpire = ref<boolean>(false);

    const desc = computed(() => {
      return props.ratingTemplate?.menu.map((item) => item.content);
    });

    const numberList = computed(() => {
      return props.ratingTemplate?.menu.map((item, index) => index);
    })

    watchEffect(() => {
      sessionId.value = props.ratingTemplate.sessionId || '';
      if (props.ratingTemplate.selected != undefined) {
          for (let i = 0; i < props.ratingTemplate.menu.length; i++) {
            if (props.ratingTemplate.menu[i].id == props.ratingTemplate.selected.id) {
              hasReply.value = true;
              selectValue.value = i;
              break;
            }
          }
        }
        const timestamp = Math.floor(new Date().getTime() / 1000);
        if (timestamp > props.ratingTemplate.expireTime) {
          hasExpire.value = true;
        }
    });

    const setValue = (val: number) => {
      if (!hasReply.value) {
        selectValue.value = val;
      }
    };

    const setHoverValue = (value: number) => {
      if (!hasReply.value) {
        hoverValue.value = value;
      }
    };

    const submitRatingStar = () => {
      if (selectValue.value >= 0) {
        const submitData = {
          data: {
            src: CUSTOM_MESSAGE_SRC.MENU_SELECTED,
            menuSelected: {
              id: props.ratingTemplate.menu[selectValue.value].id,
              content: props.ratingTemplate.menu[selectValue.value].content,
              sessionId: sessionId.value,
            },
            customerServicePlugin: 0,
          },
        };
        hasReply.value = true;
        emit("sendMessage", submitData);
      }
    };

    return {
      props,
      hasReply,
      sessionId,
      selectValue,
      hoverValue,
      hasExpire,
      desc,
      numberList,
      setValue,
      setHoverValue,
      submitRatingStar,
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
