<script setup lang="ts">
import Row from "./common/Row.vue";
import Column from "./common/Column.vue";
import {computed, onMounted, onUnmounted, reactive, Ref, ref, watch} from "vue";
import {Icon} from "../ts/icon/Icon";
import {calcRMS, currentMilliseconds, int, useKeyboard} from "../ts/Utils";
import CheckBox from "./common/CheckBox.vue";
import AudioPlayer from "../ts/player/AudioPlayer";
import {TestBeater} from "../ts/TestBeater";
import {ArrayUtils} from "../ts/util/ArrayUtils";
import TimingManager from "../ts/global/TimingManager";
import PlayManager from "../ts/player/PlayManager";
import {TimingItem} from "../ts/type";
import {PlayerState} from "../ts/player/PlayerState";
import {useAnimationFrame} from "../ts/use/useAnimationFrame";
import ValueAdjust from "./timing/ValueAdjust.vue";
import {collectLatest} from "../ts/util/eventRef";
import {Toaster} from "../ts/global/Toaster";

/**
 * this component should update to fit dynamic bpm and new kiai alg
 */

const emit = defineEmits<{
  (e: 'close'): void
}>()

const bpmInfo = reactive({
  offset: 0,
  bpm: 60
})
const beater = new TestBeater()
let progressContext: CanvasRenderingContext2D
let waveContext: CanvasRenderingContext2D
let beatWaveContext: CanvasRenderingContext2D
let intervals: number[] = []
const drawFlag = ref(false)
const playState = AudioPlayer.playState
const player = AudioPlayer

// 1. wave
const wave = ref<HTMLCanvasElement | null>(null)
let DRAW_COUNT = 12
let peeks: number[] = []

onMounted(() => {
  Toaster.show("Under developing......")
  if (wave.value) {
    const ctx = wave.value.getContext("2d")
    if (ctx) {
      waveContext = ctx
    }
  }
  peeks = generatePeek()
})
watch(() => bpmInfo.bpm, (value, oldValue) => {
  if (value != oldValue) {
    beater.setBpm(value)
  }
  if (!player.isPlaying()) {
    drawWave()
  }
})
watch(() => bpmInfo.offset, (value) => {
  beater.setOffset(value)
  if (!player.isPlaying()) {
    drawWave()
  }
})

function changeByBpm(e: WheelEvent) {
  changeProgressByBeatGap(e.deltaY > 0)
}
function changeProgressByBeatGap(isPlus: boolean) {
  const offset = bpmInfo.offset
  const current = Math.max(player.currentTime() - offset, 0)
  const gap = 60 / bpmInfo.bpm * 1000
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
  state.currentTime = timeString(player.currentTime())
}

function drawWave() {
  const bound = resizeCanvas(wave)
  const gap = 60 / bpmInfo.bpm * 1000
  const offset = bpmInfo.offset
  // 最大可视时间
  const visibleTime = gap * DRAW_COUNT
  const halfVisibleTime = visibleTime / 2
  const unit = bound.width / visibleTime
  
  const currentTime = player.currentTime()
  const ctx = waveContext
  const musicStartX = (halfVisibleTime - currentTime) * unit
  
  const start = int(currentTime - bound.width / 2 / unit)
  const end = int(currentTime + bound.width / 2 / unit)
  const duration = player.duration()
  
  ctx.clearRect(0, 0, bound.width, bound.height)
  
  // draw wave
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

// 2. timing list
const timing = reactive<{
  list: TimingItem[],
  selectedIndex: number,
  selectedTiming: TimingItem
}>({
  list: [],
  selectedIndex: -1,
  selectedTiming: {
    timestamp: 0,
    isKiai: false
  }
})
function addAtCurrent() {
  const timingItem: TimingItem = {
    isKiai: false,
    timestamp: Math.floor(player.currentTime())
  }
  timing.list.push(timingItem)
  timing.list = timing.list.sort((a, b) => a.timestamp - b.timestamp)
  timing.selectedIndex = timing.list.length - 1
  timing.selectedTiming = timing.list[timing.selectedIndex]
}

function removeSelected() {
  if (timing.selectedIndex < 0) {
    return
  }
  ArrayUtils.removeAt(timing.list, timing.selectedIndex)
}

function selectCurrentTiming(index: number) {
  timing.selectedIndex = index
  player.seek(timing.list[index].timestamp)
  timing.selectedTiming = timing.list[index]
}

/** @param time 时间，单位：毫秒 */
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

// 3. measure bpm
// @ts-ignore
const beatOffset = computed({
  set(value: number) {
    if (typeof value !== "number") {
      value = parseInt(value)
    }
    bpmInfo.offset = value
  },
  get() {
    return bpmInfo.offset
  }
})
const WINDOW = 12
let previous = -1

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
    bpmInfo.bpm = Math.round(60 / ArrayUtils.averageOf(intervals) * 1000)
  }
  previous = timestamp
}

function reset() {
  state.gap.length = 0
  bpmInfo.bpm = 0
  previous = 0
}
function beat() {
  const time = player.currentTime()
  const scale = beater.beat(time)
  beatEffect.isKiai = beater.isKiai(time)
  beatEffect.tapBeat = scale
  return scale
}
// 4. beat wave
const beatWave = ref<HTMLCanvasElement | null>(null)
const beatEffect = reactive({
  tapBeat: 0,
  isKiai: false
})
onMounted(() => {
  if (beatWave.value) {
    const ctx = beatWave.value.getContext("2d")
    if (ctx) {
      beatWaveContext = ctx
    }
  }
})

function drawBeatWave() {
  if (!beater.isBeat()) {
    return
  }
  
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
    const duration = player.duration()
    
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

// 5. progress bar
let progressBound: { width: number, height: number }
const progress = ref<HTMLCanvasElement | null>(null)
const mouseState = ref(false)

onMounted(() => {
  if (progress.value) {
    const ctx = progress.value.getContext('2d')
    if (ctx) {
      progressContext = ctx
    }
  }
})

function drawProgressbar() {
  const bound = resizeCanvas(progress)
  progressBound = bound
  const ctx = progressContext
  const duration = player.duration()
  const progressValue = player.currentTime() / duration
  ctx.clearRect(0, 0, bound.width, bound.height)
  
  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'white'
  ctx.moveTo(0, bound.height / 2)
  ctx.lineTo(bound.width, bound.height / 2)
  ctx.stroke()
  
  // draw kiai
  ctx.beginPath()
  ctx.fillStyle = "#7a0a5180"
  const list = timing.list
  for (let i = 0; i < list.length; i++) {
    const {timestamp, isKiai} = list[i]
    if (!isKiai) {
      continue
    }
    const startPosition = timestamp / duration
    let endPosition: number = -1
    for (let j = i + 1; j < list.length; j++) {
      const endTiming = list[j]
      if (endTiming.isKiai) {
        continue
      }
      endPosition = endTiming.timestamp / duration
      i = j
      break
    }
    if (endPosition < 0) {
      endPosition = 1
    }
    ctx.moveTo(bound.width * startPosition, 30)
    ctx.lineTo(bound.width * startPosition, bound.height - 30)
    ctx.lineTo(bound.width * endPosition, bound.height - 30)
    ctx.lineTo(bound.width * endPosition, 30)
    ctx.lineTo(bound.width * startPosition, 30)
    if (endPosition === 1) break
  }
  ctx.fill()
  // draw progress bar
  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'red'
  ctx.moveTo(bound.width * progressValue, 0)
  ctx.lineTo(bound.width * progressValue, bound.height)
  ctx.stroke()
}

function changeProgress(e: MouseEvent) {
  slideProgress(e)
  mouseState.value = false
}

function slideProgress(e: MouseEvent) {
  if (!mouseState.value) {
    return
  }
  const x = e.offsetX
  const durationMilliseconds = player.duration()
  const p = (x / progressBound.width) * durationMilliseconds
  if (p < 0 || p > durationMilliseconds) {
    return;
  }
  player.seek(p)
  state.currentTime = timeString(player.currentTime())
  drawProgressbar()
  drawWave()
}

// 6. controls
const playbackRate = ref([0.25, 0.5, 0.75, 1.0])
const loadState = ref("正在初始化......")

async function applyTiming() {
  // const bpm = Math.floor(bpmInfo.bpm)
  //
  // const timingInfo: TimingInfo = {
  //   bpm,
  //   id: currentMusic.metadata.id,
  //   version: "1.0",
  //   offset: bpmInfo.offset,
  //   timingList: []
  // }
  //
  // const timingList = timing.list
  // for (const timingListElement of timingList) {
  //   timingInfo.timingList.push({
  //     isKiai: timingListElement.isKiai,
  //     timestamp: timingListElement.timestamp
  //   })
  // }
  // TimingManager.addTimingInfoToCache(timingInfo)
  //
  // let isSuccess = true
  // if (PLAYER) {
  //   isSuccess = await TimingManager.updateTiming(timingInfo)
  // }
  // Toaster.show(isSuccess ? '保存成功' : '保存失败')
  
}

function playOrStart() {
  if (player.isPlaying()) {
    player.pause()
  } else {
    player.play()
  }
}

function stopPlay() {
  player.pause()
  player.seek(0)
  drawProgressbar()
  drawWave()
}

type ReactiveState = {
  gap: number[],
  playbackRateIndex: number,
  currentTime: string,
  precisionIndex: number
}

const state = reactive<ReactiveState>({
  precisionIndex: 2,
  playbackRateIndex: 3,
  gap: [],
  currentTime: "00:00:000",
})
useKeyboard("down", (evt: KeyboardEvent) => {
  if (!evt.isTrusted) {
    return
  }
  if (evt.code === 'KeyT' || evt.code === 'KeyY') {
    tapV2()
  }
  if (evt.code === 'KeyR') {
    reset()
  }
})

collectLatest(player.playState, (value) => {
  drawFlag.value = value === PlayerState.STATE_PLAYING;
})
watch(() => state.playbackRateIndex, (value) => {
  player.speed(playbackRate.value[value])
})

const currentMusic = PlayManager.currentMusic;
TimingManager.getTiming(currentMusic.metadata.id).then((res) => {
  res = res || TimingManager.defaultTiming
  bpmInfo.bpm = res.bpm
  bpmInfo.offset = res.offset
  timing.list = res.timingList
  beater.setBpm(res.bpm)
  beater.setOffset(res.offset)
  beater.setTimingList(res.timingList)
  if (player.isPlaying()) {
    drawFlag.value = true
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
  }
})
onMounted(() => {
  loadState.value = ""
})
onUnmounted(() => {
  drawFlag.value = false
})

function closeCalculator() {
  player.speed(playbackRate.value[3])
  emit("close")
}

useAnimationFrame(drawFlag, () => {
  beat()
  state.currentTime = timeString(player.currentTime())
  drawProgressbar()
  drawWave()
  drawBeatWave()
})

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
</script>
<template>
  <Column class="fill-size bpm-calc-box" style="background-color: var(--bpm-color-1)">
    <Row class="w-full min-h-[36px]" style="background-color: #374340; padding: 0 16px">
      <button class="text-white fill-height">Timing</button>
      <button class="text-white h-full bpm-close ml-auto" @click="closeCalculator()">Close</button>
    </Row>
    <Row class="w-full">
      <div class="h-full flex flex-col justify-evenly px-1" style="background-color: var(--bpm-color-3)">
        <button class="ma text-white" @click="DRAW_COUNT++">{{ Icon.ZoomOut }}</button>
        <button class="text-white ma" @click="DRAW_COUNT--">{{ Icon.ZoomIn }}</button>
      </div>
      <div class="flex-grow text-white h-20" style="background-color: var(--bpm-color-2)">
        <canvas ref="wave" @wheel="changeByBpm"></canvas>
      </div>
    </Row>
    <Row class="flex-grow" style="flex-basis: 0" :gap="8">
      <!-- Timing List -->
      <div
        class="text-white stack flex flex-row flex-grow h-full"
        style="background-color: var(--bpm-color-3)"
      >
        <div class="flex-grow h-full w-96" style="background-color: var(--bpm-color-4)"></div>
        <div class="w-full h-full flex flex-col pb-2">
          <Column class="flex-grow vertical-scroll no-scroller" style="height: 200px">
            <Row
              v-for="(item, index) in timing.list"
              :class="`w-full py-1 ${timing.selectedIndex === index ? 'timing-item-selected' : 'timing-item'}`"
              :gap="32"
              @click="selectCurrentTiming(index)"
              :key="item.timestamp"
            >
              <span class="w-96 px-4">{{ timeString(item.timestamp) }}</span>
              <div
                class="timing-attr flex flex-center rounded bg-black px-2 text-sm"
                :style="`display: ${item.isKiai ? 'block' : 'none'}`"
              >Kiai</div>
            </Row>
          </Column>
          <Row class="w-full pr-4" right :gap="16">
            <button class="btn h-6" @click="addAtCurrent()">+</button>
            <button class="btn h-6" @click="removeSelected()">-</button>
          </Row>
        </div>
      </div>
<!--      Timing Edit-->
      <Column
        class="h-full vertical-scroll no-scroller pt-2 w-[480px]"
        :gap="8"
        center-horizontal
      >
        <Row class="w-full" :gap="8">
          <ValueAdjust label="BPM" v-model="bpmInfo.bpm" style="flex-basis: 0" class="flex-grow"/>
          <ValueAdjust label="Offset" v-model="bpmInfo.offset" style="flex-basis: 0" class="flex-grow"/>
        </Row>
        <Column class="fill-width block-box" center-horizontal :gap="16">
          <Row class="fill-width justify-evenly items-center">
            <button
              class="beat-button"
              :style="`transform: scale(${1 - beatEffect.tapBeat * 0.05}); opacity: ${0.6 + beatEffect.tapBeat * 0.4}`"
            />
            <div style="background-color: #171c1a; height: 240px; width: 50%">
              <canvas ref="beatWave"></canvas>
            </div>
          </Row>
        </Column>
        <Row class="fill-width block-box" center-vertical v-if="timing.list.length !== 0">
          <span class="text-white">Kiai Mode</span>
          <CheckBox class="ml-auto" v-model="timing.selectedTiming.isKiai"/>
        </Row>
      </Column>
    </Row>
    <Row class="w-full text-white" style="height: 80px">
      <Column center style="background-color: #222a27; padding: 0 16px">
        <span class="text-white select-none" style="font-size: 26px; letter-spacing: 2px">
          {{state.currentTime }}
        </span>
        <span class="select-none text-[--bpm-color-7]">
          {{ bpmInfo.bpm }} BPM
        </span>
      </Column>
      <div class="flex-grow">
        <canvas
          ref="progress"
          class="fill-size"
          @mousedown="mouseState = true"
          @mouseup="changeProgress"
          @mousemove="slideProgress"
          @mouseleave="changeProgress">
        </canvas>
      </div>
      <Row class="bg-[--bpm-color-3]">
        <button class="min-w-[48px] min-h-[48px] ma text-white hover:bg-[--bpm-color-5]" style="font-size: 36px" @click="playOrStart()">
          {{ playState === PlayerState.STATE_PLAYING ? Icon.Pause : Icon.PlayArrow }}
        </button>
        <button class="w-12 aspect-square ma text-white hover:bg-[--bpm-color-5]" style="font-size: 36px" @click="stopPlay()">
          {{ Icon.Stop }}
        </button>
        <Column class="w-60">
          <div class="flex items-end flex-grow" style="flex-basis: 0">
            <span>Playback rate</span>
          </div>
          <Row class="flex-grow" style="flex-basis: 0">
            <button
              class="flex-grow text-white text-sm hover:text-yellow-200"
              v-for="(item, index) in playbackRate"
              @click="state.playbackRateIndex = index"
              style="flex-basis: 0"
              :style="{
                color: state.playbackRateIndex === index ? 'var(--bpm-color-8)' : 'white'
              }"
            >
              {{ Math.round(item * 100) }}%
            </button>
          </Row>
        </Column>
        <button
          class="fill-height bpm-apply"
          @click="applyTiming()"
        >
          Apply
        </button>
      </Row>
    
    </Row>
  </Column>
</template>
<style scoped>
.bpm-calc-box {
  --bpm-color-1:  #171c1a;
  --bpm-color-2:  #222a27;
  --bpm-color-3:  #2e3835;
  --bpm-color-4:  #394642;
  --bpm-color-5:  #45544f;
  --bpm-color-6:  #5c7069;
  --bpm-color-7:  #ffd966;
  --bpm-color-8:  #fff27f;
  --bpm-color-9:  #66ffcc;
  --bpm-color-10: #af00af;
  --bpm-color-11: #38e7ab;
}
.timing-item:hover {
  background-color: var(--bpm-color-6);
}

.timing-item-selected {
  background-color: var(--bpm-color-9);
}
.btn {
  background-color: var(--bpm-color-9);
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
.bpm-apply {
  width: 128px;
  background-color: var(--bpm-color-7);
  color: #000;
  font-size: 26px
}

.bpm-apply:hover {
  background-color: var(--bpm-color-8);
}

.bpm-apply:active {
  background-color: var(--bpm-color-9);
  color: white;
}

.timing-attr {
  color: var(--bpm-color-10);
}

.block-box {
  padding: 16px 12px;
  background-color: #2e3835;
  border-radius: 4px;
}

.bpm-close {
  padding: 0 16px;
  cursor: pointer;
}

.bpm-close:hover {
  background-color: rgba(72, 87, 83, 0.85);
}

.bpm-close:active {
  background-color: rgb(79, 94, 90);
}
</style>