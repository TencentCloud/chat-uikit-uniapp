<template>
  <div class="branchCard">
    <p v-if="content.header" class="branchTitle">
      {{ content.header }}
    </p>
    <div
      @click="handleContentListItemClick(item)"
      class="branchItem"
      v-for="(item, index) in content.items"
      :key="index"
      :style="{ borderWidth: content.header ? '1px 0 0px 0' : '0px 0 1px 0' }"
    >
      {{ item.content }}
      <Icon :src="iconRight" />
    </div>
  </div>
</template>


<script lang="ts">
import vue from "../adapter-vue";
import { customerServicePayloadType } from "../interface";
import iconRight from "../assets/iconRight.svg";
import Icon from "./Icon.vue";

const { computed } = vue;

interface Props {
  payload: customerServicePayloadType;
}

interface branchItem {
  content: string;
  desc: string;
}

export default {
  props: ["payload"],
  emits: ["sendMessage"],
  components: {
    Icon,
  },
  setup(props:Props, { emit }) {
    const content = computed(() => {
      return props?.payload?.content || {
        header: undefined,
        items: [],
      };
    })

    const handleContentListItemClick = (branch: branchItem) => {
      emit("sendMessage", { text: branch.content });
    };

    return {
      content,
      handleContentListItemClick,
      iconRight,
    }

  }
}
</script>

<style lang="scss">
.branchCard {
  min-width: 250px;
  max-width: 350px;
  .branchTitle {
    margin-bottom: 8px;
    border-radius: 0px 10px 10px 10px;
  }
  .branchItem {
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
