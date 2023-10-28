<script setup lang="ts">
import Row from "../common/Row.vue";
import Column from "../common/Column.vue";
import {Icon} from "../../ts/icon/Icon";

withDefaults(defineProps<{
  text: string,
  progress?: number
}>(), {
  progress: 0
})
</script>
<template>
  <Column class="w-full relative h-16 bg-[--item-bg-color] rounded overflow-hidden">
    <Row class="absolute w-full h-full">
      <button class="bg-[--item-icon-bg-color] h-full aspect-square text-[--item-progress-color] ma">
        {{ Icon.RadioButtonUnchecked }}
      </button>
      <Row center class="text-white px-4 text-sm">
        {{ text }}
      </Row>
    </Row>
    <div
      :style="`transform: scaleX(${progress})`"
      class="bg-[--item-progress-color] h-1 w-full origin-left absolute bottom-0 transition-transform"
    ></div>
  </Column>
</template>

<style scoped>
</style>