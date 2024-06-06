<template>
  <div class="fill-size" style="pointer-events: none;">
    <canvas style="width: 100vw; height: 100vh;" ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
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
import {BackgroundScreen} from "../ts/webgl/screen/background/BackgroundScreen";
import {runTask} from "../ts/notify/OsuNotification";
import {Icon} from "../ts/icon/Icon";
import {loadSoundEffect} from "../ts/player/SoundEffect";
import {TestScreen} from "../ts/webgl/screen/test/TestScreen";
import {Images, loadImage} from "../ts/webgl/util/ImageResource";
import {LegacyScreen} from "../ts/webgl/screen/legacy/LegacyScreen";
import AudioChannel from "../ts/player/AudioChannel";
import {StoryScreen} from "../ts/webgl/screen/story/StoryScreen";
import {useKeyboard} from "../ts/Utils";
import VideoPlayer from "../ts/player/VideoPlayer";
import type {Nullable} from "../ts/type";
import {LegacyPlayScreen} from "../ts/webgl/screen/legacyPlay/LegacyPlayScreen";
import {Shaders} from "../ts/webgl/shader/Shaders";
import BackgroundManager from "../ts/global/BackgroundManager";
import {Vector, Vector2} from "../ts/webgl/core/Vector2";
import {Buffers} from "../ts/webgl/buffer/Buffers";
import {TextureStore} from "../ts/webgl/texture/TextureStore";
import {genTexture} from "../ts/webgl/util/GenTexture";
import QuadIndexBuffer from "../ts/webgl/buffer/QuadIndexBuffer";
import iconsAtlas from '../assets/icons.altas?raw'

const canvas = ref<HTMLCanvasElement | null>(null)
let renderer: WebGLRenderer

const player = AudioPlayerV2

// let viewportTransform: Matrix3 = Matrix3.newIdentify()
const mousePosition = Vector()

function handleMousePosition(position: Vector2) {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  const width = Coordinate.width
  const height = Coordinate.height
  const scaleX = width / windowWidth
  const scaleY = height / windowHeight
  position.x *= scaleX
  position.y *= scaleY
}

const mouseListener = {
  mousedown(e: MouseEvent) {
    // const x = (e.x - window.innerWidth / 2) //* window.devicePixelRatio
    // const y = (window.innerHeight / 2 - e.y)//* window.devicePixelRatio
    mousePosition.set(e.x, e.y)
    handleMousePosition(mousePosition)
    let which: number = MOUSE_KEY_NONE
    if (e.button === 0)
      which = MOUSE_KEY_LEFT
    if (e.button === 2)
      which = MOUSE_KEY_RIGHT
    if (which !== MOUSE_KEY_NONE)
      MouseState.receiveMouseDown(which, mousePosition.x, mousePosition.y)
  },
  mouseup(e: MouseEvent) {
    // const x = (e.x - window.innerWidth / 2)
    // const y = (window.innerHeight / 2 - e.y)
    mousePosition.set(e.x, e.y)
    handleMousePosition(mousePosition)
    let which: number = MOUSE_KEY_NONE
    if (e.button === 0)
      which = MOUSE_KEY_LEFT
    if (e.button === 2)
      which = MOUSE_KEY_RIGHT
    if (which !== MOUSE_KEY_NONE)
      MouseState.receiveMouseUp(which, mousePosition.x, mousePosition.y)
  },
  mousemove(e: MouseEvent) {
    // const x = (e.x - window.innerWidth / 2)
    // const y = (window.innerHeight / 2 - e.y)
    mousePosition.set(e.x, e.y)
    handleMousePosition(mousePosition)
    // console.log(mousePosition.x, mousePosition.y)
    MouseState.receiveMouseMove(mousePosition.x, mousePosition.y)
  }
}

onMounted(async () => {
  let backgroundScreen: Nullable<BackgroundScreen> = null
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // 让视频和音频尽量保持同步
      if (backgroundScreen?.isVideoVisible) {
        OSUPlayer.seek(AudioPlayerV2.currentTime())
      } else {
        VideoPlayer.seek(AudioPlayerV2.currentTime())
      }
    }
  })
  window.addEventListener("mousedown", mouseListener.mousedown)
  window.addEventListener("mouseup", mouseListener.mouseup)
  window.addEventListener("mousemove", mouseListener.mousemove)
  const c = canvas.value
  if (!c) return
  const webgl = c.getContext("webgl2", {
    alpha: false,
    premultipliedAlpha: false
  })
  if (!webgl) {
    return;
  }
  resizeCanvas()
  await runTask("Downloading images...", async task => {
    task.progress.value = 0
    await loadImage()
    task.progress.value = .5
    await BackgroundManager.changeLoader(BackgroundManager.Default)
    task.progress.value = 1
    task.finish("Images downloaded", Icon.Check)
  }, true)
  await loadSoundEffect()
  ShaderManager.init(webgl)
  renderer = new WebGLRenderer(webgl)
  Shaders.init(renderer)
  Buffers.init(renderer)
  for (const imagesKey in Images) {
    TextureStore.add(webgl, imagesKey, Images[imagesKey])
  }
  const gradiant = genTexture(webgl, Vector(40, 90), context => {
    context.beginPath()
    let canvasGradient = context.createLinearGradient(0, 0, 40, 0);
    canvasGradient.addColorStop(0, '#ffffff')
    canvasGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    context.fillStyle = canvasGradient
    context.fillRect(0, 0, 40, 90)
    context.fill()
  })
  TextureStore.addTexture('Gradiant', gradiant)
  const verticalGradiant = genTexture(webgl, Vector(90, 40), context => {
    context.beginPath()
    let canvasGradient = context.createLinearGradient(45, 0, 45, 40);
    canvasGradient.addColorStop(0, '#ffffff')
    canvasGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    context.fillStyle = canvasGradient
    context.fillRect(0, 0, 90, 40)
    context.fill()
  })
  TextureStore.addTexture('VerticalGradiant', verticalGradiant)
  await TextureStore.addTextureAtlas('Icons-Atlas', iconsAtlas, Images.Icons, false)
  window.onresize = () => {
    resizeCanvas()
  }
  backgroundScreen = new BackgroundScreen()
  renderer.addDrawable(backgroundScreen)
  ScreenManager.init(renderer)
  ScreenManager.addScreen("main", () => {
    return new MainScreen()
  })
  ScreenManager.addScreen("second", () => {
    return new SongPlayScreen()
  })
  ScreenManager.addScreen('test', () => {
    return new TestScreen()
  })
  ScreenManager.addScreen('legacy', () => {
    return new LegacyScreen()
  })
  ScreenManager.addScreen("story", () => {
    return new StoryScreen(webgl)
  })
  ScreenManager.addScreen("legacyPlay", () => {
    return new LegacyPlayScreen()
  })
  ScreenManager.activeScreen("main")
  renderer.onDispose = () => {
    Shaders.dispose()
    Buffers.dispose()
    TextureStore.dispose()
    QuadIndexBuffer.dispose()
  }
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

  renderer.render()
}

function resizeCanvas() {
  if (canvas.value) {
    canvas.value.height = canvas.value.clientHeight * window.devicePixelRatio
    canvas.value.width = canvas.value.clientWidth * window.devicePixelRatio
    const { clientWidth, clientHeight } = canvas.value
    Coordinate.updateCoordinate(clientWidth, clientHeight)
  }
}

useKeyboard("up", e => {
  if (e.code === "KeyF") {
    canvasFullscreen()
  }
})

function canvasFullscreen() {
  if (canvas.value) {
    canvas.value.requestFullscreen()
  }
}
</script>