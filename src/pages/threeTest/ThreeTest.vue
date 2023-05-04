<template>
  <div style="width: 100vw; height: 100vh; position: relative" ref="box" class="b">
    <div style="width: 100vw; height: 100vh; position: absolute">
      <canvas ref="canvas" class="fill-size" style="position: absolute"></canvas>
    </div>
    <div class="line" style="position: absolute" :style="`transform: translateX(${progress}vw)`"></div>
    <button style="position: absolute; top: 200px" @click="play()">播放</button>
    <button style="position: absolute; top: 230px" @click="backward()">backward</button>
    <button style="position: absolute; top: 260px" @click="forward()">forward</button>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import WaveSurfer, {valueOf} from 'wavesurfer.js'
import {int} from "../../ts/Utils";
const box = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let context: CanvasRenderingContext2D

const progress = ref(0)

onMounted(() => {
  if (!canvas.value) {
    return
  }
  context = canvas.value.getContext('2d')!!
  resizeCanvas()
  audioContext().then((buffer) => {
    draw(buffer)
  })

  const wave = WaveSurfer.create({
    container: canvas.value.parentElement!!,
    waveColor: 'violet',
    progressColor: 'purple',
    mediaType: "audio",
  })
  wave.load('/api/music?id=0')

})

const audio = new Audio("/api/music?id=0")
audio.load()
let flag = false
function play() {
  if (audio.paused) {
    audio.play()
    if (!flag) {
      drawProgress()
      flag = true
    }
  } else {
    audio.pause()
  }
}

function forward() {
  audio.currentTime += 10
}
function backward() {
  audio.currentTime -= 10
}
function drawProgress() {
  if (audio.currentTime >= audio.duration) {
    return
  }
  requestAnimationFrame(drawProgress)
  progress.value = audio.currentTime / audio.duration * 100
}

async function audioContext(): Promise<AudioBuffer> {


  const response = await fetch("/api/music?id=0")
  const arrayBuffer = await response.arrayBuffer()
  const context = new AudioContext()
  const audioBuffer = await context.decodeAudioData(arrayBuffer)
  await context.close()
  return audioBuffer
}

function draw(buffer: AudioBuffer) {

  const sampleRate = buffer.sampleRate

  // const left = buffer.getChannelData(0)
  // const right = buffer.getChannelData(1)
  // let pcm = new Float32Array(left.length)
  // for (let i = 0; i < buffer.length; i++) {
  //   pcm[i] = Math.max(left[i], right[i])
  // }
  const pcm = buffer.getChannelData(1)
  const height = 200
  const bound = resizeCanvas()
  const width = bound.width * 20
  const duration = buffer.duration
  const lineWidth = 1
  const sampleRateStep = int(duration / width * sampleRate)
  context.beginPath()
  context.translate(0, 200)
  context.scale(1, 1)
  context.lineWidth = lineWidth
  context.strokeStyle = 'red'
  let sliceWidth = 0
  for (let i = 0; i < pcm.length; i += sampleRateStep) {
    const value = Math.abs(pcm[i]) * height
    context.moveTo(Math.round(sliceWidth), -value / 2)
    context.lineTo(Math.round(sliceWidth), value / 2)
    sliceWidth += 1
  }

  context.stroke()
}

function resizeCanvas() {
  if (canvas.value) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  } else {
    return {
      width: 0,
      height: 0
    }
  }
}
</script>

<style scoped>
.line {
  width: 1px;
  height: 100vh;
  background-color: green;
}
</style>