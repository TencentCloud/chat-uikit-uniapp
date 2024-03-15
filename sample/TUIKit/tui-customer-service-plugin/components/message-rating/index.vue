<template>
  <RatingStar
    v-if="ratingTemplate.type === RATING_TEMPLATE_TYPE.STAR"
    :ratingTemplate="ratingTemplate"
    @sendMessage="sendCustomMessage"
  />
  <RatingNumber
    v-else
    :ratingTemplate="ratingTemplate"
    @sendMessage="sendCustomMessage"
  />
</template>

<script lang="ts">
import vue from '../../adapter-vue';
import { JSONToObject } from '../../utils/index';
import { RATING_TEMPLATE_TYPE } from '../../constant';
import RatingStar from './message-rating-star.vue';
import RatingNumber from './message-rating-number.vue';
import { IMessageModel } from '../../interface';

const { computed } = vue;

interface Props {
  message: IMessageModel;
}

export default {
  components: {
    RatingStar,
    RatingNumber,
  },
  props: {
    message: {
      type: Object as () => IMessageModel,
      default: () => ({}),
    },
  },
  emits: ['sendMessage'],
  setup(props: Props, { emit }) {
    const ratingTemplate = computed(() => {
      const data = props.message && JSONToObject(props.message.payload.data);
      return data?.menuContent;
    });

    const sendCustomMessage = (data: any) => {
      emit('sendMessage', data);
    };

    return {
      sendCustomMessage,
      ratingTemplate,
      RATING_TEMPLATE_TYPE,
    };
  },
};
</script>
