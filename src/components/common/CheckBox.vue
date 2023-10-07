<template>
  <div :class="checkState ? 'o-checked' : 'o-checkbox'" @click="check"></div>
</template>

<script setup lang="ts">

import {ref, watch} from "vue";

const props = withDefaults(defineProps<{
  modelValue?: boolean,
  color?: string,
  checked?: boolean
}>(), {
  color: '#33cb98',
  checked: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'change'): void
}>()

const checkState = ref<boolean>(props.checked)
watch(() => props.checked, (value) => {
  checkState.value = value
})
watch(() => props.modelValue, (value) => {
  checkState.value = value
})
function check() {
  checkState.value = !checkState.value
  emit("update:modelValue", checkState.value)
  emit("change")
}
</script>

<style scoped>
.o-checkbox {
  transition: all 100ms ease-in-out;
  width: 36px;
  height: 16px;
  border: 3px solid #33cb98;
  border-radius: 999px;
}
.o-checkbox:hover, .o-checked:hover {
  box-shadow: 0 0 8px #33cb98;
}
.o-checked {
  transition: all 100ms ease-in-out;
  height: 16px;
  border: 3px solid #33cb98;
  border-radius: 999px;
  background-color: #33cb98;
  width: 48px;
}
</style>