<template>
  <div class="fill-size" style="pointer-events: none">
    <canvas width="1280" height="720" ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, ref, watch} from "vue";
import {WebGLRenderer} from "../ts/webgl/WebGLRenderer";
import {Viewport} from "../ts/webgl/Viewport";
import {destroyVisualizer, Visualizer} from "../ts/Visualizer";
import {useStore} from "vuex";
import {BeatLogo, FadeBeatLogo} from "../ts/webgl/BeatLogo";
import {useEvent} from "../ts/EventBus";
import { calcRMS, findMusic, useMouse} from "../ts/Utils";
import {RoundVisualizer} from "../ts/webgl/RoundVisualizer";
import {MovableBackground} from "../ts/webgl/MovableBackground";
import {Beater} from "../ts/Beater";
import {getBeater} from "../ts/TimingInfo";
import {AudioPlayerV2} from "../ts/AudioPlayerV2";

const store = useStore()

const canvas = ref<HTMLCanvasElement | null>(null)
let isOpen = false
let renderer: WebGLRenderer
let beatLogo: BeatLogo
let fadeBeatLogo: FadeBeatLogo
let roundVisualizer: RoundVisualizer
let background: MovableBackground

let beater = new Beater({ bpm: 60, offset: 0 })

const player = AudioPlayerV2.instance
const visualizer = player.getVisualizer()

const audioData = {
  sampleRate: 0,
  leftChannel: new Float32Array(0),
  rightChannel: new Float32Array(0)
}

watch(player.isPlaying, (value) => {
  isOpen = value;
  if (isOpen) {
    requestAnimationFrame(draw)
  }
})
useEvent({

  onBpmChanged(id: number) {
    getBeater(id).then((res) => {
      beater = res
    })
  },

  onSongChanged(id: number) {
    const music = findMusic(store, id)
    if (music) {
      getBeater(id).then((res) => {
        beater = res
      })
    }
    const audioBuffer = player.getAudioBuffer();
    audioData.sampleRate = audioBuffer.sampleRate
    if (audioBuffer.numberOfChannels < 2) {
      audioData.leftChannel = audioBuffer.getChannelData(0)
      audioData.rightChannel = audioData.leftChannel
    } else {
      audioData.leftChannel = audioBuffer.getChannelData(0)
      audioData.rightChannel = audioBuffer.getChannelData(1)
    }
  }

})

const [ mouseX, mouseY ] = useMouse()

onMounted(() => {
  const c = canvas.value
  if (!c) return
  const webgl = c.getContext("webgl2")
  if (!webgl) {
    return;
  }
  resizeCanvas()

  isOpen = true
  const viewport: Viewport = new Viewport({
    x: 0,
    y: 0,
    height: window.innerHeight,
    width: window.innerWidth
  })
  renderer = new WebGLRenderer(webgl, viewport)

  background = new MovableBackground(webgl, {
    x: '-50w',
    y: '50h',
    width: '100w',
    height: '100h'
  })

  roundVisualizer = new RoundVisualizer(webgl, {
    width: '100w',
    height: '100h',
    horizontal: "center",
    vertical: "center"
  })

  beatLogo = new BeatLogo(webgl, {
    width: 600,
    height: 600,
    vertical: "center",
    horizontal: "center"
  })
  fadeBeatLogo = new FadeBeatLogo(webgl, {
    width: 512,
    height: 512,
    vertical: "center",
    horizontal: "center"
  })

  window.onresize = () => {
    resizeCanvas()
    renderer.setViewport(new Viewport({
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight
    }))
  }
  renderer.addDrawable(background)
  renderer.addDrawable(roundVisualizer)
  renderer.addDrawable(beatLogo)
  // renderer.addDrawable(fadeBeatLogo)
  draw()
})

onUnmounted(() => {
  isOpen = false
  destroyVisualizer(store)
  renderer.dispose()
})

function draw(timestamp: number = 0) {
  if (!isOpen) {
    return
  }
  requestAnimationFrame(draw)
  // if (!Visualizer.instance || !Visualizer.instance.isEnabled()) {
  //   return;
  // }
  // const dataArray = Visualizer.instance.getFFT()
  const dataArray = visualizer.getFFT()
  if (!dataArray) {
    return;
  }
  const isKiai = beater.isKiai(player.currentTime)
  const [arr, volume] = toFloatArray(dataArray)
  roundVisualizer.writeData(arr, 200, timestamp)
  const scale = calcBeat(isKiai, volume)


  if (isKiai) {
    if ((beater.getBeatCountRef().value & 1) === 0) {
      background.setBrightness(scale * 0.5, 0)
    } else {
      background.setBrightness(0, scale * 0.5)
    }
  } else {
    if ((beater.getBeatCountRef().value & 0b11) === 0) {
      background.setBrightness(scale * 0.3, scale * 0.3)
    }

  }
  renderer.render()
}

function calcBeat(isKiai: boolean, volume: number) {
  const time = player.currentTime
  const scale = beater.beat(time)
  const transX = (mouseX.value - window.innerWidth / 2)
  const transY = (window.innerHeight / 2 - mouseY.value)
  roundVisualizer.setTransform(transX, transY)
  let adjust = audioData.sampleRate !== 0 ? calcRMS(
      audioData.sampleRate,
      audioData.leftChannel,
      audioData.rightChannel,
      time
  ) * 0.08: scale * 0.02
  beatLogo.setTransform(
      // isKiai ? (1 - scale * 0.02) : (1 - volume * 0.6),
      1 - adjust, // * 0.02,
      isKiai ? scale : 0,
      transX,
      transY
  )
  // fadeBeatLogo.setTransform(
  //     // isKiai ? (1 - scale * 0.02) : (1 - volume * 0.6),
  //     1 + adjust, // * 0.02,
  //     0
  // )
  background.setTransform(transX, transY)
  // store.commit("setBeat", scale)
  return scale
}

function resizeCanvas() {
  if (canvas.value) {
    canvas.value.height = window.innerHeight
    canvas.value.width = window.innerWidth
  }
}

function toFloatArray(fft: Uint8Array): [number[], number] {
  const result = []
  let volume = 0
  for (let i = 0; i < fft.length; i++) {
    const value = fft[i] / 256.0
    volume += value
    result.push(value)
  }
  return [result, volume / fft.length]
}

</script>

<style scoped>

</style>