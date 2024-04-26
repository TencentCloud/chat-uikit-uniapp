<template>
  <div class="message-convert-container">
    <div
      v-if="convertFinished"
      :class="{
        'convert-content': true,
        'occur': true,
      }"
    >
      {{ convertText }}
    </div>
    <div
      :class="{
        'loading': true,
        'loading-end': convertFinished
      }"
    >
      {{ TUITranslateService.t('TUIChat.转换中') }}...
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from '../../../../../adapter-vue';
import {
  IMessageModel,
  TUITranslateService,
} from '@tencentcloud/chat-uikit-engine';
import { convertor } from '../../../utils/convertVoiceToText';

interface IProps {
  message: IMessageModel;
  contentVisible: boolean;
}

interface IEmits {
  (e: 'toggleErrorStatus', status: boolean): void;
}

const emits = defineEmits<IEmits>();
const props = withDefaults(defineProps<IProps>(), {
  message: () => ({} as IMessageModel),
  isSingleConvert: false,
});

const convertFinished = ref<boolean>(false);
const convertText = ref<string>('');

watch(() => props.contentVisible, (newVal: boolean) => {
  if (newVal) {
    convertor.get(props.message)
      .then((text) => {
        convertFinished.value = true;
        convertText.value = text;
      })
      .catch((err) => {
        convertFinished.value = true;
        emits('toggleErrorStatus', true);
        convertText.value = err.message;
      });
  }
}, {
  immediate: true,
});
</script>

<style lang="scss" scoped>
.message-convert-container {
  min-height: 20px;
  min-width: 80px;
  position: relative;
  transition: width 0.15s ease-out, height 0.15s ease-out, ;
  font-size: 14px;

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    transition: opacity 0.3s ease-out;

    &.loading-end {
      opacity: 0;
    }
  }

  .convert-content {
    opacity: 0;

    &.occur {
      animation: occur 0.3s ease-out 0.45s forwards;

      @keyframes occur {
        100% {
          opacity: 1;
        }
      }
    }
  }
}
</style>
