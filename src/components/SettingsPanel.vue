<template>
    <Row class="fill-size" style="width: 420px">
      <Column class="selector">
        <button
            v-for="(item, index) in state.selectors"
            :class="`ma selector-item ${state.selectIndex === index ? 'selector-item-selected' : 'light-gray-click'}`"
            style="border-radius: 0"
            @click="state.selectIndex = index"
        >
          {{item}}
        </button>
      </Column>
      <div style="flex-grow: 1; background-color: var(--settings-content-bg)" class="fill-height">
        <UISettings v-if="state.selectIndex === 0"/>
        <VisualizerSettings v-if="state.selectIndex === 2"/>
      </div>
    </Row>
</template>

<script setup lang="ts">
import Row from "./Row.vue";
import Column from "./Column.vue";
import {reactive} from "vue";
import UISettings from "./settings/UISettings.vue";
import VisualizerSettings from "./settings/VisualizerSettings.vue";
import {Icon} from "../ts/icon/Icon";

const state = reactive({
  selectIndex: 0,
  selectors: [
      Icon.FormatPaint, Icon.MusicNote
  ]
})
</script>

<style scoped>
.settings-card {
  width: 420px;
  height: 100%;
  padding: 0;
  background-color: black;
}
.selector {
  width: 56px;
  border-right: 1px solid #00000040;
  height: 100%;
  background-color: var(--settings-selector-bar-bg);
}
.selector-item {
  width: 100%;
  text-align: center;
  padding: 4px 0 4px 0;
  cursor: pointer;
  user-select: none;
  color: white;
  aspect-ratio: 1/1;
  border-left: 4px solid transparent;
}
.selector-item-selected {
  border-left: 4px solid dodgerblue;
  background-color: #00000040;
}
</style>