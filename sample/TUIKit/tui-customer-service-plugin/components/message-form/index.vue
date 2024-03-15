<template>
  <div
    v-if="content.type === 1"
    class="message-form"
  >
    <FormBranch
      :title="content.header"
      :list="content.items"
      @input-click="handleContentListItemClick"
    />
  </div>
  <div
    v-else
    class="message-form"
  >
    <FormInput
      :title="content.header"
      @input-submit="handleFormSaveInputSubmit"
    />
  </div>
</template>

<script lang="ts">
import vue from '../../adapter-vue';
import FormBranch from './form-branch.vue';
import FormInput from './form-input.vue';

const { computed } = vue;

interface branchItem {
  content: string;
  desc: string;
}

interface Props {
  payload: any;
}

export default {
  components: {
    FormBranch,
    FormInput,
  },
  props: {
    payload: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['sendMessage'],
  setup(props: Props, { emit }) {
    const content = computed(() => {
      return props.payload?.content || {
        type: 0,
        header: '',
        items: [],
      };
    });

    const handleContentListItemClick = (branch: branchItem) => {
      emit('sendMessage', { text: branch.content });
    };

    const handleFormSaveInputSubmit = (text: string) => {
      emit('sendMessage', { text });
    };
    return {
      content,
      handleContentListItemClick,
      handleFormSaveInputSubmit,
    };
  },
};
</script>
<style lang="scss">
.message-form {
  max-width: 300px;
}
</style>
