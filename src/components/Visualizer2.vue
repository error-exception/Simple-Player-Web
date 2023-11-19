<template>
  <div class="fill-size" style="pointer-events: none">
    <canvas style="width: 100vw; height: 100vh" ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import BackgroundLoader from "../ts/global/BackgroundLoader";
import BeatBooster from "../ts/global/BeatBooster";
import {BeatState} from "../ts/global/Beater";
import {MOUSE_KEY_LEFT, MOUSE_KEY_NONE, MOUSE_KEY_RIGHT, MouseState} from "../ts/global/MouseState";
import {Time} from "../ts/global/Time";
import AudioPlayerV2 from "../ts/player/AudioPlayer";
import OSUPlayer from "../ts/player/OSUPlayer";
import {easeOut, easeOutQuint} from "../ts/util/Easing";
import {MainScreen} from "../ts/webgl/screen/main/MainScreen";
import ScreenManager from "../ts/webgl/util/ScreenManager";
import ShaderManager from "../ts/webgl/util/ShaderManager";
import {WebGLRenderer} from "../ts/webgl/WebGLRenderer";
import Coordinate from '../ts/webgl/base/Coordinate'
import {SongPlayScreen} from "../ts/webgl/screen/songPlay/SongPlayScreen";
import {ManiaScreen} from '../ts/webgl/screen/mania/ManiaScreen';
import {BackgroundScreen} from "../ts/webgl/screen/background/BackgroundScreen";
import {runTask} from "../ts/notify/OsuNotification";
import {Icon} from "../ts/icon/Icon";
import {loadSoundEffect} from "../ts/player/SoundEffect";
import {TestScreen} from "../ts/webgl/screen/test/TestScreen";
import {loadImage} from "../ts/webgl/util/ImageResource";
import {LegacyScreen} from "../ts/webgl/screen/legacy/LegacyScreen";
import AudioChannel from "../ts/player/AudioChannel";

const canvas = ref<HTMLCanvasElement | null>(null)
let renderer: WebGLRenderer

const player = AudioPlayerV2

const audioData = {
  sampleRate: 0,
  leftChannel: new Float32Array(0),
  rightChannel: new Float32Array(0)
}

OSUPlayer.onChanged.collect(() => {
  const audioBuffer = player.getAudioBuffer();
  audioData.sampleRate = audioBuffer.sampleRate
  if (audioBuffer.numberOfChannels < 2) {
    audioData.leftChannel = audioBuffer.getChannelData(0)
    audioData.rightChannel = audioData.leftChannel
  } else {
    audioData.leftChannel = audioBuffer.getChannelData(0)
    audioData.rightChannel = audioBuffer.getChannelData(1)
  }
})

const mouseListener = {
  mousedown(e: MouseEvent) {
    const x = (e.x - window.innerWidth / 2) //* window.devicePixelRatio
    const y = (window.innerHeight / 2 - e.y)//* window.devicePixelRatio
    let which: number = MOUSE_KEY_NONE
    if (e.button === 0)
      which = MOUSE_KEY_LEFT
    if (e.button === 2)
      which = MOUSE_KEY_RIGHT
    if (which !== MOUSE_KEY_NONE)
      MouseState.receiveMouseDown(which, x, y)
  },
  mouseup(e: MouseEvent) {
    const x = (e.x - window.innerWidth / 2)
    const y = (window.innerHeight / 2 - e.y)
    let which: number = MOUSE_KEY_NONE
    if (e.button === 0)
      which = MOUSE_KEY_LEFT
    if (e.button === 2)
      which = MOUSE_KEY_RIGHT
    if (which !== MOUSE_KEY_NONE)
      MouseState.receiveMouseUp(which, x, y)
  },
  mousemove(e: MouseEvent) {
    const x = (e.x - window.innerWidth / 2)
    const y = (window.innerHeight / 2 - e.y)
    
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
  await runTask("Downloading images...", async task => {
    task.progress.value = 0
    await loadImage()
    task.progress.value = .5
    await BackgroundLoader.init()
    task.progress.value = 1
    task.finish("Images downloaded", Icon.Check)
  }, true)
  await loadSoundEffect()
  ShaderManager.init(webgl)
  renderer = new WebGLRenderer(webgl)
  window.onresize = () => {
    resizeCanvas()
  }
  renderer.addDrawable(new BackgroundScreen(webgl))
  ScreenManager.init(renderer)
  ScreenManager.addScreen("main", () => {
    return new MainScreen(webgl)
  })
  ScreenManager.addScreen("second", () => {
    return new SongPlayScreen(webgl)
  })
  ScreenManager.addScreen('mania', () => {
    return new ManiaScreen(webgl)
  })
  ScreenManager.addScreen('test', () => {
    return new TestScreen(webgl)
  })
  ScreenManager.addScreen('legacy', () => {
    return new LegacyScreen(webgl)
  })
  // debugger
  ScreenManager.activeScreen("main")
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
  
  OSUPlayer.update()
  const time = player.currentTime()
  
  Time.currentTime = timestamp
  Time.elapsed = elapsed
  
  AudioChannel.update(time)
  
  BeatState.isKiai = BeatBooster.isKiai(time)
  BeatState.beatIndex = BeatBooster.getCurrentBeatCount() + 1
  BeatState.currentBeat = BeatBooster.updateBeat(time, easeOut, easeOutQuint)
  BeatState.isAvailable = BeatBooster.isAvailable
  // BeatState.currentRMS = (player.isPlaying()) ? calcRMS(
  //   audioData.sampleRate,
  //   audioData.leftChannel,
  //   audioData.rightChannel,
  //   time,
  //   BeatBooster.isAvailable ? 800 : 2048
  // ) : 0
  
  // BeatState.nextBeatRMS = (player.isPlaying()) ? calcRMS(
  //   audioData.sampleRate,
  //   audioData.leftChannel,
  //   audioData.rightChannel,
  //   (BeatBooster.getCurrentBeatCount() + 1) * BeatBooster.getGap() + BeatBooster.getOffset(),
  //   1024
  // ) : 0
  renderer.render()
}

function resizeCanvas() {
  if (canvas.value) {
    canvas.value.height = canvas.value.clientHeight * window.devicePixelRatio
    canvas.value.width = canvas.value.clientWidth * window.devicePixelRatio
    
    Coordinate.updateCoordinate(
      canvas.value.clientWidth,
      canvas.value.clientHeight
    )
  }
}
</script>