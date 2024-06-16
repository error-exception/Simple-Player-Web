<script setup lang="ts">
import OSUPanel from "../../framework/OSUPanel.vue";
import {Color} from "../../../ts/webgl/base/Color";
import Column from "../../common/Column.vue";
import Row from "../../common/Row.vue";
import {Icon} from "../../../ts/icon/Icon";
import OSUPlayer from "../../../ts/player/OSUPlayer";
import {computed, onUnmounted, reactive, ref, watch} from "vue";
import defaultImage from "../../../../public/background/menu-background-1.jpg";
import {OSUPanelStack} from "../../../ts/osu/OSUPanelStack";
import type {OSUFile, OSUFileTimingPoints} from "../../../ts/osu/OSUFile";
import {ArrayUtils} from "../../../ts/util/ArrayUtils";
import BasicButton from "../../common/BasicButton.vue";

const info = reactive<{
  title: string,
  artist: string,
  creator: string,
  startRate: number,
  hpDrain: number,
  approachRate: number,
  beatmapID: string,
  beatmapSetID: string,
  source: string,
  tags: string,
  bpm: string
}>({
  title: '',
  artist: '',
  creator: '',
  startRate: 0,
  hpDrain: 0,
  approachRate: 0,
  beatmapID: '',
  beatmapSetID: '',
  source: '',
  tags: '',
  bpm: '-'
})

const events = reactive({
  hasStoryboard: false,
  hasVideo: false,
})

const url = ref(defaultImage)
const list = ref<BeatmapItem[]>([])

watch(OSUPlayer.currentOSZFile, (value, oldValue, onCleanup) => {
  if (!value || !value.osuFileList || value.osuFileList.length === 0) {
    return
  }
  const osu = OSUPlayer.currentOSUFile.value
  onCleanup(() => {
    if (url.value !== defaultImage) {
      url.value && URL.revokeObjectURL(url.value)
    }
  })
  const bg = osu.Events?.imageBackground
  if (bg && value.hasImage(bg)) {
    url.value = URL.createObjectURL(value.getImageBlob(bg)!)
  }
  info.approachRate = osu?.Difficulty?.ApproachRate ?? 0
  info.hpDrain = osu?.Difficulty?.HPDrainRate ?? 0
  info.startRate = osu?.Difficulty?.OverallDifficulty ?? 0
  info.title = osu?.Metadata?.TitleUnicode ?? ''
  info.artist = osu?.Metadata?.ArtistUnicode ?? ''
  if (info.title === '')
    info.title = osu?.Metadata?.Title ?? ''
  if (info.artist === '')
    info.artist = osu?.Metadata?.Artist ?? ''
  info.creator = osu?.Metadata?.Creator ?? ''
  info.beatmapID = osu?.Metadata?.BeatmapID ?? ''
  info.beatmapSetID = osu?.Metadata?.BeatmapSetID ?? ''
  info.source = osu?.Metadata?.Source ?? ''
  info.tags = osu?.Metadata?.Tags ?? ''
  handleOsuFiles(value.osuFileList)
  if (osu.TimingPoints) {
    calculateBPM(osu.TimingPoints)
  }
  events.hasVideo = !!osu.Events?.videoBackground
  events.hasStoryboard = value.osbFile.sprites.length > 0
}, { immediate: true })

interface BeatmapItem {
  name: string
}

function handleOsuFiles(files: OSUFile[]) {
  list.value = files.map(file => ({ name: file.name }))
}

function calculateBPM(timingPoints: OSUFileTimingPoints) {
  const list = timingPoints.timingList
  if (!list || list.length === 0) {
    return
  }
  const maxBeatLength = ArrayUtils.maxOf(list, (v) => v.beatLength)
  let minBeatLength = ArrayUtils.minOf(list, (v) => v.beatLength)
  if (minBeatLength <= 0) {
    minBeatLength = maxBeatLength
  }
  const minBPM = ((1000 * 60) / maxBeatLength).toFixed(2)
  const maxBPM = ((1000 * 60) / minBeatLength).toFixed(2)
  if (minBPM === maxBPM) {
    info.bpm = minBPM
  } else {
    info.bpm = `${minBPM} ~ ${maxBPM}`
  }
}

const currentDuration = computed(() => {
  const time = OSUPlayer.duration.value / 1000
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
})

onUnmounted(() => {
  if (url.value !== defaultImage) {
    url.value && URL.revokeObjectURL(url.value)
  }
})

function close() {
  OSUPanelStack.pop()
}

function jumpToBeatmapDetails() {
  try {
    parseInt(info.beatmapSetID)
  } catch (e) {
    return
  }
  if (info.beatmapSetID.length > 0) {
    window.open(`https://osu.ppy.sh/beatmapsets/${info.beatmapSetID}`, '_blank')
  }
}

</script>

<template>
  <OSUPanel
      panel-id="beatmapDetails"
      :theme-color="Color.fromHex(0)"
  >
    <Column class="bg-cyan-950 w-full h-fit">
      <Row
          class="w-full bg-cyan-700 text-white py-2 px-4"
          :gap="8"
          center-vertical
      >
        <span class="ma">{{ Icon.InfoOutline }}</span>
        <span class="text-xl">铺面信息</span>
        <button
            class="ma ml-auto hover:bg-cyan-600 transition active:bg-cyan-500 rounded-md p-3"
            @click="close()"
        >
          {{ Icon.Close }}
        </button>
      </Row>
      <Row class="w-full bg-cyan-800 text-white px-4" style="height: 48px">
        <Row class="font-light h-full" center-vertical>
          <span class="ml-0.5">Info</span>
          <div class="absolute w-8 h-1 bg-cyan-200 self-end"/>
        </Row>
      </Row>
      <div class="w-full" style="height: 384px">
        <div
            class="w-full overflow-clip h-full bg-black bg-no-repeat"
            :style="{ backgroundImage: `url(${url})` }"
            style="background-size: cover; background-position-y: 10%"
        >
          <Row class="w-full h-full justify-between" style="background-color: #00000040">
            <Column class=" h-full text-white p-8" bottom :gap="16">
              <span class="font-bold text-3xl">{{ info.title }}</span>
              <span class="text-xl">{{ info.artist }}</span>
              <span class="font-light">mapped by {{ info.creator }}</span>
              <Row class="w-full" :gap="32">
                <BasicButton
                    :color="Color.fromRGB(2, 132, 199)"
                    :apply-scale="false"
                    v-osu-button
                    class="text-white p-4 rounded-md w-fit"
                    @click="jumpToBeatmapDetails()"
                >
                  跳转到官网
                </BasicButton>
                <BasicButton
                    :color="Color.fromRGB(2, 132, 199)"
                    :apply-scale="false"
                    v-osu-button
                    class="text-white rounded-full w-fit px-8"
                    v-if="events.hasVideo"
                >
                  <Row center-vertical :gap="16">
                    <div>视频</div> <div class="ma">{{ Icon.Movie }}</div>
                  </Row>
                </BasicButton>
                <BasicButton
                    :color="Color.fromRGB(2, 132, 199)"
                    :apply-scale="false"
                    v-osu-button
                    class="text-white rounded-full w-fit px-8"
                    v-if="events.hasStoryboard"
                >
                  <Row center-vertical :gap="16">
                    <div>故事板</div> <div class="ma">{{ Icon.Image }}</div>
                  </Row>
                </BasicButton>
              </Row>
            </Column>
            <Column class="right-0 w-96 self-end pr-8" :gap="1">
              <Row class="text-yellow-500 justify-evenly w-full font-bold py-4" style="font-size: 12px; background-color: #00000080">
                <span>{{ currentDuration }}</span>
                <span>{{ info.bpm }}</span>
              </Row>
              <div class="p-4" style="background-color: #00000080">
                <table class="w-full" style="font-size: 12px">
                  <tr>
                    <td class="text-white font-light" style="font-size: 12px">
                      <div class="w-20">Key Count</div>
                    </td>
                    <td class="text-white w-full px-4">
                      <div class="w-full h-1 rounded-md" style="background-color: #ffffff80">
                        <div class="w-full h-full bg-white transition origin-left" :style="{ transform: `scaleX(${1})` }"></div>
                      </div>
                    </td>
                    <td class="text-white font-light">4</td>
                  </tr>
                  <tr>
                    <td class="text-white font-light" style="font-size: 12px">
                      <div class="w-20">HP Drain</div>
                    </td>
                    <td class="text-white w-full px-4">
                      <div class="w-full h-1 rounded-md" style="background-color: #ffffff80">
                        <div class="w-full h-full bg-white transition origin-left" :style="{ transform: `scaleX(${info.hpDrain / 10})` }"></div>
                      </div>
                    </td>
                    <td class="text-white font-light">{{ info.hpDrain.toFixed(2) }}</td>
                  </tr>
                  <tr>
                    <td class="text-white font-light" style="font-size: 12px">
                      <div class="w-20">Approach Rate</div>
                    </td>
                    <td class="text-white w-full px-4">
                      <div class="w-full h-1 rounded-md" style="background-color: #ffffff80">
                        <div class="w-full h-full bg-white transition origin-left" :style="{ transform: `scaleX(${info.approachRate / 10})` }"></div>
                      </div>
                    </td>
                    <td class="text-white font-light">{{ info.approachRate.toFixed(2) }}</td>
                  </tr>
                  <tr>
                    <td class="text-white font-light" >
                      <div class="w-20">Star Rate</div>
                    </td>
                    <td class="text-white w-full px-4">
                      <div class="w-full h-1 rounded-md" style="background-color: #ffffff80">
                        <div class="w-full h-full bg-white transition origin-left" :style="{ transform: `scaleX(${info.startRate / 10})` }"></div>
                      </div>
                    </td>
                    <td class="text-white font-light">{{ info.startRate.toFixed(2) }}</td>
                  </tr>
                </table>
              </div>
            </Column>
          </Row>
        </div>
      </div>
      <Row class="w-full p-8 bg-cyan-900 overflow-y-hidden mt-2" style="height: 240px" :gap="16">
        <Column class="w-1/4">
          <span class="font-bold text-white mb-3">Source</span>
          <span class="flex-wrap text-white">{{ info.source }}</span>
        </Column>
        <Column class="w-1/4">
          <span class="font-bold text-white mb-3">Tags</span>
          <span class="flex-wrap text-white" style="font-size: 12px">{{ info.tags }}</span>
        </Column>
      </Row>
      <Column class="w-full h-fit mt-2">
        <Row class="w-full bg-cyan-900 h-14 px-4" center-vertical>
          <span class="text-white font-light ml-2">Difficulty</span>
          <div class="absolute w-20 h-1 bg-cyan-200 self-end"></div>
        </Row>
        <div class="beatmap-list">
          <BasicButton
              :color="Color.fromRGB(8, 145, 178)"
              :apply-scale="false"
              v-osu-button
              class="beatmap-list-item"
              v-for="item in list"
          >
            {{ item.name.substring(0, item.name.length - 4) }}
          </BasicButton>
        </div>
      </Column>
    </Column>
  </OSUPanel>
</template>

<style scoped>
.beatmap-list {
  @apply justify-center p-8 gap-2 grid grid-cols-2;
}
.beatmap-list-item {
  @apply rounded-lg w-full px-4 py-4 text-white flex;
}
</style>