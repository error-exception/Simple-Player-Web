<template>
  <div style="column-gap: 16px">
    <button @click="playOrStart()">播放或暂停</button>
    <button @click="forward()">forward</button>
    <button @click="backward()">backward</button>
  </div>
  <div style="width: 100vw; height: 240px; position: relative">
    <div ref="box" style="width: 100vw; height: 240px; position: absolute">
      <canvas class="fill-size"></canvas>
    </div>
    <canvas class="fill-size" ref="progress" style="position: absolute"></canvas>
  </div>

  <div class="box">
<!--    <div style="background-color: black"></div>-->
    <div :style="`transform: scale(${ scale })`"></div>
  </div>
</template>

<script setup lang="ts">

import {int} from "../../ts/Utils";
import {onMounted, Ref, ref} from "vue";
import {Beater} from "../../ts/Beater";
import WaveSurfer from "wavesurfer.js";

const scale = ref(0)

const musicUrl = "/api/music?id=10191"
const player = new Audio(musicUrl)
console.log(player.currentSrc)
let buffer: AudioBuffer
let beater = new Beater({
  bpm: 140,
  offset: 1780
})

let beatVolume: number[] = []
const box = ref<HTMLDivElement>()
const progress = ref<HTMLCanvasElement | null>(null)

onMounted(async () => {
  const response =  await fetch(musicUrl)
  const arrayBuffer = await response.arrayBuffer()
  const audioContext = new AudioContext()
  await audioContext.decodeAudioData(arrayBuffer, (decodedData) => {
    buffer = decodedData
    // const sampleRate = buffer.sampleRate
    // console.log(sampleRate)
    // const unit = sampleRate / 1000
    // const duration = int(buffer.duration * 1000)
    // const gap = 60 / beater.getBpm() * 1000
    // const offset = beater.getOffset()
    // let v = 0
    // for (let i = offset; i < duration; i += gap) {
    //   const left = Math.max(buffer.getChannelData(0)[int(i * unit)], 0)
    //   const right = Math.max(buffer.getChannelData(1)[int(i * unit)], 0)
    //   let value = Math.max(left, right)
    //   v = Math.max(value, v)
    //   beatVolume.push(value)
    // }
    // let scale = 1//1 / v
    // for (let i = 0; i < beatVolume.length; i++) {
    //   beatVolume[i] *= scale
    // }
    // const wave = WaveSurfer.create({
    //   container: box.value!!,
    //   waveColor: 'violet',
    //   progressColor: 'purple',
    //   mediaType: "audio",
    // })
    // wave.load(musicUrl)
    console.log(beatVolume)
    requestAnimationFrame(draw)
  })
})

function draw() {

  const currentTime = int(player.currentTime * 1000)
  const sampleRate = buffer.sampleRate
  const unit = sampleRate / 1000
  // const left = Math.abs(buffer.getChannelData(0)[int(currentTime * unit)])
  // const right = Math.abs(buffer.getChannelData(1)[int(currentTime * unit)])
  const beatIndex = beater.getBeatCountRef().value
  const left = buffer.getChannelData(0)
  const right = buffer.getChannelData(1)
  const volume = calcRMSv2(left, right, currentTime)
  // const value = Math.min(beatVolume[beatIndex] + 0.4, 1)
  scale.value = 1 - /*value * beater.beat(currentTime) * 0.02*/volume * 0.1
  // if (Math.abs(value - 1) < 0.0000001) {
  //   console.log("max", beatIndex, value)
  // }
  drawProgressbar()
  requestAnimationFrame(draw)

}

function calcRMS(left: Float32Array, right: Float32Array, currentTime: number) {
  const wid = 1024 * 2
  const halfWin = wid / 2
  const sampleRate = buffer.sampleRate
  const unit = sampleRate / 1000
  const index = int(currentTime * unit)
  let sum = 0
  if (index < halfWin) {
    for (let i = 0; i < wid; i++) {
      const max = Math.max(left[i], right[i])
      sum += max ** 2
    }
  } else if (left.length - index < halfWin) {
    for (let i = left.length; i > left.length - wid; i--) {
      const max = Math.max(left[i], right[i])
      sum += max ** 2
    }
  } else {
    for (let i = index - halfWin; i < index + halfWin; i++) {
      const max = Math.max(left[i], right[i])
      sum += max ** 2
    }
  }
  return Math.sqrt(sum / wid)
}

function calcRMSv2(left: Float32Array, right: Float32Array, currentTime: number) {
  const wid = 1024 * 2
  const halfWin = wid / 2
  const sampleRate = buffer.sampleRate
  const unit = sampleRate / 1000
  const index = int(currentTime * unit)
  let sum = 0
  if (left.length - index < wid) {
    for (let i = left.length; i > left.length - wid; i--) {
      const max = Math.max(left[i], right[i])
      sum += max ** 2
    }
  } else {
    for (let i = index; i < index + wid; i++) {
      const max = Math.max(left[i], right[i])
      sum += max ** 2
    }
  }
  return Math.sqrt(sum / wid)
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

function drawProgressbar() {
  const bound = resizeCanvas(progress)
  const ctx = progress.value!!.getContext("2d")!!
  const progressValue = player.currentTime / player.duration
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


function playOrStart() {
  if (player.paused) {
    player.play()
  } else {
    player.pause()
  }
}

function forward() {
  player.currentTime += 10
}
function backward() {
  player.currentTime -= 10
}

</script>

<style scoped>
.box {
  width: 600px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.box > div {
  background-color: #33cb98;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  position: absolute;
}
</style>