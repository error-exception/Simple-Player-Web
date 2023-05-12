<template>
  <div class="fill-size" style="pointer-events: none">
    <canvas width="1280" height="720" ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import {WebGLRenderer} from "../ts/webgl/WebGLRenderer";
import {Viewport} from "../ts/webgl/Viewport";
import {useStore} from "vuex";
import {BeatLogo} from "../ts/webgl/BeatLogo";
import {useEvent} from "../ts/EventBus";
import {calcRMS, findMusic, useMouse} from "../ts/Utils";
import {RoundVisualizer} from "../ts/webgl/RoundVisualizer";
import {Background} from "../ts/webgl/MovableBackground";
import {Beater, BeatState} from "../ts/Beater";
import {getBeater} from "../ts/TimingInfo";
import {AudioPlayerV2} from "../ts/AudioPlayerV2";
import {easeOut, easeOutQuint} from "../ts/util/Easing";
import {Ripple} from "../ts/webgl/Ripple";
import {Time} from "../ts/Time";
import {Vector2} from "../ts/webgl/core/Vector2";
import {Box} from "../ts/webgl/Box";
import {ImageLoader} from "../ts/ImageResources";

import logoImg from '../assets/Logo2.png'
import rippleImg from '../assets/ripple.png'
import {BeatLogoBox} from "../ts/webgl/BeatLogoBox";

const store = useStore()

const canvas = ref<HTMLCanvasElement | null>(null)
let isOpen = false
let renderer: WebGLRenderer
// let beatLogo: BeatLogo
// let roundVisualizer: RoundVisualizer
let background: Background
// let ripple: Ripple
// let drawableBox: Box
let beatLogoBox: BeatLogoBox

let beater = new Beater({ bpm: 60, offset: 0 })

const player = AudioPlayerV2.instance

const audioData = {
  sampleRate: 0,
  leftChannel: new Float32Array(0),
  rightChannel: new Float32Array(0)
}

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

onMounted(async () => {
  const c = canvas.value
  if (!c) return
  const webgl = c.getContext("webgl2")
  if (!webgl) {
    return;
  }
  resizeCanvas()

  await ImageLoader.load(logoImg, "logo")
  await ImageLoader.load(rippleImg, "ripple")
  await ImageLoader.load("/res/pics/1.png")
  await ImageLoader.load("/res/pics/2.png")
  await ImageLoader.load("/res/pics/3.png")
  await ImageLoader.load("/res/pics/4.png")
  await ImageLoader.load("/res/pics/5.png")
  await ImageLoader.load("/res/pics/6.png")
  await ImageLoader.load("/res/pics/7.png")
  await ImageLoader.load("/res/pics/8.png")
  await ImageLoader.load("/res/pics/9.png")
  await ImageLoader.load("/res/pics/10.png")
  await ImageLoader.load("/res/pics/11.png")
  await ImageLoader.load("/res/pics/12.png")
  await ImageLoader.load("/res/pics/13.png")
  await ImageLoader.load("/res/pics/14.png")
  await ImageLoader.load("/res/pics/15.png")

  isOpen = true
  const viewport: Viewport = new Viewport({
    x: 0,
    y: 0,
    height: window.innerHeight,
    width: window.innerWidth
  })
  renderer = new WebGLRenderer(webgl, viewport)
  beatLogoBox = new BeatLogoBox(webgl, {
    x: '-50w',
    y: '50h',
    width: '100w',
    height: '100h'
  })

  background = new Background(webgl, {
    x: '-50w',
    y: '50h',
    width: '100w',
    height: '100h'
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
  renderer.addDrawable(beatLogoBox)
  draw()
})

onUnmounted(() => {
  renderer.dispose()
})
let prevTimestamp = -1
function draw(timestamp: number = 0) {

  requestAnimationFrame(draw)
  if (prevTimestamp < 0) {
    prevTimestamp = timestamp
  }
  const elapsed = timestamp - prevTimestamp
  prevTimestamp = timestamp

  const time = player.currentTime

  Time.currentTime = timestamp
  Time.elapsed = elapsed

  BeatState.isKiai = beater.isKiai(time)
  BeatState.beatIndex = beater.getBeatCount() + 1
  BeatState.currentBeat = beater.beat(time, easeOut, easeOutQuint)
  BeatState.beat = beater
  BeatState.currentRMS = (player.isPlaying.value) ? calcRMS(
      audioData.sampleRate,
      audioData.leftChannel,
      audioData.rightChannel,
      time,
      beater.isAvailable ? 1024 : 2048
  ) : 0
  BeatState.nextBeatRMS = (player.isPlaying.value) ? calcRMS(
      audioData.sampleRate,
      audioData.leftChannel,
      audioData.rightChannel,
      (beater.getBeatCount() + 1) * beater.getGap() + beater.getOffset(),
      1024
  ) : 0

  const transX = (mouseX.value - window.innerWidth / 2)
  const transY = (window.innerHeight / 2 - mouseY.value)

  beatLogoBox.translate = new Vector2(-transX * 0.01, -transY * 0.01)

  background.translate = new Vector2(transX, transY)
  renderer.render()
}

function resizeCanvas() {
  if (canvas.value) {
    canvas.value.height = window.innerHeight
    canvas.value.width = window.innerWidth
  }
}
</script>

<style scoped>

</style>