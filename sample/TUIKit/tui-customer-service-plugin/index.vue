<template>
  <div class="message-custom">
    <MessageRating
      v-if="isMessageRating(props.message)"
      :message="props.message"
      @sendMessage="sendCustomMessage"
    />
    <MessageCustomerService
      v-else-if="isCustomerServiceMessage(props.message)"
      :message="props.message"
      @sendMessage="sendTextMessage"
    />
  </div>
</template>
<script lang="ts">
import TUICore, { TUIConstants } from '@tencentcloud/tui-core';
import { isCustomerServiceMessage, isMessageRating } from './utils/index';
import { CustomMessagePayload, TextMessagePayload, IMessageModel } from './interface';
import MessageCustomerService from './components/message-customer-service.vue';
import MessageRating from './components/message-rating/index.vue';

interface Props {
  message: IMessageModel;
}
export default {
  components: {
    MessageCustomerService,
    MessageRating,
  },
  props: {
    message: {
      type: Object as () => IMessageModel,
      default: () => ({}),
    },
  },
  setup(props: Props) {
    const sendTextMessage = (payload: TextMessagePayload) => {
      TUICore.callService({
        serviceName: TUIConstants.TUIChat.SERVICE.NAME,
        method: TUIConstants.TUIChat.SERVICE.METHOD.SEND_TEXT_MESSAGE,
        params: { payload },
      });
    };
    const sendCustomMessage = (payload: CustomMessagePayload) => {
      TUICore.callService({
        serviceName: TUIConstants.TUIChat.SERVICE.NAME,
        method: TUIConstants.TUIChat.SERVICE.METHOD.SEND_CUSTOM_MESSAGE,
        params: { payload },
      });
    };
    return {
      props,
      sendTextMessage,
      sendCustomMessage,
      isCustomerServiceMessage,
      isMessageRating,
    };
  },
};
</script>
