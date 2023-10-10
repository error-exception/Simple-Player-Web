<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {Nullable} from "../../ts/type";
const props = withDefaults(defineProps<{
  color?: string,
}>(), {
  color: '#33cb98',
})
const value = ref(false)
const checkValue = defineModel<boolean>({ default: false })
watch(value, v => checkValue.value = v)

const checkBox = ref<Nullable<HTMLInputElement>>(null)
const callback = () => {
  checkBox.value?.style.setProperty('--checkbox-color', props.color)
}
watch(() => props.color, callback)
onMounted(callback)
</script>
<template>
  <input type="checkbox" class="o-checkbox" v-model="value">
</template>
<style scoped>
.o-checkbox {
  --checkbox-color: #33cb98;
  transition: all 100ms ease-in-out;
  width: 36px;
  height: 16px;
  border: 3px solid var(--checkbox-color);
  border-radius: 999px;
  appearance: none;
}
.o-checkbox:hover, .o-checkbox:checked:hover {
  box-shadow: 0 0 8px var(--checkbox-color);
  width: 48px;
}
.o-checkbox:checked {
  appearance: none;
  transition: all 100ms ease-in-out;
  height: 16px;
  border: 3px solid var(--checkbox-color);
  border-radius: 999px;
  background-color: var(--checkbox-color);
  width: 36px;
}
</style>