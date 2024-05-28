<script lang="ts" setup>
import Column from "../common/Column.vue";
import Row from "../common/Row.vue";
import CheckBox from "../common/CheckBox.vue";
import {UIState} from "../../ts/global/UISettings";
import ExpandMenu from "../timing/ExpandMenu.vue";
import {ref, watch} from "vue";
import BackgroundManager from "../../ts/global/BackgroundManager";
import OSUButton from "../common/OSUButton.vue";


const backgroundType = [
    'default', 'beatmap', 'custom'
]
const item = ref(
    backgroundType[BackgroundManager.currentLoader.value] ?? 'beatmap'
)
watch(item, (value, oldValue) => {
  if (value === 'default') {
    BackgroundManager.changeLoader(BackgroundManager.Default)
  } else if (value === 'beatmap') {
    BackgroundManager.changeLoader(BackgroundManager.Beatmap)
  } else if (value === 'custom') {
    BackgroundManager.changeLoader(BackgroundManager.Custom).then(v => {
      if (!v) {
        item.value = oldValue
      }
    })
  }
})

function refreshCustomBackground() {
  BackgroundManager.changeCustomBackground()
}
</script>
<template>
  <Column class="w-full h-full text-white p-4" :gap="16">
    <Row class="w-full" center-vertical>
      <span>Logo Drag</span>
      <CheckBox class="ml-auto" v-model="UIState.logoDrag"/>
    </Row>
    <Row class="w-full" center-vertical>
      <span class="flex-row">Logo Hover</span>
      <CheckBox class="ml-auto" v-model="UIState.logoHover"/>
    </Row>
    <Row class="w-full" center-vertical>
      <span class="flex-row">Star Smoke</span>
      <CheckBox class="ml-auto" v-model="UIState.starSmoke"/>
    </Row>
    <Column class="w-full" center-vertical :gap="8">
      <span>Background</span>
      <ExpandMenu :items="backgroundType" v-model="item" class="w-full"/>
    </Column>
    <Row class="w-full" center>
      <OSUButton
          v-osu-button
          fill
          @click="refreshCustomBackground()"
      >
        Change Custom Background
      </OSUButton>
    </Row>
  </Column>
</template>