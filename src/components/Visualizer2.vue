<template>
  <div class="fill-size" style="pointer-events: none">
    <canvas style="width: 100vw; height: 100vh" ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import {WebGLRenderer} from "../ts/webgl/WebGLRenderer";
import {Viewport} from "../ts/webgl/Viewport";
import {useStore} from "vuex";
import {useEvent} from "../ts/EventBus";
import {calcRMS, findMusic, useMouse} from "../ts/Utils";
import {Background} from "../ts/webgl/MovableBackground";
import {Beater, BeatState} from "../ts/Beater";
import {getBeater} from "../ts/TimingInfo";
import {AudioPlayerV2} from "../ts/AudioPlayerV2";
import {easeOut, easeOutQuint} from "../ts/util/Easing";
import {Time} from "../ts/Time";
import {Vector2} from "../ts/webgl/core/Vector2";
import {ImageLoader} from "../ts/ImageResources";

import logoImg from '../assets/logo.png'
import rippleImg from '../assets/ripple.png'
import {BeatLogoBox} from "../ts/webgl/BeatLogoBox";
import {BackgroundLoader} from "../ts/BackgroundLoader";
import {MOUSE_KEY_LEFT, MOUSE_KEY_NONE, MOUSE_KEY_RIGHT, MouseState} from "../ts/MouseState";
import {Flashlight} from "../ts/webgl/Flashlight";

const store = useStore()

const canvas = ref<HTMLCanvasElement | null>(null)
let isOpen = false
let renderer: WebGLRenderer
let background: Background
let beatLogoBox: BeatLogoBox
let flashlight: Flashlight

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

const mouseListener = {
  mousedown(e: MouseEvent) {
    const x = (e.x - window.innerWidth / 2) * window.devicePixelRatio
    const y = (window.innerHeight / 2 - e.y) * window.devicePixelRatio
    let which: number = MOUSE_KEY_NONE
    if (e.button === 0)
      which = MOUSE_KEY_LEFT
    if (e.button === 2)
      which = MOUSE_KEY_RIGHT
    if (which !== MOUSE_KEY_NONE)
      MouseState.receiveMouseDown(which, x, y)
  },
  mouseup(e: MouseEvent) {
    const x = (e.x - window.innerWidth / 2) * window.devicePixelRatio
    const y = (window.innerHeight / 2 - e.y) * window.devicePixelRatio
    let which: number = MOUSE_KEY_NONE
    if (e.button === 0)
      which = MOUSE_KEY_LEFT
    if (e.button === 2)
      which = MOUSE_KEY_RIGHT
    if (which !== MOUSE_KEY_NONE)
      MouseState.receiveMouseUp(which, x, y)
  },
  mousemove(e: MouseEvent) {
    const x = (e.x - window.innerWidth / 2) * window.devicePixelRatio
    const y = (window.innerHeight / 2 - e.y) * window.devicePixelRatio
    MouseState.receiveMouseMove(x, y)
  }
}

onMounted(async () => {
  window.addEventListener("mousedown", mouseListener.mousedown)
  window.addEventListener("mouseup", mouseListener.mouseup)
  window.addEventListener("mousemove", mouseListener.mousemove)
  const c = canvas.value
  if (!c) return
  const webgl = c.getContext("webgl2", {
    alpha: false
  })
  if (!webgl) {
    return;
  }
  resizeCanvas()

  await ImageLoader.load(logoImg, "logo")
  await ImageLoader.load(rippleImg, "ripple")
  await BackgroundLoader.init()

  isOpen = true
  const viewport: Viewport = new Viewport({
    x: 0,
    y: 0,
    width: c.clientWidth * window.devicePixelRatio,
    height: c.clientHeight * window.devicePixelRatio
  })
  renderer = new WebGLRenderer(webgl, viewport)
  beatLogoBox = new BeatLogoBox(webgl, {
    // x: '-50w',
    // y: '50h',
    // width: '100w',
    // height: '100h',
    width: 520,
    height: 520,
    horizontal: "center",
    vertical: "center"
  })

  background = new Background(webgl, {
    x: '-50w',
    y: '50h',
    width: '100w',
    height: '100h'
  })
  flashlight = new Flashlight(webgl, {
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
      width: c.clientWidth * window.devicePixelRatio,
      height: c.clientHeight * window.devicePixelRatio
    }))
  }
  renderer.addDrawable(background)
  renderer.addDrawable(flashlight)
  renderer.addDrawable(beatLogoBox)
  draw()
})

onUnmounted(() => {
  window.removeEventListener("mousedown", mouseListener.mousedown)
  window.removeEventListener("mouseup", mouseListener.mouseup)
  window.removeEventListener("mousemove", mouseListener.mousemove)
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
  store.commit('setFrameTime', Time.elapsed)

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

  // beatLogoBox.translate = new Vector2(-transX * 0.01, -transY * 0.01)

  background.translate = new Vector2(transX, transY)
  renderer.render()
}

function resizeCanvas() {
  if (canvas.value) {
    canvas.value.height = canvas.value.clientHeight * window.devicePixelRatio
    canvas.value.width = canvas.value.clientWidth * window.devicePixelRatio
  }
}
</script>

<style scoped>

</style>