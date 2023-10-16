<script setup lang="ts">
import {ref} from "vue";
import {degreeToRadian} from "../ts/Utils";
import AudioPlayerV2 from "../ts/player/AudioPlayer";
import {useTransitionRef} from "../ts/use/useTransitionRef";
import {useContext2D} from "../ts/use/useContext2D";

const canvas = ref<HTMLCanvasElement | null>(null)

const player = AudioPlayerV2

let isShow = false
let opacity = ref(0)

const opacityBegin = useTransitionRef(opacity)

const drawVolume = useContext2D(canvas, context => {
  const volume = player.volume.value
  const ctx = context
  const bound = resizeCanvas(canvas.value)
  ctx.beginPath()
  ctx.fillStyle = '#23131d'
  ctx.ellipse(
    bound.width / 2,
    bound.height / 2,
    100,
    100,
    degreeToRadian(0),
    0,
    360
  )
  ctx.fill()
  ctx.beginPath()
  ctx.strokeStyle = "#fad5ec"
  ctx.lineWidth = 2
  const angle = Math.floor(volume * 270)
  ctx.arc(
    bound.width / 2,
    bound.height / 2,
    80,
    degreeToRadian(90), degreeToRadian(90 + angle)
  )
  ctx.stroke()
  ctx.beginPath()
  ctx.fillStyle = "#fad5ec"
  ctx.lineWidth = 2
  ctx.font = "56px monospace"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(Math.floor(volume * 100).toString(), bound.width / 2,
    bound.height / 2)
  ctx.fill()
})

function resizeCanvas(canvas: HTMLCanvasElement | null) {
  let width = 0, height = 0
  if (canvas) {
    canvas.width = (width = canvas.parentElement!!.offsetWidth)
    canvas.height = (height = canvas.parentElement!!.offsetHeight)
  }
  return { width, height }
}

function changeVolume(ev: WheelEvent) {
  if (!isShow) {
    opacityBegin().transitionTo(1, 100)
  }
  isShow = true
  const dir = ev.deltaY < 0 ? 1 : -1
  player.setVolume(player.volume.value + .05 * dir)
  drawVolume.value?.()
}

function fadeOut() {
  if (isShow) {
    opacityBegin().transitionTo(0, 100)
  }
}
</script>
<template>
  <div
    :style="`width: 200px; height: 200px; opacity: ${opacity}`"
    @wheel="changeVolume"
    @mouseleave="fadeOut()"
  >
    <canvas ref="canvas"></canvas>
  </div>
</template>
<style scoped>
</style>