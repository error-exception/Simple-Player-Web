<script setup lang="ts">
import OSUPanel from "../../framework/OSUPanel.vue";
import {Color} from "../../../ts/webgl/base/Color";
import Row from "../../common/Row.vue";
import {Icon} from "../../../ts/icon/Icon";
import Column from "../../common/Column.vue";
import {OSUPanelStack} from "../../../ts/osu/OSUPanelStack";
import MarkdownIt from "../../common/MarkdownIt.vue";
import helpMD from '../../../assets/HELP.md?raw'

function close() {
  OSUPanelStack.pop()
}

interface Category {
  title: string
  level: number
}

const categories = generateCategory(helpMD)
function generateCategory(mdContent: string): Category[] {
  const lines = mdContent.split('\n').filter(v => v.startsWith('#'))
  return lines.map(v => {
    const line = v.trimStart()
    let sharpCount = 0
    for (const char of line) {
      if (char === '#') {
        sharpCount++
      } else {
        break
      }
    }
    return {
      title: line.substring(sharpCount).trim(),
      level: sharpCount,
    }
  })
}

</script>

<template>
  <OSUPanel
      panel-id="help"
      :theme-color="Color.Transparent"
  >
    <Column
        class="bg-amber-950 w-full h-fit"
    >
      <Row
          class="w-full bg-amber-800 text-white py-2 px-4"
          :gap="8"
          center-vertical
      >
        <span class="ma">{{ Icon.Help }}</span>
        <span class="text-xl">帮助</span>
        <button
            class="ma ml-auto hover:bg-amber-600 transition active:bg-amber-500 rounded-md p-3"
            @click="close()"
        >
          {{ Icon.Close }}
        </button>
      </Row>
      <Row>
        <Column class="bg-amber-900 w-72 p-4">
          <div
              v-for="item in categories"
              class="text-white py-1 px-1 cursor-pointer hover:bg-amber-800 transition active:bg-amber-700 rounded-md"
              :style="{
                'padding-left': `${item.level * 16}px`,
              }"
          >
            {{ item.title }}
          </div>
        </Column>
        <MarkdownIt
            class="p-8"
            :content="helpMD"
        />
      </Row>

    </Column>
  </OSUPanel>
</template>

<style scoped>

</style>