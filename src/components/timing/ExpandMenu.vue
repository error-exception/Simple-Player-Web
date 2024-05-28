<script setup lang="ts">
import {computed, ref} from "vue";

const props = withDefaults(defineProps<{
  items: string[],
  align?: 'center' | 'left' | 'right'
}>(), {
  align: 'left',
})
const value = defineModel({ default: '' })
const selectedIndex = computed({
  get() {
    return props.items.indexOf(value.value)
  },
  set(v: number) {
    value.value = props.items[v]
  }
})
const hidden = ref(true)
const select = (index: number) => {
  console.log("fasfasf")
  selectedIndex.value = index
  hidden.value = true
}
</script>

<template>
  <div class="relative">
    <input
        @focus="hidden = false"
        autofocus
        class="expand-select"
        :class="{
          'text-center': align === 'center',
          'text-left': align === 'left',
          'text-right': align === 'right',
        }"
        readonly
        :value="value"
    >
    <div
      class="expand-item-list"
      :style="{
        display: hidden ? 'none' : 'block'
      }"
    >
      <div
          v-for="(item, index) in items"
          @click="select(index)"
          :class="{
            'expand-item-selected': index === selectedIndex
          }"
      >
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
  padding: 0 8px;
}

.expand-select:focus {
  border: 2px solid #38e7ab;
}
.expand-item-list {
  @apply text-white w-full;
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