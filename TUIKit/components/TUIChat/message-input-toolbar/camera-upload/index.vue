<template>
  <ToolbarItemContainer
    :iconFile="toolbarConfig.icon"
    :title="toolbarConfig.title"
    :iconWidth="toolbarConfig.iconWidth"
    :iconHeight="toolbarConfig.iconHeight"
    :needDialog="false"
    @onIconClick="handleIconClick"
  >
    <div
      v-if="!isUniFrameWork"
      :class="['image-upload', !isPC && 'image-upload-h5']"
    >
      <input
        ref="inputRef"
        title="视频"
        type="file"
        data-type="video"
        accept="video/*"
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
} = useUpload(UploadType.CAMERA);
</script>

<style lang="scss" scoped>
@import "../../../../assets/styles/common";
</style>
