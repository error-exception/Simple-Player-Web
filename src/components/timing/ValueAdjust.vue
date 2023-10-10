<script setup lang="ts">
import Row from "../common/Row.vue";
import {ref} from "vue";
import ExpandMenu from "./ExpandMenu.vue";
import {Icon} from "../../ts/icon/Icon";
import Column from "../common/Column.vue";

defineProps<{
  label: string
}>()
const value = defineModel<number>({
  default: 60
})
const step = ref('')

const increase = () => {
  const v = parseInt(step.value)
  value.value += v
}
const decrease = () => {
  const v = parseInt(step.value)
  value.value -= v
}
</script>

<template>
  <Column class="flex-grow bg-[--bpm-color-3] rounded p-2" style="flex-basis: 0" :gap="8">
    <span class="w-full text-center text-white text-sm">{{ label }}</span>
    <input class="w-full bg-black text-white rounded text-center text-[22px] py-2" :value="value">
    <Row class="w-full text-white" :gap="8">
      <button @click="decrease()" class="ma adjust-btn">{{ Icon.Remove }}</button>
      <ExpandMenu class="flex-grow" :items="['1', '5', '10', '100']" v-model="step"/>
      <button @click="increase()" class="ma adjust-btn">{{ Icon.Add }}</button>
    </Row>
  </Column>
</template>

<style scoped>
.adjust-btn {
  @apply hover:bg-[--bpm-color-5] rounded-full;
  min-width: 32px;
  min-height: 32px;
}
</style>