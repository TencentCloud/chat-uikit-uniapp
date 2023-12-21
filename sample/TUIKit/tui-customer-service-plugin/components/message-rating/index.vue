<template>
  <RatingStar
    v-if="ratingTemplate.type === RATING_TEMPLATE_TYPE.STAR"
    :ratingTemplate="ratingTemplate"
    @sendMessage="sendCustomMessage"
  ></RatingStar>
  <RatingNumber
    v-else
    :ratingTemplate="ratingTemplate"
    @sendMessage="sendCustomMessage"
  ></RatingNumber>
</template>

<script lang="ts">
import vue from "../../adapter-vue";
import { JSONToObject } from "../../utils/index";
import { RATING_TEMPLATE_TYPE } from "../../constant";
import RatingStar from "../message-rating/message-rating-star.vue";
import RatingNumber from "../message-rating/message-rating-number.vue";
import { IMessageModel } from "../../interface";

const { computed } = vue;

interface Props {
  message: IMessageModel;
}

export default {
  props: {
    message: Object,
  },
  emits: ["sendMessage"],
  components: {
    RatingStar,
    RatingNumber,
  },
  setup(props: Props, { emit }) {
    const ratingTemplate = computed(() => {
      const data = props.message && JSONToObject(props.message.payload.data);
      return data?.menuContent;
    });

    const sendCustomMessage = (data: any) => {
      emit("sendMessage", data);
    };

    return {
      sendCustomMessage,
      ratingTemplate
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
