<template>
  <div>
    <p v-if="props.title" class="cardTitle">
      {{ props.title }}
    </p>
    <div
      class="formBranchItem"
      @click="listItemClick(item)"
      v-for="(item, index) in props.list"
      :key="index"
    >
      {{ item.content }}
    </div>
  </div>
</template>
 
<script lang="ts">
import vue from "../../adapter-vue";

const { defineEmits, defineProps, withDefaults } = vue;

interface branchItem {
  content: string;
  desc: string;
}

interface Props {
  title: string;
  list: Array<branchItem>;
}

export default {
  props: ["title", "list"],
  emits: ["input-click"],
  setup(props: Props, { emit }) {
    const listItemClick = (branch: branchItem): void => {
      emit("input-click", branch);
    };
    return {
      props,
      listItemClick
    }
  }
}
</script>
<style lang="scss">
.cardTitle {
  margin-bottom: 8px;
}
.formBranchItem {
  font-weight: 400;
  color: rgba(54, 141, 255, 1);
  padding-top: 5px;
  cursor: pointer;
  padding-bottom: 5px;
}
</style>
