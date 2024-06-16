<script lang="ts" setup>
import Column from "../common/Column.vue";
import Row from "../common/Row.vue";
import CheckBox from "../common/CheckBox.vue";
import {UIState} from "../../ts/global/UISettings";
import ExpandMenu from "../common/ExpandMenu.vue";
import {ref, watch} from "vue";
import BackgroundManager from "../../ts/global/BackgroundManager";
import OSUButton from "../common/OSUButton.vue";
import {OSZConfig} from "../../ts/global/GlobalState";
import LocalBackgroundLoader from "../../ts/global/LocalBackgroundLoader";


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

function reloadCustomBackground() {
  LocalBackgroundLoader.forceInit()
}
</script>
<template>
  <Column class="w-full h-full text-white p-6" :gap="16">
    <h1 class="text-3xl mb-4 mt-2">界面</h1>
    <Row class="w-full" center-vertical>
      <span>Logo Drag</span>
      <CheckBox class="ml-auto" v-model="UIState.logoDrag"/>
    </Row>
    <Row class="w-full" center-vertical>
      <span class="flex-row">Logo Hover</span>
      <CheckBox class="ml-auto" v-model="UIState.logoHover"/>
    </Row>
    <Column class="w-full" center-vertical :gap="8">
      <span>背景</span>
      <ExpandMenu :items="backgroundType" v-model="item" class="w-full"/>
    </Column>
    <Row class="w-full" center>
      <OSUButton
          v-osu-button
          fill
          @click="refreshCustomBackground()"
      >
        切换自定义背景
      </OSUButton>
    </Row>
    <Row class="w-full" center>
      <OSUButton v-osu-button fill @click="reloadCustomBackground()">
        修改自定义背景文件夹
      </OSUButton>
    </Row>
    <Row class="w-full" center>
      <span>加载视频</span>
      <CheckBox class="ml-auto" v-model="OSZConfig.loadVideo"/>
    </Row>
  </Column>
</template>