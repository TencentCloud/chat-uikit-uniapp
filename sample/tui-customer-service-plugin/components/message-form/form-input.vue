<template>
  <div>
    <div class="cardTitle">{{ props.title }}</div>
    <div class="formInputBox">
      <input class="formInput" v-model="text" />
      <button
        class="formButton"
        :disabled="disabled"
        @click="listItemClick"
      >
      </button>
    </div>
  </div>
</template>
 
<script lang="ts">
import vue from "../../adapter-vue";

const { ref } = vue;

interface Props {
  title: string;
}
export default {
  props: ["title"],
  emits: ["input-submit"],
  setup(props: Props, { emit }) {
    const disabled = ref<boolean>(false);
    const text = ref<string>('');

    const listItemClick = (): void => {
      disabled.value = true;
      emit("input-submit", text.value);
    };
    return {
      disabled,
      text,
      listItemClick,
      props
    }
  }
}
</script>
<style lang="scss">
.cardTitle {
  margin-bottom: 8px;
}
.formInputBox {
  display: flex;
  button:disabled {
    background: #d8d8d8;
  }
}
.formInput {
  width: 100%;
  height: 36px;
  border-radius: 8px 0px 0px 8px;
  border: 1px rgba(221, 221, 221, 1) solid;
}
.formButton {
  position: relative;
  height: 40px;
  width: 42px;
  font-size: 16px;
  border-radius: 0px 8px 8px 0px;
  border: 0px rgba(221, 221, 221, 1) solid;
  background: #006eff;
  color: white;
  cursor: pointer;
}
.formButton::before {
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
