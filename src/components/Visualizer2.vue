<template>
    <div class="fill-size" style="pointer-events: none">
        <canvas style="width: 100vw; height: 100vh" ref="canvas"></canvas>
    </div>
</template>

<script setup lang="ts">

import { onMounted, onUnmounted, ref } from "vue";
import backIcon from '../assets/back_white_48.png';
import legacyLogo from '../assets/legacy_logo.png';
import logoImg from '../assets/logo.png';
import rippleImg from '../assets/ripple.png';
import rippleNew from '../assets/ripple_new.png';
import BackgroundLoader from "../ts/BackgroundLoader";
import BeatBooster from "../ts/BeatBooster";
import { BeatState } from "../ts/Beater";
import { ImageLoader } from "../ts/ImageResources";
import { MOUSE_KEY_LEFT, MOUSE_KEY_NONE, MOUSE_KEY_RIGHT, MouseState } from "../ts/MouseState";
import { Time } from "../ts/Time";
import { calcRMS } from "../ts/Utils";
import AudioPlayerV2 from "../ts/player/AudioPlayer";
import OSUPlayer from "../ts/player/OSUPlayer";
import { easeOut, easeOutQuint } from "../ts/util/Easing";
import { MainScreen } from "../ts/webgl/MainScreen";
import ScreenManager from "../ts/webgl/ScreenManager";
import ShaderManager from "../ts/webgl/ShaderManager";
import { Viewport } from "../ts/webgl/Viewport";
import { WebGLRenderer } from "../ts/webgl/WebGLRenderer";
import { TestScreen } from '../ts/webgl/TestScreen';
import Coordinate from '../ts/webgl/Coordinate'
import { SongPlayScreen } from "../ts/webgl/songPlay/SongPlayScreen";
import { ManiaScreen } from '../ts/webgl/mania/ManiaScreen';
import { StdScreen } from "../ts/webgl/std/StdScreen";
import approachCircle from '../assets/approachcircle.png'
import stdNoteCircle from '../assets/hitcircleoverlay.png'

const canvas = ref<HTMLCanvasElement | null>(null)
let isOpen = false
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
        const x = (e.x - window.innerWidth / 2)// * window.devicePixelRatio
        const y = (window.innerHeight / 2 - e.y)// * window.devicePixelRatio
        let which: number = MOUSE_KEY_NONE
        if (e.button === 0)
            which = MOUSE_KEY_LEFT
        if (e.button === 2)
            which = MOUSE_KEY_RIGHT
        if (which !== MOUSE_KEY_NONE)
            MouseState.receiveMouseUp(which, x, y)
    },
    mousemove(e: MouseEvent) {
        const x = (e.x - window.innerWidth / 2)// * window.devicePixelRatio
        const y = (window.innerHeight / 2 - e.y)// * window.devicePixelRatio
        
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
    await ImageLoader.load(rippleNew, "ripple")
    await ImageLoader.load(legacyLogo, "legacyLogo")
    await ImageLoader.load(backIcon, 'backIcon')
    await ImageLoader.load(stdNoteCircle, "stdNoteCircle")
    await ImageLoader.load(approachCircle, "approachCircle")
    await BackgroundLoader.init()
    isOpen = true
    // const viewport: Viewport = new Viewport({
    //     x: 0,
    //     y: 0,
    //     width: c.clientWidth * window.devicePixelRatio,
    //     height: c.clientHeight * window.devicePixelRatio
    // })
    ShaderManager.init(webgl)
    renderer = new WebGLRenderer(webgl)
    window.onresize = () => {
        resizeCanvas()

        // renderer.setViewport(new Viewport({
        //     x: 0,
        //     y: 0,
        //     width: c.clientWidth * window.devicePixelRatio,
        //     height: c.clientHeight * window.devicePixelRatio
        // }))
        
    }
    ScreenManager.init(renderer)
    ScreenManager.addScreen("main", () => {
        return new MainScreen(webgl)
    })
    // ScreenManager.addScreen("test", () => {
    //     return new TestScreen(webgl)
    // })
    ScreenManager.addScreen("second", () => {
        return new SongPlayScreen(webgl)
    })
    ScreenManager.addScreen('mania', () => {
        return new ManiaScreen(webgl)
    })
    // ScreenManager.addScreen('std', () => {
    //     return new StdScreen(webgl)
    // })
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
    // store.commit('setFrameTime', Time.elapsed)
    
    BeatState.isKiai = BeatBooster.isKiai(time) //beater.isKiai(time)
    BeatState.beatIndex = BeatBooster.getCurrentBeatCount() + 1 //beater.getBeatCount() + 1
    BeatState.currentBeat = BeatBooster.updateBeat(time, easeOut, easeOutQuint)//beater.beat(time, easeOut, easeOutQuint)
    // BeatState.beat = beater
    BeatState.isAvailable = BeatBooster.isAvailable
    BeatState.currentRMS = (player.isPlaying()) ? calcRMS(
        audioData.sampleRate,
        audioData.leftChannel,
        audioData.rightChannel,
        time,
        BeatBooster.isAvailable ? 1024 : 2048
    ) : 0
    // console.log("rms", BeatState.currentRMS);
    
    BeatState.nextBeatRMS = (player.isPlaying()) ? calcRMS(
        audioData.sampleRate,
        audioData.leftChannel,
        audioData.rightChannel,
        (BeatBooster.getCurrentBeatCount() + 1) * BeatBooster.getGap() + BeatBooster.getOffset(),
        1024
    ) : 0
    // debugger
    renderer.render()
}

function resizeCanvas() {
    if (canvas.value) {
        canvas.value.height = canvas.value.clientHeight * window.devicePixelRatio
        canvas.value.width = canvas.value.clientWidth * window.devicePixelRatio
        console.log(canvas.value.clientWidth, canvas.value.clientHeight);
        
        Coordinate.updateCoordinate(
            canvas.value.clientWidth,// * window.devicePixelRatio,
            canvas.value.clientHeight// * window.devicePixelRatio
        )
        console.log("canvas", canvas.value.width, canvas.value.height);
        
    }
}
</script>

<style scoped>

</style>