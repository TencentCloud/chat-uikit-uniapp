<template>
  <ToolbarItemContainer
    :iconFile="toolbarConfig.icon"
    :title="toolbarConfig.title"
    :iconWidth="toolbarConfig.iconWidth"
    :iconHeight="toolbarConfig.iconHeight"
    :needDialog="false"
    @onIconClick="handleIconClick"
  >
    <div :class="['file-upload', !isPC && 'file-upload-h5']">
      <input
        ref="inputRef"
        title="文件"
        type="file"
        data-type="file"
        accept="*"
        @change="handleWebFileChange"
      >
    </div>
  </ToolbarItemContainer>
</template>
<script lang="ts" setup>
import ToolbarItemContainer from '../toolbar-item-container/index.vue';
import { useUpload, UploadType } from '../uploadToolkit';

const {
  inputRef,
  toolbarConfig,
  isPC,
  isUniFrameWork,
  handleIconClick,
  handleWebFileChange,
} = useUpload(UploadType.FILE);
</script>
<style lang="scss" scoped>
@import "../../../../assets/styles/common";
</style>
