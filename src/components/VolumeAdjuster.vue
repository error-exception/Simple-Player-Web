<template>
  <div
      :style="`width: 200px; height: 200px; opacity: ${opacity}`"
      @wheel="changeVolume"
      @mouseleave="fadeOut()"
  >
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {degreeToRadian} from "../ts/Utils";
import {simpleAnimate} from "../ts/util/Animation";
import {AudioPlayerV2} from "../ts/AudioPlayerV2";


const canvas = ref<HTMLCanvasElement | null>(null)

const player = AudioPlayerV2.instance

let context: CanvasRenderingContext2D
let isShow = false
let opacity = ref(0)

onMounted(() => {
  if (canvas.value) {
    const ctx = canvas.value.getContext("2d")
    if (ctx) {
      context = ctx
    }
  }
})

function resizeCanvas(canvas: HTMLCanvasElement | null) {
  if (canvas) {
    canvas.width = canvas.parentElement!!.offsetWidth
    canvas.height = canvas.parentElement!!.offsetHeight
    return {
      width: canvas.width,
      height: canvas.height
    }
  }
  return {
    width: 0,
    height: 0
  }
}

function drawVolume(volume: number) {
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
  ctx.font = "56px harmony"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(Math.floor(volume * 100).toString(), bound.width / 2,
      bound.height / 2)
  ctx.fill()

}

function changeVolume(ev: WheelEvent) {
  if (!isShow) {
    simpleAnimate(opacity).easeInOutTo(1, 100)
  }
  isShow = true
  if (ev.deltaY < 0) {
    player.setVolume(player.volume.value + .05)
  } else {
    player.setVolume(player.volume.value - .05)
  }
  drawVolume(player.volume.value)

}

function fadeOut() {
  if (isShow) {
    simpleAnimate(opacity).easeInOutTo(0, 100)
    isShow = false
  }
}

// export default {
//   name: 'VolumeAdjuster',
//   data() {
//     return {
//       isAdjust: false,
//       isIn: false
//     }
//   },
//   computed: {
//     player() {
//       return AudioPlayer.instance
//     },
//     volumeIcon() {
//       const volume = Math.round(this.player.volume.value * 100)
//       if (volume >= 60) {
//         return Icon.VolumeUp
//       }
//       if (volume > 30) {
//         return Icon.VolumeDown
//       }
//       if (volume > 0) {
//         return Icon.VolumeMute
//       }
//       return Icon.VolumeOff
//     }
//   },
//   methods: {
//
//   },
//   components: {Column}
// }

</script>

<style scoped>
</style>