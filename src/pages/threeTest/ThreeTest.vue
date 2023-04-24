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
import WaveSurfer from 'wavesurfer.js'
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
  const wave = WaveSurfer.create({
    container: canvas.value.parentElement!!,
    waveColor: 'violet',
    progressColor: 'purple',
    mediaType: "audio",
  })
  wave.load('/api/music?id=2')

})

const audio = new Audio("/api/music?id=2")
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
  console.log(progress.value)
}

async function audioContext(): Promise<[Float32Array, number]> {


  const response = await fetch("/api/music?id=2")
  const arrayBuffer = await response.arrayBuffer()
  const context = new AudioContext()
  const audioBuffer = await context.decodeAudioData(arrayBuffer)
  const pcm = audioBuffer.getChannelData(0)
  await context.close()
  return [pcm, audioBuffer.sampleRate]
}

function draw(pcm: Float32Array, sampleRate: number) {

  const func = () => {
    const duration = pcm.length / sampleRate
    if (audio.currentTime >= duration) {
      return
    }
    const bound = resizeCanvas()
    context.beginPath()
    context.translate(0, bound.height / 2)

    context.lineWidth = 1
    context.strokeStyle = 'red'
    let sliceWidth = 1
    for (let i = 0; i < pcm.length && i < bound.width * window.devicePixelRatio; i++) {
      const index = Math.round( i / bound.width * duration )
      context.moveTo(sliceWidth, 0)
      context.lineTo(sliceWidth, pcm[index * sampleRate] * 100)
      sliceWidth += 1
    }
    context.stroke()
  }

  func()
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