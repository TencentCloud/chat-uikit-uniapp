<template>
  <div
    v-if="translationVisible"
    :class="{
      'message-translation': true,
      'reverse': props.message.flow === 'out',
      'error': translationError,
    }"
  >
    <div
      class="message-translation-container"
    >
      <div
        v-if="translationFinished"
        :id="`translation-content-${props.message.ID}`"
        ref="translationContentRef"
        :class="{
          'translation-content': true,
          'occur': true
        }"
      >
        {{ translationText }}
      </div>
      <div
        ref="translationLoadingRef"
        :class="{
          'loading': true,
          'loading-end': translationFinished
        }"
      >
      {{ TUITranslateService.t('TUIChat.翻译中') }}...
      </div>
    </div>
    <div class="copyright">
      <Icon
        :file="checkIcon"
        size="13px"
      />
      <div class="copyright-text">
        {{ TUITranslateService.t('TUIChat.由IM提供翻译支持') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from '../../../../../adapter-vue';
import {
  TUIStore,
  StoreName,
  IMessageModel,
  TUITranslateService,
} from '@tencentcloud/chat-uikit-engine';
import Icon from '../../../../common/Icon.vue';
import checkIcon from '../../../../../assets/icon/check-sm.svg';
import { ITranslateInfo } from '../../../../../interface';
import { Translator } from '../../../utils/translation';

interface IProps {
  visible: boolean;
  message: IMessageModel;
}

const props = withDefaults(defineProps<IProps>(), {
  visible: false,
  message: () => ({} as IMessageModel),
});

const translationVisible = ref<boolean>(false);
const translationFinished = ref<boolean>(false);
const translationError = ref<boolean>(false);
const translationText = ref<string>('');
const calculateHeight = ref<number>(0);
const calculateWidth = ref<number>(0);

const translationLoadingRef = ref<HTMLDivElement>();
const translationContentRef = ref<HTMLDivElement>();

onMounted(() => {
  TUIStore.watch(StoreName.CHAT, {
    translateTextInfo: onMessageTranslationUpdated,
  });
});

onUnmounted(() => {
  TUIStore.unwatch(StoreName.CHAT, {
    translateTextInfo: onMessageTranslationUpdated,
  });
});

function onMessageTranslationUpdated(info: Map<string, ITranslateInfo[]>) {
  if (info === undefined) return;
  const translationInfoList = info.get(props.message.conversationID) || [];
  for (let i = 0; i < translationInfoList.length; ++i) {
    const { messageID, visible } = translationInfoList[i];
    if (messageID === props.message.ID && visible !== undefined) {
      translationVisible.value = visible;
      break;
    }
  }
}

watch(translationVisible, (newVal: boolean) => {
  if (newVal) {
    Translator.get(props.message)
      .then((text) => {
        translationFinished.value = true;
        translationText.value = text;
      })
      .catch((err) => {
        translationFinished.value = true;
        translationError.value = true;
        translationText.value = err.message;
      });
  } else {
    translationFinished.value = false;
    translationError.value = false;
    translationText.value = '';
    calculateHeight.value = 0;
    calculateWidth.value = 0;
  }
});
</script>

<style lang="scss" scoped>
.message-translation {
  margin-top: 4px;
  margin-left: 44px;
  padding: 10px;
  background-color: #f2f7ff;
  border-radius: 10px;
  display: flex;
  flex-direction: column !important;
  transition: background-color 0.15s ease-out;

  &.error {
    background-color: #ffdfdf;
  }

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
        animation: occur 0.3s ease-out 0.35s forwards;

        @keyframes occur {
          100% {
            opacity: 1;
          }
        }
      }
    }
  }

  .copyright {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .copyright-text {
      margin-left: 2px;
      font-size: 12px;
      color: #999;
    }
  }
}

.message-translation.reverse {
  margin-right: 44px;
  margin-left: auto;
}
</style>
