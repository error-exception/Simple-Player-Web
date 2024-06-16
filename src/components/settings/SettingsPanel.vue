<script setup lang="ts">
import Row from "../common/Row.vue";
import Column from "../common/Column.vue";
import {reactive} from "vue";
import UISettings from "./UISettings.vue";
import VisualizerSettings from "./VisualizerSettings.vue";
import {Icon} from "../../ts/icon/Icon";
import SelectorButton from "./SelectorButton.vue";

const state = reactive({
  selectIndex: 0,
  selectors: [{
    icon: Icon.FormatPaint,
    title: '界面'
  }, {
    icon: Icon.MusicNote,
    title: '可视化'
  }]
})
</script>

<template>
  <Row class="h-full" style="width: 600px">
    <Column class="selector" :gap="4">
      <SelectorButton
          v-for="(item, index) in state.selectors"
          :title="item.title"
          :icon="item.icon"
          :active="state.selectIndex === index"
          @click="state.selectIndex = index"
      />
    </Column>
    <div
        style="flex-grow: 1; background-color: var(--settings-content-bg)"
        class="fill-height"
    >
      <UISettings v-if="state.selectIndex === 0"/>
      <VisualizerSettings v-if="state.selectIndex === 2"/>
    </div>
  </Row>
</template>

<style scoped>
.selector {
  @apply py-4 px-2;
  width: fit-content;
  background-color: var(--settings-selector-bar-bg);
}

.selector-item {
  @apply text-white rounded-md flex flex-row items-center
  cursor-pointer transition-all duration-300 ease-in-out
  hover:bg-white hover:bg-opacity-20 px-6
  py-2 opacity-75
  ;
  font-size: 14px;
}

.selector-item > div:first-child {
  @apply w-1 bg-pink-500 h-0 rounded-full transition-all mr-4;
}

.selector-item > div:nth-child(2) {
  @apply mr-2;
  font-size: 24px;
}

.selector-item-selected {
  @apply opacity-100;
}

.selector-item-selected > div:first-child {
  @apply h-6;
}
</style>