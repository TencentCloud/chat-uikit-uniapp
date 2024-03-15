<template>
  <div>
    <p
      v-if="props.title"
      class="card-title"
    >
      {{ props.title }}
    </p>
    <div
      v-for="(item, index) in props.list"
      :key="index"
      class="form-branch-item"
      @click="listItemClick(item)"
    >
      {{ item.content }}
    </div>
  </div>
</template>

<script lang="ts">

interface branchItem {
  content: string;
  desc: string;
}

interface Props {
  title: string;
  list: Array<branchItem>;
}

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => ([]),
    },
  },
  emits: ['input-click'],
  setup(props: Props, { emit }) {
    const listItemClick = (branch: branchItem): void => {
      emit('input-click', branch);
    };
    return {
      props,
      listItemClick,
    };
  },
};
</script>
<style lang="scss">
.card-title {
  margin-bottom: 8px;
}

.form-branch-item {
  font-weight: 400;
  color: rgba(54, 141, 255, 1);
  padding-top: 5px;
  cursor: pointer;
  padding-bottom: 5px;
}
</style>
