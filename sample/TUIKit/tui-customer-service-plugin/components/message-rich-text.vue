<template>
  <div
    class="rich-text"
    v-html="formatedContent"
  />
</template>

<script lang="ts">
import vue from '../adapter-vue';
import { marked } from 'marked';
import { customerServicePayloadType } from '../interface';
const { computed } = vue;

interface Props {
  payload: customerServicePayloadType;
}

export default {
  props: {
    payload: {
      type: Object as () => customerServicePayloadType,
      default: () => ({}),
    },
  },
  setup(props: Props) {
    const formatedContent = computed(() => {
      let richtext = marked.parse(props.payload.content);
      const regex = new RegExp('<img', 'gi');
      richtext = richtext.replace(regex, `<img style="max-width: 100%;"`);
      return richtext;
    });
    return {
      props,
      formatedContent,
    };
  },
};
</script>
<style lang="scss">
.rich-text {
  div,
  ul,
  ol,
  dt,
  dd,
  li,
  dl,
  h1,
  h2,
  h3,
  h4,
  p,
  img,
  a {
    max-width: 100%;
  }

  a {
    color: blue;
  }
}
</style>
