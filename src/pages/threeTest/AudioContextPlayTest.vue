<template>
  <div class="button-box">
    <button @click="play()">play</button>
    <button @click="pause()">pause</button>
    <button @click="forward">forward</button>
    <button @click="backward">backward</button>
    <button @click="fast">fast</button>
    <button @click="slow">slow</button>
    <button @click="start">start</button>
  </div>
  <div class="info-box">
    <span>{{ state.current }}</span>
    <span>{{ state.duration }}</span>
  </div>
</template>

<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {currentMilliseconds, int} from "../../ts/Utils";

const musicUrl = "/api/music?id=77"

const state = reactive({
  current: 0,
  duration: 0
})

let source: AudioBufferSourceNode
let context: AudioContext
let audioBuffer: AudioBuffer
onMounted(async () => {
  let a = currentMilliseconds()
  const response = await fetch(musicUrl)
  const arrayBuffer = await response.arrayBuffer()
  let b = currentMilliseconds()
  console.log("download cast ", b - a, "ms")
  context = new AudioContext()
  // await context.suspend()
  a = currentMilliseconds()
  audioBuffer = await context.decodeAudioData(arrayBuffer)
  b = currentMilliseconds()
  console.log("decode cast", b - a, "ms")
  state.duration = audioBuffer.duration
  requestAnimationFrame(updateInfo)
})

const time = new TimePlayer()

function start() {
  pause()
  time.reset()
  play()
}

function play() {
  console.log('start play')
  source = context.createBufferSource()
  source.buffer = audioBuffer
  source.connect(context.destination)
  source.onended = () => {
    time.pause()
  }
  source.start(0, time.currentTime().value / 1000)
  time.play()
}

function pause() {
  // await context.suspend()
  source.onended = null
  source.stop()
  time.pause()
  source.disconnect()
}

function slow() {
  if (source)
  source.playbackRate.value = 0.1
  time.speed(0.1)
}

function fast() {
  if (source)
  source.playbackRate.value = 1
  time.speed(1)
}

function updateInfo() {
  // if (source)
  // state.current = source.context.currentTime
  state.current = time.currentTime().value / 1000
  requestAnimationFrame(updateInfo)
}



// function playOrStart() {
//   if (player.paused) {
//     player.play()
//   } else {
//     player.pause()
//   }
// }
//
function forward() {
  pause()
  time.seek(time.currentTime().value + 10000)
  console.log(time.currentTime().value)
  play()
}
function backward() {
  pause()
  time.seek(time.currentTime().value - 10000)
  console.log(time.currentTime().value)
  play()
}
</script>

<style scoped>
.button-box {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: fit-content;
  column-gap: 8px;
}
.info-box {
  display: flex;
  flex-direction: column;
}
</style>