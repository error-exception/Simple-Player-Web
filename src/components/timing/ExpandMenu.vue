<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps<{
  modelValue: string,
  items: string[]
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()
const selectedIndex = ref(0)
const hidden = ref(true)

watch(selectedIndex, value => {
  emits('update:modelValue', props.items[value])
}, {immediate: true})

const select = (index: number) => {
  selectedIndex.value = index
  hidden.value = true
}
</script>

<template>
  <div class="relative">
    <input @focus="hidden = false" autofocus class="expand-select text-center" readonly :value="items[selectedIndex]">
    <div
      class="expand-item-list"
      :style="{
          display: hidden ? 'none' : 'block'
      }"
    >
      <div @click="select(index)" v-for="(item, index) in items"
           :class="{ 'expand-item-selected': index === selectedIndex }">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.expand-select {
  background-color: black;
  color: white;
  border-radius: 4px;
  width: 100%;
  height: 32px;
  border: 2px solid transparent;
}

.expand-select:focus {
  border: 2px solid #38e7ab;
}
.expand-item-list {
  @apply text-white;
  background-color: #2e3835;
  position: absolute;
  box-shadow: 0 0 8px rgba(0, 0, 0, .8);
  transform: translateY(8px) translateX(-50%);
  left: 50%;
  z-index: 100;
}
.expand-item-list > div {
  padding: 8px 24px;
  cursor: pointer;
}

.expand-item-list > div:hover {
  background-color: #5c7069;
}

.expand-item-selected {
  background-color: #5c7069;
}
</style>