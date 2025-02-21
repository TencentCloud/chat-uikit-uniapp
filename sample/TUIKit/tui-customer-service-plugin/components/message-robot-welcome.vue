<template>
  <div class="welcome-card">
    <div class="welcome-title">
      <div class="welcome-title-left-container">
        <Icon :src="imRobotGuess" />
        <p
          v-if="title"
          class="card-title"
        >
          {{ title }}
        </p>
      </div>
      <div
        class="change-wrapper"
        @click="changeBranchList()"
      >
        <Icon :src="refresh" />
      </div>
    </div>
    <div
      v-for="(item, index) in showList"
      :key="index"
      class="welcome-item"
      @click="handleContentListItemClick(item)"
    >
      <div>{{ item.content }}</div>
      <Icon :src="iconRight" />
    </div>
  </div>
</template>

<script lang="ts">
import vue from '../adapter-vue';
import imRobotGuess from '../assets/imRobotGuess.svg';
import refresh from '../assets/refresh.svg';
import iconRight from '../assets/iconRight.svg';
import Icon from './customer-icon.vue';
import { customerServicePayloadType } from '../interface';

const { reactive, toRefs } = vue;

interface Props {
  payload: customerServicePayloadType;
}

interface welcomeBranchItem {
  id: string;
  content: string;
  answer: string;
}

export default {
  components: {
    Icon,
  },
  props: {
    payload: {
      type: Object as () => customerServicePayloadType,
      default: () => ({ content: { title: '', items: [] } }),
    },
  },
  emits: ['sendMessage'],
  setup(props: Props, { emit }) {
    const data = reactive({
      // title
      title: props.payload?.content?.title || '',
      // all branch list
      list: props.payload?.content?.items || [],
      // current branch list
      showList: (props.payload?.content?.items || []).slice(0, 5),
      // current page number
      pageNumber: 1,
    });

    const handleContentListItemClick = (branch: welcomeBranchItem) => {
      emit('sendMessage', { text: branch.content });
    };

    const changeBranchList = () => {
      if (data.pageNumber * 5 >= data.list?.length) {
        data.pageNumber = 0;
      }
      data.showList = data.list?.slice(
        data.pageNumber * 5,
        data.pageNumber * 5 + 5,
      );
      data.pageNumber += 1;
    };

    return {
      ...toRefs(data),
      handleContentListItemClick,
      imRobotGuess,
      refresh,
      iconRight,
      changeBranchList,
    };
  },
};
</script>

<style lang="scss">
.welcome-card {
  min-width: 250px;
  max-width: 350px;

  .welcome-title {
    display: flex;
    height: 40px;
    justify-content: space-between;
    align-items: center;
  }

  .welcome-title-left-container {
    display: flex;
    align-items: center;
  }

  .card-title {
    display: inline-block;
    margin-left: 8px;
    font-size: 16px;
  }

  .el-link {
    display: block;
    font-weight: 400;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  /* stylelint-disable */
  .el-link__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /* stylelint-enable */

  .branch-number {
    margin-left: 15px;
    margin-right: 15px;
    font-size: 20px;
    display: inline-block;
  }

  .change-wrapper {
    cursor: pointer;
  }

  .welcome-item {
    padding: 6px;
    color: #999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .welcome-item:hover {
    background: #f2f7ff;
  }
}
</style>
