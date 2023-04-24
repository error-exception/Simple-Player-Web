<template>
  <Column class="fill-size" style="background-color: #171c1a">
    <Row class="fill-width" style="background-color: #374340; padding: 16px">
      <span class="font-white fill-height">Timing</span>
      <span class="ml-auto font-white fill-height" @click="closeCalculator()">Close</span>
    </Row>
    <div class="fill-width font-white" style="height: 80px; background-color: #212926">
      <canvas ref="wave" @wheel="changeByBpm"></canvas>
    </div>
    <Row class="flex-grow" :gap="16">
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
            <span class="font-bold" style="color: purple;">{{ item.isKiai ? 'Kiai' : '' }}</span>
          </Row>
        </Column>
        <Row class="fill-width" right :gap="16" style="padding-right: 16px;">
          <button class="btn" style="height: 24px" @click="addAtCurrent()">+</button>
          <button class="btn" style="height: 24px" @click="removeSelected()">-</button>
        </Row>
      </Column>
      <Column
          class="fill-height vertical-scroll no-scroller"
          style="padding: 8px; width: 420px; background-color: #2e3835"
          :gap="16"
          center-horizontal
      >
        <Column class="fill-width" center-horizontal :gap="12">
          <span class="font-white">BPM</span>
          <Row class="fill-width" :gap="8" center-horizontal>
            <button class="bpm-adjust-btn ma" @click="adjustBpm(false)">
              {{ Icon.Remove }}
            </button>
            <input class="bpm-input" v-model="state.beatInfo.bpm">
            <button class="bpm-adjust-btn ma" @click="adjustBpm(true)">
              {{ Icon.Add }}
            </button>
          </Row>
        </Column>
        <Column class="fill-width" center-horizontal :gap="12">
          <span class="font-white">Offset</span>
          <Row class="fill-width" :gap="8" center-horizontal>
            <button class="bpm-adjust-btn ma" @click="adjustOffset(false)">
              {{ Icon.Remove }}
            </button>
            <input class="bpm-input" v-model="beatOffset">
            <button class="bpm-adjust-btn ma" @click="adjustOffset(true)">
              {{ Icon.Add }}
            </button>
          </Row>
          <Row class="fill-width font-white" :gap="16" center-horizontal>
            <Row center :gap="4">
              1.0 <CheckBox type="radio" :checked="state.precisionIndex === 0" @change="state.precisionIndex = 0"/>
            </Row>
            <Row center :gap="4">
              10.0 <CheckBox type="radio" :checked="state.precisionIndex === 1" @change="state.precisionIndex = 1"/>
            </Row>
            <Row center :gap="4">
              100.0 <CheckBox type="radio" :checked="state.precisionIndex === 2" @change="state.precisionIndex = 2"/>
            </Row>
            <Row center :gap="4">
              beat gap <CheckBox type="radio" :checked="state.precisionIndex === 3" @change="state.precisionIndex = 3"/>
            </Row>
          </Row>
        </Column>
<!--        <button class="btn" style="height: 48px">Use current time as offset</button>-->
        <Row class="fill-width" center-horizontal :gap="64">
          <div class="bpm-side-beat" :style="`opacity: ${state.beatEffect.left}`" ></div>
          <button class="beat-button" @click="click" :style="`transform: scale(${state.beatEffect.tapBeat})`">Tap</button>
          <div class="bpm-side-beat" :style="`opacity: ${state.beatEffect.right}`" ></div>
        </Row>
        <Row class="fill-width" center-horizontal style="justify-content: space-evenly">
          <div class="round" :style="`opacity: ${state.beatEffect.first}`"></div>
          <div class="round" :style="`opacity: ${state.beatEffect.second}`"></div>
          <div class="round" :style="`opacity: ${state.beatEffect.third}`"></div>
          <div class="round" :style="`opacity: ${state.beatEffect.fourth}`"></div>
        </Row>
        <Row class="fill-width" center-vertical v-if="state.timing.list.length !== 0">
          <span class="font-white">Kiai Mode</span>
          <CheckBox class="ml-auto" v-model="state.timing.list[state.timing.selectedIndex].isKiai"/>
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
      <button class="fill-height bpm-apply" @click="useCurrentBpm()">
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
import {beatFuncV2, findMusic, removeAt, useKeyboard} from "../ts/Utils";
import {AudioPlayer} from "../ts/AudioPlayer";
import {TimingItem} from "../ts/TimingItem";
import CheckBox from "./CheckBox.vue";
import {addTimingInfoToCache, getBeater, TimingInfo, uploadTimingInfo} from "../ts/TimingInfo";

const emit = defineEmits<{
  (e: 'close'): void
}>()

const playbackRate = ref([0.25, 0.5, 0.75, 1.0])

type ReactiveState = {
  gap: number[],
  playbackRateIndex: number,
  timing: {
    list: TimingItem[],
    selectedIndex: number
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
    selectedIndex: 0
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
  main: false,
  progress: false,
  wave: false
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

const store = useStore()

const player = AudioPlayer.instance

let progressContext: CanvasRenderingContext2D

let waveContext: CanvasRenderingContext2D

let [beatFunc, beatCount] = beatFuncV2(state.beatInfo.bpm)

useKeyboard("down", (evt: KeyboardEvent) => {
  if (!evt.isTrusted) {
    return
  }
  if (evt.code === 'KeyT' || evt.code === 'KeyY') {
    tap(evt.timeStamp)
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
    const i = beatFuncV2(value)
    beatFunc = i[0]
    beatCount = i[1]
  }
  if (!player.isPlaying.value) {
    drawWave(1)
  }
})

watch(() => state.beatInfo.offset, () => {
  if (!player.isPlaying.value) {
    drawWave(1)
  }
})

watch(() => state.playbackRateIndex, (value) => {
  player.setPlaybackRate(playbackRate.value[value])
})

useEvent({

  onSongChanged(id: number) {
    const music = findMusic(store, id)
    if (music) {
      const i = beatFuncV2(music.bpm)
      beatFunc = i[0]
      beatCount = i[1]
      state.beatInfo.bpm = music.bpm
      state.beatInfo.offset = music.offset
    }
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
  const currentMusic = store.state.currentMusic;
  getBeater(currentMusic.id).then((res) => {
    state.beatInfo.bpm = res.getBpm()
    state.beatInfo.offset = res.getOffset()
    state.timing.list = res.getTimingList()
    if (player.isPlaying.value) {
      drawFlag.main = true
      drawFlag.progress = true
      drawFlag.wave = true
      draw()
    }
  })

})

onUnmounted(() => {
  drawFlag.main = false
})

let previous = 0

const WINDOW = 8

function closeCalculator() {
  player.setPlaybackRate(playbackRate.value[3])
  emit("close")
}

function tap(timestamp: number) {
  if (timestamp - previous > 2000)
    reset()
  if (previous === 0) {
    previous = timestamp
  } else {
    const gap = timestamp - previous
    state.gap.push(gap)
    if (state.gap.length > WINDOW) {
      state.gap.shift()
    }
    const arr = state.gap;
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i]
    }
    const average = sum / arr.length
    state.beatInfo.bpm = Math.round(60 / average * 1000)
    // state.tapIndex = (state.tapIndex + 1) % 4
    previous = timestamp
  }
}

function reset() {
  state.gap.length = 0
  state.beatInfo.bpm = 0
  previous = 0
  state.beatInfo.offset = 0
}

function click(a: KeyboardEvent) {
  tap(a.timeStamp)
}

function useCurrentBpm() {
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
  drawFlag.progress = true
  drawProgressbar()
  drawWave(1)
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
    if (state.playbackRateIndex === 3) {
      const gap = 60 / state.beatInfo.bpm * 1000
      beatOffset.value += Math.floor(gap)
    } else {
      beatOffset.value += (10 ** state.precisionIndex)
    }
  } else {
    if (state.playbackRateIndex === 3) {
      const gap = 60 / state.beatInfo.bpm * 1000
      beatOffset.value -= Math.floor(gap)
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
  drawWave(1)
  state.currentTime = timeString(player.currentTime)
}

function stopPlay() {
  player.pause()
  player.seek(0)
  drawProgressbar()
  drawWave(1)
}

function addAtCurrent() {
  const timingItem = new TimingItem({
    isKiai: false,
    timestamp: Math.floor(player.currentTime)
  })
  state.timing.list.push(timingItem)
  state.timing.list = state.timing.list.sort((a, b) => a.timestamp - b.timestamp)
}

function removeSelected() {
  removeAt(state.timing.list, state.timing.selectedIndex)
}

function selectCurrentTiming(index: number) {
  state.timing.selectedIndex = index
  player.seek(state.timing.list[index].timestamp)
}

function draw() {
  if (!drawFlag.main) {
    return
  }
  requestAnimationFrame(draw)
  const scale = beat()
  state.currentTime = timeString(player.currentTime)
  drawProgressbar()
  drawWave(scale)
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
  let scale = 0;
  const beatOffset = state.beatInfo.offset
  if (time > beatOffset) {
    scale = beatFunc(time - beatOffset)
  } else {
    scale = 1
  }
  state.beatEffect.tapBeat = 1 - scale * 0.05
  if ((beatCount.value & 0b11) == 0) {
    state.beatEffect.first = scale
  }
  if ((beatCount.value & 0b11) == 1) {
    state.beatEffect.second = scale
  }
  if ((beatCount.value & 0b11) == 2) {
    state.beatEffect.third = scale
  }
  if ((beatCount.value & 0b11) == 3) {
    state.beatEffect.fourth = scale
  }
  if ((beatCount.value & 0b1) == 0) {
    state.beatEffect.left = 0.1 + scale * 0.9
    state.beatEffect.right = 0.1
  }
  if ((beatCount.value & 0b1) == 1) {
    state.beatEffect.left = 0.1
    state.beatEffect.right = 0.1 + scale * 0.9
  }
  return scale
}

function resizeCanvas(htmlRef: Ref<HTMLCanvasElement | null>) {
  const canvas = htmlRef.value
  if (!canvas) {
    return {
      width: 0,
      height: 0
    }
  }
  canvas.height = canvas.parentElement!!.offsetHeight
  canvas.width = canvas.parentElement!!.offsetWidth
  return {
    width: canvas.width,
    height: canvas.height
  }
}

// TODO: draw kiai mode time
function drawProgressbar() {
  if (!drawFlag.progress) {
    return
  }
  const bound = resizeCanvas(progress)
  progressBound = bound
  const ctx = progressContext
  const progressValue = player.currentTime / player.duration.value
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

const DRAW_COUNT = 20

function drawWave(scale: number) {
  if (!drawFlag.wave) {
    return
  }
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

//  music start line
  if (musicStartX > 0) {
    ctx.beginPath()
    ctx.strokeStyle = "yellow"
    ctx.lineWidth = 4
    console.log()
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
  ctx.strokeStyle = `rgba(255, 0, 0, ${scale})`
  ctx.lineWidth = 2
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
.bpm-input {
  color: white;
  text-align: center;
  font-size: 20px;
  background-color: black;
  width: 260px;
  border-radius: 600px;
  padding: 8px 0;
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
  aspect-ratio: 1/1;
  border-radius: 50%;
  background-color: #60756e;
  font-size: 26px;
}
.bpm-adjust-btn {
  color: white;
  background-color: black;
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 6px;
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
</style>