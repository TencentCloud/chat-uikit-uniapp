<template>
  <div class="message-translation-container">
    <div
      v-if="translationFinished"
      :id="`translation-content-${props.message.ID}`"
      :class="{
        'translation-content': true,
        'occur': true
      }"
    >
      <template
        v-if="translationTextList.length > 0"
      >
        <span
          v-for="(text, index) in translationTextList"
          :key="index"
        >
          <img
            v-if="text.type === 'face'"
            class="text-face"
            :src="text.value"
          >
          <span
            v-else
            class="text-plain"
          >
            {{ text.value }}
          </span>
        </span>
      </template>
      <template v-else>
        {{ translationErrorText }}
      </template>
    </div>
    <div
      :class="{
        'loading': true,
        'loading-end': translationFinished
      }"
    >
      {{ TUITranslateService.t('TUIChat.翻译中') }}...
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from '../../../../../adapter-vue';
import {
  IMessageModel,
  TUITranslateService,
} from '@tencentcloud/chat-uikit-engine';
import { TranslationTextType, translator } from '../../../utils/translation';

interface IProps {
  message: IMessageModel;
  translationContentVisible: boolean;
  isSingleTranslation: boolean;
  translationWrapperRef: HTMLDivElement | undefined;
}

const props = withDefaults(defineProps<IProps>(), {
  message: () => ({} as IMessageModel),
});

const translationFinished = ref<boolean>(false);
const translationErrorText = ref<string>('');
const translationTextList = ref<TranslationTextType[]>([]);

watch(() => props.translationContentVisible, (newVal: boolean) => {
  if (newVal) {
    translator.get(props.message)
      .then((result) => {
        translationFinished.value = true;
        translationTextList.value = result;
      })
      .catch((err) => {
        translationFinished.value = true;
        emits('toggleErrorStatus', true);
        translationErrorText.value = err.message;
      });
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.message-translation-container {
  min-height: 16px;
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

  .translation-content {
    opacity: 0;

    &.occur {
      animation: occur 0.3s ease-out 0.45s forwards;

      @keyframes occur {
        100% {
          opacity: 1;
        }
      }
    }

    .text-face {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
