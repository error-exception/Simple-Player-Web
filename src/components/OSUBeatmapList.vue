<script setup lang="ts">
import {beatmapDirectoryId} from '../ts/global/GlobalState';
import {loadOSZ} from '../ts/osu/OSZ';
import Column from './common/Column.vue';
import Row from './common/Row.vue';
import TempOSUPlayManager from "../ts/player/TempOSUPlayManager";
import {PLAYER} from "../ts/build";
import {Icon} from "../ts/icon/Icon";

defineEmits<{
  (e: 'close'): void
}>()

const files = TempOSUPlayManager.list

if (files.value.length === 0) {
  showBeatmapList()
}

async function showBeatmapList() {
  //@ts-ignore
  const handle = await window.showDirectoryPicker({id: beatmapDirectoryId})
  const list: File[] = []
  for await (const fileHandle of handle.values()) {
    const file = await fileHandle.getFile() as File
    list.push(file)
  }
  files.value = list.sort((a, b) => {
    return b.lastModified - a.lastModified
  })
}

const play = (file: File, index: number) => {
  TempOSUPlayManager.playAt(index, true)
  // loadOSZ(file)
  // if (!PLAYER)
  //   TempOSUPlayManager.currentIndex.value = index
}

</script>
<template>
  <Column class="osu-beatmap-list-box">
      <Row class="w-full h-12 px-4" center-vertical>
        <button @click="showBeatmapList()" class="text-white p-4 ml-auto hover:bg-gray-700 active:bg-gray-600">Reload</button>
        <button class="ma p-4 text-white hover:bg-gray-700 active:bg-gray-600" @click="$emit('close')">{{ Icon.Close }}</button>
      </Row>
      <Column class="fill-width flex-grow osu-beatmap-list-content">
        <Row class="fill-width osu-beatmap-list-content-item" v-for="(item, index) in files" @click="play(item, index)"
             center-vertical :gap="32">
          <span style="color: #ffffff80;">{{ index + 1 }}</span>
          <Column class="fill-width" :gap="8">
            <span class="text-white text-[16px]">{{ item.name }}</span>
            <span style="color: #ffffff80; font-size: 14px;">{{ (item.size / 1024 / 1024).toFixed(2) }} MB</span>
          </Column>
        </Row>
      </Column>
    </Column>
</template>
<style scoped>
.osu-beatmap-list-box {
  background-color: #2e3835;
  width: 1200px;
  height: 100vh;
  pointer-events: auto;
}

.osu-beatmap-list-content {
  
  overflow-y: scroll;
  padding: 8px;
}

.osu-beatmap-list-content-item {
  padding: 8px 24px;
  border-radius: 4px;
}

.osu-beatmap-list-content-item:hover {
  background-color: #556963;
}

.osu-beatmap-list-content-item:active {
  background-color: #647c75;
  
}
</style>