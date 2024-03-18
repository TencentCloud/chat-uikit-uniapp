<template>
  <div>
    <div class="card-title">
      {{ props.title }}
    </div>
    <div class="form-input-box">
      <input
        v-model="text"
        class="form-input"
      >
      <button
        class="form-button"
        :disabled="disabled"
        @click="listItemClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import vue from '../../adapter-vue';

const { ref } = vue;

interface Props {
  title: string;
}
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  emits: ['input-submit'],
  setup(props: Props, { emit }) {
    const disabled = ref<boolean>(false);
    const text = ref<string>('');

    const listItemClick = (): void => {
      disabled.value = true;
      emit('input-submit', text.value);
    };
    return {
      disabled,
      text,
      listItemClick,
      props,
    };
  },
};
</script>
<style lang="scss">
.card-title {
  margin-bottom: 8px;
}

.form-input-box {
  display: flex;

  button:disabled {
    background: #d8d8d8;
  }
}

.form-input {
  width: 100%;
  height: 36px;
  border-radius: 8px 0 0 8px;
  border: 1px rgba(221, 221, 221, 1) solid;
}

.form-button {
  position: relative;
  height: 40px;
  width: 42px;
  font-size: 16px;
  border-radius: 0 8px 8px 0;
  border: 0 rgba(221, 221, 221, 1) solid;
  background: #006eff;
  color: white;
  cursor: pointer;
}

.form-button::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  top: 50%;
  right: 40%;
  border-left: 2px solid #FFF;
  border-bottom: 2px solid #FFF;
  transform: translate(0, -50%) rotate(-135deg);
}
</style>
