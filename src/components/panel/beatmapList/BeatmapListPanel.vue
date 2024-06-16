<script setup lang="ts">
import OSUPanel from "../../framework/OSUPanel.vue";
import {Color} from "../../../ts/webgl/base/Color";
import TempOSUPlayManager from "../../../ts/player/TempOSUPlayManager";
import {beatmapDirectoryId} from "../../../ts/global/GlobalState";
import {Icon} from "../../../ts/icon/Icon";
import Column from "../../common/Column.vue";
import Row from "../../common/Row.vue";
import {OSUPanelStack} from "../../../ts/osu/OSUPanelStack";
import BasicButton from "../../common/BasicButton.vue";

const theme = Color.fromHex(0)

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
}

function close() {
  OSUPanelStack.pop()
}

</script>

<template>
  <OSUPanel
      panel-id="beatmapList"
      :theme-color="theme"
  >
    <Column class="bg-green-950 w-full h-full" :gap="16">
      <Row class="w-full bg-green-900 p-4" center-vertical>
        <span class="text-white text-xl">
          铺面列表
        </span>
        <Row class="ml-auto" :gap="16">
          <BasicButton
              :color="Color.fromRGB(20, 83, 45)"
              :apply-scale="false"
              v-osu-button
              @click="showBeatmapList()"
              class="text-white py-2 px-3 rounded-md text-sm"
          >
            重新选择
          </BasicButton>
          <BasicButton
              :color="Color.fromRGB(20, 83, 45)"
              :apply-scale="false"
              class="ma text-white p-2 rounded-md"
              style="font-size: 24px"
              @click="close()"
          >
            {{ Icon.Close }}
          </BasicButton>
        </Row>
      </Row>
      <Column class="fill-width flex-grow overflow-y-scroll no-scroller px-4 pb-4">
        <BasicButton
            :color="Color.fromRGB(5, 46, 22)"
            class="w-full p-3 rounded-md text-white hover:text-yellow-400"
            v-for="(item, index) in files"
            v-osu-button
            @click="play(item, index)"
        >
          <Row
              :gap="16"
              center-vertical
              class="w-full"
          >
            <span style="color: #ffffff80;">{{ index + 1 }}</span>
            <Column class="w-full" :gap="4" left>
            <span class="text-[16px]">{{ item.name }}</span>
              <span
                  style="font-size: 12px;"
                  class="text-yellow-400"
              >
              {{ (item.size / 1024 / 1024).toFixed(2) }} MB
            </span>
            </Column>
<!--            <button-->
<!--                class="ma text-white p-2 hover:text-yellow-400 play-button opacity-0 transition"-->
<!--                style="font-size: 24px"-->
<!--            >-->
<!--              {{ Icon.PlayCircleOutline}}-->
<!--            </button>-->
          </Row>
        </BasicButton>
      </Column>
    </Column>
  </OSUPanel>
</template>
<style scoped>
</style>