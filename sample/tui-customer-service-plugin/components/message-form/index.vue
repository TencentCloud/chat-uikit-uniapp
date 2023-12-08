<template>
  <div v-if="content.type === 1" class="messageForm">
    <FormBranch
      :title="content.header"
      :list="content.items"
      @item-click="handleContentListItemClick"
    ></FormBranch>
  </div>
  <div v-else class="messageForm">
    <FormInput
      :title="content.header"
      @input-submit="handleFormSaveInputSubmit"
    ></FormInput>
  </div>
</template>
 
<script lang="ts">
import vue from "../../adapter-vue";
import FormBranch from "./form-branch.vue";
import FormInput from "./form-input.vue";

const { computed } = vue;

interface branchItem {
  content: string;
  desc: string;
}

interface Props {
  payload: any;
}

export default {
  props: ["payload"],
  emits: ["sendMessage"],
  components: {
    FormBranch,
    FormInput,
  },
  setup(props: Props, { emit }) {
    const content = computed(() => {
      return props.payload?.content || {
        type: 0,
        header: '',
        items: []
      }
    })

    const handleContentListItemClick = (branch: branchItem) => {
      emit("sendMessage", { text: branch.content })
    };

    const handleFormSaveInputSubmit = (text: string) => {
      emit("sendMessage", { text })
    };
    return {
      content,
      handleContentListItemClick,
      handleFormSaveInputSubmit,
    }
  }
}
</script>
<style lang="scss">
.messageForm {
  max-width: 300px;
}
</style>
