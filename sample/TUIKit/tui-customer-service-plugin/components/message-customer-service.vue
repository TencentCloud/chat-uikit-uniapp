<template>
  <div class="custom">
    <div
      v-if="
        payload.src === CUSTOM_MESSAGE_SRC.BRANCH ||
          payload.src === CUSTOM_MESSAGE_SRC.BRANCH_NUMBER ||
          (payload.src === CUSTOM_MESSAGE_SRC.ROBOT_MSG &&
            payload.subtype !== 'welcome_msg')
      "
    >
      <MessageBranch
        :payload="payload"
        @sendMessage="sendTextMessage"
      />
    </div>
    <div
      v-if="
        payload.src === CUSTOM_MESSAGE_SRC.ROBOT_MSG &&
          payload.subtype === 'welcome_msg'
      "
    >
      <MessageIMRobotWelcome
        :payload="payload"
        @sendMessage="sendTextMessage"
      />
    </div>
    <div v-if="payload.src === CUSTOM_MESSAGE_SRC.FROM_INPUT">
      <MessageForm
        :payload="payload"
        @sendMessage="sendTextMessage"
      />
    </div>
    <div v-if="payload.src === CUSTOM_MESSAGE_SRC.PRODUCT_CARD">
      <MessageProductCard :payload="payload" />
    </div>
    <div v-if="payload.src === CUSTOM_MESSAGE_SRC.RICH_TEXT">
      <MessageRichText :payload="payload" />
    </div>
    <div v-if="payload.src === CUSTOM_MESSAGE_SRC.STREAM_TEXT">
      <MessageStream :payload="payload" />
    </div>
  </div>
</template>

<script lang="ts">
import vue from '../adapter-vue';
import { JSONToObject } from '../utils/index';
import { CUSTOM_MESSAGE_SRC } from '../constant';
import { customerServicePayloadType, IMessageModel } from '../interface';
import MessageBranch from './message-branch.vue';
import MessageForm from './message-form/index.vue';
import MessageIMRobotWelcome from './message-robot-welcome.vue';
import MessageProductCard from './message-product-card.vue';
import MessageRichText from './message-rich-text.vue';
import MessageStream from './message-stream.vue';

const { computed } = vue;

interface Props {
  message: IMessageModel;
}

export default {
  components: {
    MessageBranch,
    MessageForm,
    MessageProductCard,
    MessageRichText,
    MessageIMRobotWelcome,
    MessageStream,
  },
  props: {
    message: {
      type: Object as () => IMessageModel,
      default: () => ({}),
    },
  },
  emits: ['sendMessage'],
  setup(props: Props, { emit }) {
    const payload = computed<customerServicePayloadType>(() => {
      return props.message && JSONToObject(props.message?.payload?.data);
    });

    const sendTextMessage = (text: string) => {
      emit('sendMessage', text);
    };
    return {
      payload,
      sendTextMessage,
      CUSTOM_MESSAGE_SRC,
    };
  },
};
</script>
