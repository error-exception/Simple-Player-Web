<template>
  <Column class="fill-size" style="background-color: #171c1a">
    <Row class="fill-width" style="background-color: #374340; padding: 16px">
      <span class="font-white fill-height">Timing</span>
      <span class="font-white fill-height flex-grow text-center">{{ loadState }}</span>
      <span class="font-white fill-height" @click="closeCalculator()">Close</span>
    </Row>
    <Row class="fill-width">
      <Column class="fill-height" style="justify-content: space-evenly; padding-left: 4px; padding-right: 4px">
        <button class="ma font-white" @click="DRAW_COUNT++">{{ Icon.ZoomOut }}</button>
        <button class="font-white ma" @click="DRAW_COUNT--">{{ Icon.ZoomIn }}</button>
      </Column>
      <div class="flex-grow font-white" style="height: 80px; background-color: #212926">
        <canvas ref="wave" @wheel="changeByBpm"></canvas>
      </div>
    </Row>
    <Row class="flex-grow" :gap="8">
      <!-- Timing List -->
      <Column
          class="font-white flex-grow"
          style="background-color: #2e3835; padding: 16px 0"
      >
        <Column class="flex-grow vertical-scroll no-scroller" style="height: 200px">
          <Row
              v-for="(item, index) in state.timing.list"
              :class="`fill-width ${state.timing.selectedIndex === index ? 'timing-item-selected' : 'timing-item'}`"
              style="padding: 0 23px"
              :gap="32"
              @click="selectCurrentTiming(index)"
              :key="item.timestamp"
          >
            <span>{{ timeString(item.timestamp) }}</span>
            <span class="timing-attr" :style="`display: ${item.isKiai ? 'block' : 'none'}`">Kiai</span>
          </Row>
        </Column>
        <Row class="fill-width" right :gap="16" style="padding-right: 16px;">
          <button class="btn" style="height: 24px" @click="addAtCurrent()">+</button>
          <button class="btn" style="height: 24px" @click="removeSelected()">-</button>
        </Row>
      </Column>
      <Column
          class="fill-height vertical-scroll no-scroller"
          style="width: 420px; padding-top: 8px;"
          :gap="8"
          center-horizontal
      >
        <Row
            class="fill-width block-box"
            center-vertical
            :gap="12"
        >
          <span class="font-white" style="width: 50px;">BPM</span>
          <Row class="flex-grow bpm-adjust-box" center-horizontal>
            <button class="bpm-adjust-btn ma" @click="adjustBpm(false)">
              {{ Icon.Remove }}
            </button>
            <input class="bpm-input flex-grow" v-model="state.beatInfo.bpm">
            <button class="bpm-adjust-btn ma" @click="adjustBpm(true)">
              {{ Icon.Add }}
            </button>
          </Row>
        </Row>

        <Column class="fill-width block-box" :gap="12">
          <Row class="fill-width" center-vertical :gap="12">
            <span class="font-white" style="width: 50px;">Offset</span>
            <Row class="flex-grow bpm-adjust-box" center-horizontal>
              <button class="bpm-adjust-btn ma" @click="adjustOffset(false)">
                {{ Icon.Remove }}
              </button>
              <input class="bpm-input flex-grow" v-model="beatOffset">
              <button class="bpm-adjust-btn ma" @click="adjustOffset(true)">
                {{ Icon.Add }}
              </button>
            </Row>
          </Row>
          <Row class="fill-width font-white" :gap="16" center-horizontal>
            <button class="radio-btn" @click="state.precisionIndex = 0" :style="`background-color: ${ state.precisionIndex == 0 ? '#33cb98' : 'transparent'}`">1.0</button>
            <button class="radio-btn" @click="state.precisionIndex = 1" :style="`background-color: ${ state.precisionIndex == 1 ? '#33cb98' : 'transparent'}`">10.0</button>
            <button class="radio-btn" @click="state.precisionIndex = 2" :style="`background-color: ${ state.precisionIndex == 2 ? '#33cb98' : 'transparent'}`">100.0</button>
            <button class="radio-btn" @click="state.precisionIndex = 3" :style="`background-color: ${ state.precisionIndex == 3 ? '#33cb98' : 'transparent'}`">beat gap</button>
          </Row>
        </Column>
        <Column class="fill-width block-box" center-horizontal :gap="16">
          <Row class="fill-width" style="justify-content: space-between" center-vertical>
            <button
                class="beat-button"
                :style="`transform: scale(${state.beatEffect.tapBeat})`"
            >
              Beat
            </button>
            <div style="background-color: #171c1a; height: 240px; width: 50%">
              <canvas ref="beatWave"></canvas>
            </div>
          </Row>
<!--          <div class="bpm-side-beat" :style="`opacity: ${state.beatEffect.left}`" ></div>-->
<!--          <div class="bpm-side-beat" :style="`opacity: ${state.beatEffect.right}`" ></div>-->
        </Column>
        <Row class="fill-width block-box" center-vertical v-if="state.timing.list.length !== 0">
          <span class="font-white">Kiai Mode</span>
          <CheckBox class="ml-auto" v-model="state.timing.selectedTiming.isKiai"/>
        </Row>
      </Column>
    </Row>
    <Row class="fill-width font-white" style="height: 80px">
      <Column center style="background-color: #222a27; padding: 0 16px">
        <span class="font-white select-none" style="font-size: 26px; letter-spacing: 2px">{{ state.currentTime }}</span>
        <span style="color: yellow" class="select-none">{{ state.beatInfo.bpm }} BPM</span>
      </Column>
      <div class="flex-grow">
        <canvas ref="progress" class="fill-size" @mousedown="mouseState = true" @mouseup="changeProgress" @mousemove="slideProgress" @mouseleave="changeProgress"></canvas>
      </div>
      <button class="fill-height ma font-white" style="font-size: 36px" @click="playOrStart()">
        {{ player.isPlaying.value ? Icon.Pause : Icon.PlayArrow }}
      </button>
      <button class="fill-height ma font-white" style="font-size: 36px" @click="stopPlay()">
        {{ Icon.Stop }}
      </button>
      <button
          class="font-white p-8"
          v-for="(item, index) in playbackRate"
          @click="state.playbackRateIndex = index"
          :style="`background-color: ${ state.playbackRateIndex === index ? '#33cb98' : 'transparent' }`"
      >
        {{ Math.round(item * 100) }}%
      </button>
      <button class="fill-height bpm-apply" @click="applyTiming()">
        Apply
      </button>
    </Row>
  </Column>
</template>

<script setup lang="ts">
import Row from "./Row.vue";
import Column from "./Column.vue";
import {computed, onMounted, onUnmounted, reactive, Ref, ref, toRaw, watch} from "vue";
import {Icon} from "../ts/icon/Icon";
import {EventDispatcher, useEvent} from "../ts/EventBus";
import {useStore} from "vuex";
import {
  ArrayUtils,
  autoCorrelate, autocorrelation,
  beatFuncV2,
  calcRMS,
  currentMilliseconds,
  findMusic,
  int,
  removeAt,
  useKeyboard
} from "../ts/Utils";
import {AudioPlayer} from "../ts/AudioPlayer";
import {TimingItem} from "../ts/TimingItem";
import CheckBox from "./CheckBox.vue";
import {addTimingInfoToCache, getBeater, TimingInfo, uploadTimingInfo} from "../ts/TimingInfo";
import {AudioPlayerV2} from "../ts/AudioPlayerV2";
import {TestBeater} from "../ts/TestBeater";
import {simpleAnimate} from "../ts/util/Animation";
import test from "node:test";

const emit = defineEmits<{
  (e: 'close'): void
}>()

const playbackRate = ref([0.25, 0.5, 0.75, 1.0])
const tapTestScale = ref(1)
const loadState = ref("正在初始化......")
type ReactiveState = {
  gap: number[],
  playbackRateIndex: number,
  timing: {
    list: TimingItem[],
    selectedIndex: number,
    selectedTiming: TimingItem
  }
  beatEffect: {
    tapBeat: number,
    first: number,
    second: number,
    third: number,
    fourth: number
    left: number,
    right: number
  },
  beatInfo: {
    bpm: number,
    offset: number
  },
  currentTime: string,
  precisionIndex: number
}

const state = reactive<ReactiveState>({
  precisionIndex: 2,
  playbackRateIndex: 3,
  timing: {
    list: [],
    selectedIndex: -1,
    selectedTiming: new TimingItem({
      timestamp: 0,
      isKiai: false
    })
  },
  gap: [],
  currentTime: "00:00:000",
  beatEffect: {
    tapBeat: 0,
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    left: 0.1,
    right: 0.1
  },
  beatInfo: {
    bpm: 60,
    offset: 0
  }
})

const drawFlag = {
  main: false
}

const beatOffset = computed({
  set(value: number) {
    if (typeof value !== "number") {
      value = parseInt(value)
    }
    state.beatInfo.offset = value
  },
  get() {
    return state.beatInfo.offset
  }
})

const progress = ref<HTMLCanvasElement | null>(null)
const wave = ref<HTMLCanvasElement | null>(null)
const beatWave = ref<HTMLCanvasElement | null>(null)
const store = useStore()

const player = AudioPlayerV2.instance

let progressContext: CanvasRenderingContext2D
let waveContext: CanvasRenderingContext2D
let beatWaveContext: CanvasRenderingContext2D
const beater = new TestBeater()
let intervals: number[] = []

useKeyboard("down", (evt: KeyboardEvent) => {
  if (!evt.isTrusted) {
    return
  }
  if (evt.code === 'KeyT' || evt.code === 'KeyY') {
    // tap(evt.timeStamp)
    tapV2()
  }
  if (evt.code === 'KeyR') {
    reset()
  }
})

watch(player.isPlaying, (value) => {
  if (value) {
    drawFlag.main = true
    requestAnimationFrame(draw)
  } else {
    drawFlag.main = false
  }
})
watch(() => state.beatInfo.bpm, (value, oldValue, onCleanup) => {
  if (value != oldValue) {
    beater.setBpm(value)
  }
  if (!player.isPlaying.value) {
    drawWave()
  }
})
watch(() => state.beatInfo.offset, (value) => {
  beater.setOffset(value)
  if (!player.isPlaying.value) {
    drawWave()
  }
})
watch(() => state.playbackRateIndex, (value) => {
  player.setPlaybackRate(playbackRate.value[value])
})

const currentMusic = store.state.currentMusic;
getBeater(currentMusic.id).then((res) => {
  state.beatInfo.bpm = res.getBpm()
  state.beatInfo.offset = res.getOffset()
  state.timing.list = res.getTimingList()
  beater.setBpm(res.getBpm())
  beater.setOffset(res.getOffset())
  beater.setTimingList(res.getTimingList())
  if (player.isPlaying.value) {
    drawFlag.main = true
    draw()
  }
})

useKeyboard('down', (evt) => {
  if (evt.code === 'ArrowRight') {
    changeProgressByBeatGap(true)
  } else if (evt.code === "ArrowLeft") {
    changeProgressByBeatGap(false)
  } else if (evt.code === "ArrowUp") {
    state.playbackRateIndex = Math.min(state.playbackRateIndex + 1, 3)
  } else if (evt.code === "ArrowDown") {
    state.playbackRateIndex = Math.max(state.playbackRateIndex - 1, 0)
  } else if (evt.code === "KeyG") {
    tapTestScale.value = 0.96
    simpleAnimate(tapTestScale).easeOutTo(1, 20)
  }
})

let peeks: number[] = []

onMounted(() => {
  if (progress.value) {
    const ctx = progress.value.getContext('2d')
    if (ctx) {
      progressContext = ctx
    }
  }
  if (wave.value) {
    const ctx = wave.value.getContext("2d")
    if (ctx) {
      waveContext = ctx
    }
  }
  if (beatWave.value) {
    const ctx = beatWave.value.getContext("2d")
    if (ctx) {
      beatWaveContext = ctx
    }
  }
  peeks = generatePeek()
  loadState.value = ""
})

onUnmounted(() => {
  drawFlag.main = false
})

let previous = -1

const WINDOW = 12

function closeCalculator() {
  player.setPlaybackRate(playbackRate.value[3])
  emit("close")
}

function tapV2() {
  const timestamp = currentMilliseconds()
  if (previous < 0) {
    previous = timestamp
    return
  }
  const interval = timestamp - previous
  if (interval > 2000) {
    intervals.length = 0
    previous = timestamp
    return;
  }
  if (intervals.length < WINDOW) {
    intervals.push(interval)
    intervals.sort()
  } else {
    const start = int(intervals.length * 0.2)
    const end = int(intervals.length * 0.8)
    intervals = ArrayUtils.copyOfRange(intervals, start, end)
    state.beatInfo.bpm = Math.round(60 / ArrayUtils.averageOf(intervals) * 1000)
  }
  previous = timestamp
}

function reset() {
  state.gap.length = 0
  state.beatInfo.bpm = 0
  previous = 0
}

function applyTiming() {
  const bpm = Math.floor(state.beatInfo.bpm)
  store.commit("setCurrentMusicBpm", bpm)
  store.commit("setCurrentMusicOffset", state.beatInfo.offset)

  const timingInfo: TimingInfo = {
    bpm,
    id: store.state.currentMusic.id,
    version: "1.0",
    offset: state.beatInfo.offset,
    timingList: []
  }

  const timingList = state.timing.list
  for (const timingListElement of timingList) {
    timingInfo.timingList.push({
      isKiai: timingListElement.isKiai,
      timestamp: timingListElement.timestamp
    })
  }
  console.log(timingInfo)
  addTimingInfoToCache(timingInfo)

  EventDispatcher.fireOnBpmChanged(store.state.currentMusic.id)
  uploadTimingInfo(timingInfo)

}

function playOrStart() {
  if (player.isPlaying.value) {
    player.pause()
  } else {
    player.play()
  }
}

let progressBound: {width: number, height: number}

const mouseState = ref(false)

function changeProgress(e: MouseEvent) {
  slideProgress(e)
  mouseState.value = false
}

function slideProgress(e: MouseEvent) {
  if (!mouseState.value) {
    return
  }
  const x = e.offsetX
  const durationMilliseconds = player.duration.value
  const p = (x / progressBound.width) * durationMilliseconds
  if (p < 0 || p > durationMilliseconds) {
    return;
  }
  player.seek(p)
  state.currentTime = timeString(player.currentTime)
  drawProgressbar()
  drawWave()
}

function adjustBpm(dir: boolean) {
  if (dir) {
    state.beatInfo.bpm++
  } else {
    state.beatInfo.bpm--
  }
}

function adjustOffset(dir: boolean) {
  if (dir) {
    if (state.precisionIndex === 3) {
      const gap = 60 / state.beatInfo.bpm * 1000
      beatOffset.value += int(gap)
    } else {
      beatOffset.value += (10 ** state.precisionIndex)
    }
  } else {
    if (state.precisionIndex === 3) {
      const gap = 60 / state.beatInfo.bpm * 1000
      beatOffset.value -= int(gap)
    } else {
      beatOffset.value -= (10 ** state.precisionIndex)
    }
  }
}

function changeByBpm(e: WheelEvent) {
  changeProgressByBeatGap(e.deltaY > 0)
}

function changeProgressByBeatGap(isPlus: boolean) {
  const offset = state.beatInfo.offset
  const current = Math.max(player.currentTime - offset, 0)
  const gap = 60 / state.beatInfo.bpm * 1000
  let count = Math.round(current / gap)
  if (isPlus)
    count++
  else {
    count = Math.max(--count, 0)
  }
  const targetCurrent = gap * count + offset
  player.seek(targetCurrent)
  drawProgressbar()
  drawWave()
  state.currentTime = timeString(player.currentTime)
}

function stopPlay() {
  player.pause()
  player.seek(0)
  drawProgressbar()
  drawWave()
}

function addAtCurrent() {
  const timingItem = new TimingItem({
    isKiai: false,
    timestamp: Math.floor(player.currentTime)
  })
  state.timing.list.push(timingItem)
  state.timing.list = state.timing.list.sort((a, b) => a.timestamp - b.timestamp)
  state.timing.selectedIndex = state.timing.list.length - 1
  state.timing.selectedTiming = state.timing.list[state.timing.selectedIndex]
}

function removeSelected() {
  if (state.timing.selectedIndex < 0) {
    return
  }
  removeAt(state.timing.list, state.timing.selectedIndex)
}

function selectCurrentTiming(index: number) {
  state.timing.selectedIndex = index
  player.seek(state.timing.list[index].timestamp)
  state.timing.selectedTiming = state.timing.list[index]
}

function generatePeek() {
  const peek: number[] = []
  const audioBuffer = player.getAudioBuffer();
  const sampleRate = audioBuffer.sampleRate
  let leftChannel: Float32Array, rightChannel: Float32Array
  if (audioBuffer.numberOfChannels < 2) {
    leftChannel = audioBuffer.getChannelData(0)
    rightChannel = leftChannel
  } else {
    leftChannel = audioBuffer.getChannelData(0)
    rightChannel = audioBuffer.getChannelData(1)
  }
  const duration = int(audioBuffer.duration * 1000)
  for (let i = 0; i < duration; i++) {
    const value = calcRMS(sampleRate, leftChannel, rightChannel, i, 512)
    peek.push(value)
  }
  return peek
}

function draw() {
  if (!drawFlag.main) {
    return
  }
  requestAnimationFrame(draw)
  beat()
  state.currentTime = timeString(player.currentTime)
  drawProgressbar()
  drawWave()
  drawBeatWave()
}

/**
 *
 * @param time 时间，单位：毫秒
 */
function timeString(time: number): string {
  if (isNaN(time)) {
    return '00:00:000'
  }
  time = Math.floor(time)
  const milliseconds = time % 1000
  time /= 1000
  const minute = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  let millisecondsString: string
  let minuteString: string
  let secondsString: string
  if (milliseconds < 10) {
    millisecondsString = "00" + milliseconds
  } else if (milliseconds < 100) {
    millisecondsString = "0" + milliseconds
  } else {
    millisecondsString = "" + milliseconds
  }
  if (minute < 10) {
    minuteString = "0" + minute
  } else {
    minuteString = "" + minute
  }
  if (seconds < 10) {
    secondsString = "0" + seconds
  } else {
    secondsString = "" + seconds
  }
  return `${minuteString}:${secondsString}:${millisecondsString}`
}

function beat() {
  const time = player.currentTime
  const scale = beater.beat(time)
  state.beatEffect.tapBeat = 1 - scale * 0.05
  return scale
}

function resizeCanvas(htmlRef: Ref<HTMLCanvasElement | null>, pixelRatio: number = 1) {
  const canvas = htmlRef.value
  if (!canvas) {
    return {
      width: 0,
      height: 0
    }
  }
  const parent = canvas.parentElement!!
  if (canvas.height !== parent.offsetHeight || canvas.width !== parent.offsetWidth) {
    canvas.height = parent.offsetHeight * pixelRatio
    canvas.width = parent.offsetWidth * pixelRatio
  }
  return {
    width: canvas.width,
    height: canvas.height
  }
}

// TODO: draw kiai mode time
function drawProgressbar() {
  const bound = resizeCanvas(progress)
  progressBound = bound
  const ctx = progressContext
  const progressValue = player.currentTime / player.duration.value
  ctx.clearRect(0, 0, bound.width, bound.height)

  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'white'
  ctx.moveTo(0, bound.height / 2)
  ctx.lineTo(bound.width, bound.height / 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'red'
  ctx.moveTo(bound.width * progressValue, 0)
  ctx.lineTo(bound.width * progressValue, bound.height)
  ctx.stroke()
}

let DRAW_COUNT = 12

function drawWave() {
  const bound = resizeCanvas(wave)
  const gap = 60 / state.beatInfo.bpm * 1000
  const offset = state.beatInfo.offset
  // 最大可视时间
  const visibleTime = gap * DRAW_COUNT
  const halfVisibleTime = visibleTime / 2
  const unit = bound.width / visibleTime

  const currentTime = player.currentTime
  const ctx = waveContext
  const musicStartX = (halfVisibleTime - currentTime) * unit

  const start = int(currentTime - bound.width / 2 / unit)
  const end = int(currentTime + bound.width / 2 / unit)
  const duration = player.duration.value

  ctx.clearRect(0, 0, bound.width, bound.height)

  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.fillStyle = '#33cb9840'
  let x2 = 0
  const startLength = peeks[start] * bound.height
  ctx.moveTo(x2, (bound.height - startLength) / 2)
  for (let i = start + 1; i < end && i < duration; i++) {
    const length = peeks[i] * bound.height
    ctx.lineTo(x2, (bound.height - length) / 2)
    x2 += unit
  }
  for (let i = end - 1; i >= start; i--) {
    const length = peeks[i] * bound.height
    ctx.lineTo(x2, (bound.height - length) / 2 + length)
    x2 -= unit
  }
  ctx.moveTo(0, (bound.height - startLength) / 2)
  ctx.fill()

//  music start line
  if (musicStartX > 0) {
    ctx.beginPath()
    ctx.strokeStyle = "yellow"
    ctx.lineWidth = 4
    ctx.moveTo(musicStartX, 0)
    ctx.lineTo(musicStartX, bound.height)
    ctx.stroke()
  }

  ctx.beginPath()
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 1
  let x = musicStartX + offset * unit
  for (let i = 0; x < bound.width; i++) {
    if (x > 0 && (i & 0b11) != 0) {
      ctx.moveTo(Math.floor(x), 10)
      ctx.lineTo(Math.floor(x), bound.height - 10)
    }
    x += gap * unit
  }
  ctx.stroke()

  // 1/4
  ctx.beginPath()
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3
  x = musicStartX + offset * unit
  for (let i = 0; x < bound.width; i++) {
    if (x > 0) {
      ctx.moveTo(Math.floor(x), 10)
      ctx.lineTo(Math.floor(x), bound.height - 10)
    }
    x += gap * unit * 4
  }
  ctx.stroke()

  // playing line
  ctx.beginPath()
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 2
  ctx.moveTo(bound.width / 2, 0)
  ctx.lineTo(bound.width / 2, bound.height)
  ctx.stroke()

}
let lastBeatCount = -1
function drawBeatWave() {
  if (beater.getBeatCount() == lastBeatCount) {
    return
  }
  lastBeatCount = beater.getBeatCount()

  const beatIndex = beater.getBeatCount() - 4

  const bound = resizeCanvas(beatWave, window.devicePixelRatio)
  const ctx = beatWaveContext
  const beatLength = beater.getGap()
  const unit = bound.width / beatLength
  const heightPerWave = bound.height / 8

  ctx.scale(0.8, 0.8)

  ctx.clearRect(0, 0, bound.width, bound.height)
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.fillStyle = '#33cb98'
  for (let i = beatIndex, j = 0; i < beatIndex + 8; i++, j++) {
    if (i < 0) continue
    const offsetY = heightPerWave * j
    const time = beatLength * i + beater.getOffset()
    const width = bound.width
    const height = heightPerWave
    const start = int(time - width / 2 / unit)
    const end = int(time + width / 2 / unit)
    const duration = player.duration.value

    let x2 = 0
    const startLength = peeks[start] * height
    ctx.moveTo(x2, offsetY + (height - startLength) / 2)
    for (let i = start + 1; i < end && i < duration; i++) {
      const length = peeks[i] * height
      ctx.lineTo(x2, offsetY + (height - length) / 2)
      x2 += unit
    }
    for (let i = end - 1; i >= start; i--) {
      const length = peeks[i] * height
      ctx.lineTo(x2, offsetY + (height - length) / 2 + length)
      x2 -= unit
    }
    ctx.lineTo(0, offsetY + (height - startLength) / 2)
  }
  ctx.fill()

  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = "white"
  ctx.moveTo(bound.width / 2, 0)
  ctx.lineTo(bound.width / 2, bound.height)
  ctx.stroke()

}

</script>

<style scoped>
.timing-item {
  padding: 4px 32px;
}
.timing-item:hover {
  background-color: #556963;
}
.timing-item-selected {
  padding: 4px 32px;
  background-color: #33cb98;
}
.round {
  width: 40px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  background-color: yellow;
}
.bpm-adjust-box {
  background-color: black;
  border-radius: 600px;
  height: 48px;
  overflow: hidden;
}
.bpm-input {
  height: 100%;
  color: white;
  text-align: center;
  font-size: 20px;
}
.btn {
  background-color: #33cb98;
  color: white;
  font-size: 16px;
  padding: 0 32px;
  border-radius: 666px;
}
.btn:hover {
  background-color: #38e7ab;
}
.btn:active {
  background-color: #299f79;
}
.beat-button {
  color: white;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background-color: #60756e;
  font-size: 26px;
}
.bpm-adjust-btn {
  color: white;
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
}
.bpm-adjust-btn:hover {
  background-color: #171717;
}
.bpm-adjust-btn:active {
  background-color: black;
}
.bpm-apply {
  width: 128px;
  background-color: yellow;
  color:#000;
  font-size: 26px
}
.bpm-apply:hover {
  background-color: #e0e000;
}
.bpm-apply:active {
  background-color: #33cb98;
  color: white;
}
.bpm-side-beat {
  height: 100%;
  background-color: #82a9b5;
  width: 56px;
  border-radius: 8px;
}
.radio-btn {
  background-color: #33cb98;
  color: white;
  padding: 4px 16px;
  border-radius: 999px;
  border: 3px solid #33cb98;
  transition: background-color 100ms ease-in-out;
}
.timing-attr {
  border-radius: 2px;
  background-color: #000000;
  padding: 2px;
  font-size: 12px;
  color: #af00af;
}
.block-box {
  padding: 16px 12px;
  background-color: #2e3835;
  border-radius: 4px;
}
</style>