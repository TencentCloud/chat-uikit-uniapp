<template>
  <div class="branch-card">
    <p
      v-if="content.header || content.title"
      class="branch-title"
    >
      {{ content.header || content.title}}
    </p>
    <div
      v-for="(item, index) in content.items"
      :key="index"
      class="branch-item"
      :style="{ borderWidth: content.header ? '1px 0 0px 0' : '0px 0 1px 0' }"
      @click="handleContentListItemClick(item)"
    >
      {{ item.content }}
      <Icon :src="iconRight" />
    </div>
  </div>
</template>

<script lang="ts">
import vue from '../adapter-vue';
import { customerServicePayloadType } from '../interface';
import iconRight from '../assets/iconRight.svg';
import Icon from './customer-icon.vue';

const { computed } = vue;

interface Props {
  payload: customerServicePayloadType;
}

interface branchItem {
  content: string;
  desc: string;
}

export default {
  components: {
    Icon,
  },
  props: {
    payload: {
      type: Object as () => customerServicePayloadType,
      default: () => ({}),
    },
  },
  emits: ['sendMessage'],
  setup(props: Props, { emit }) {
    const content = computed(() => {
      return props?.payload?.content || {
        header: undefined,
        items: [],
      };
    });

    const handleContentListItemClick = (branch: branchItem) => {
      emit('sendMessage', { text: branch.content });
    };

    return {
      content,
      handleContentListItemClick,
      iconRight,
    };
  },
};
</script>

<style lang="scss">
.branch-card {
  min-width: 250px;
  max-width: 350px;

  .branch-title {
    margin-bottom: 8px;
    border-radius: 0 10px 10px;
  }

  .branch-item {
    display: flex;
    justify-content: space-between;
    border-style: dotted;
    border-color: #d8d8d8;
    font-weight: 400;
    color: rgba(54, 141, 255, 1);
    padding-top: 5px;
    cursor: pointer;
    padding-bottom: 5px;
  }
}
</style>
