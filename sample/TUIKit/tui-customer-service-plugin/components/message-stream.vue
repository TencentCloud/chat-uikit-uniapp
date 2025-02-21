<template>
  <div class="message-stream">
    {{ displayedContent }}<span v-if="!isFinished" class="blinking-cursor" />
  </div>
</template>

<script lang="ts">
import vue from "../adapter-vue";
import { customerServicePayloadType } from "../interface";

const { ref, watchEffect, onBeforeUnmount, onMounted } = vue;

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
  setup(props: Props) {
    const content = ref<string>("");
    const displayedContent = ref<string>("");
    const isFinished = ref<boolean>(false);
    let intervalId: number | null = null;
    let currentIndex = 0;

    const updateDisplayedContent = () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      intervalId = window.setInterval(() => {
        if (currentIndex < content.value.length) {
          displayedContent.value += content.value[currentIndex];
          currentIndex++;
        } else {
          window.clearInterval(intervalId!);
          intervalId = null;
        }
      }, 50);
    };

    onMounted(() => {
      content.value = props?.payload?.chunks?.join("") ?? "";
      displayedContent.value = content.value;
      currentIndex = content.value.length;
    });

    watchEffect(() => {
      const newContent = props?.payload?.chunks?.join("") ?? "";
      if (newContent.length > currentIndex) {
        content.value = newContent;
        updateDisplayedContent();
      }
    });

    watchEffect(() => {
      isFinished.value = props?.payload?.isFinished === 1;
    });

    onBeforeUnmount(() => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    });

    return {
      content,
      props,
      isFinished,
      displayedContent,
    };
  },
};
</script>
<style lang="scss" scoped>
.message-stream {
  word-break: break-all;
  font-size: 14px;

  .blinking-cursor {
    display: inline-block;
    width: 1px;
    height: 16px;
    background-color: black;
    animation: blink 1s step-end infinite;
    vertical-align: sub;
  }

  @keyframes blink {
    0%,
    100% {
      background-color: transparent;
    }

    50% {
      background-color: black;
    }
  }
}
</style>
