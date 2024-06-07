<template>
  <div
    class="fill-size flex justify-center relative overflow-hidden"
    @drop="handleDrop"
    @dragenter="handleDrop"
    @dragleave="handleDrop"
    @dragover="handleDrop"
  >
    <Visualizer2 class="absolute"/>
<!--    <Transition name="top-bar">-->
<!--      <TopBar-->
<!--        style="position: absolute; top: 0"-->
<!--        :stateText="stateText"-->
<!--        @settingsClick="VueUI.settings = !VueUI.settings"-->
<!--        @bpmCalcClick="ui.bpmCalculator = !ui.bpmCalculator"-->
<!--        @beatmapListClick="VueUI.selectBeatmapDirectory = !VueUI.selectBeatmapDirectory"-->
<!--        @notifyClick="VueUI.notification = !VueUI.notification"-->
<!--        @hideUI="hideUI()"-->
<!--        v-show="ui.showUI"-->
<!--      />-->
<!--    </Transition>-->
    <Transition name="mask">
      <div class="max-size mask absolute" v-if="hasSomeUIShow" @click="closeAll()"></div>
    </Transition>
    <VolumeAdjuster class="absolute right-0 bottom-0"/>
    
    <Transition name="list">
      <Playlist class="absolute right-0" v-if="ui.list"/>
    </Transition>
    
    <Transition name="settings">
      <SettingsPanel
        v-if="VueUI.settings"
        class="absolute left-0"
      />
    </Transition>
    <SideButton
      @sideClick="ui.screenSelector = true"
    />
    <Transition name="settings">
      <ScreenSelector
        v-if="ui.screenSelector"
        @close="ui.screenSelector = false"
      />
    </Transition>
    
    <Transition name="player">
      <MiniPlayer v-if="VueUI.miniPlayer" style="position: absolute; top: var(--top-bar-height); right: 80px"/>
    </Transition>
    <Transition name="list">
      <Notification v-if="VueUI.notification" class="absolute right-0"/>
    </Transition>
    <BpmCalculator
      v-if="ui.bpmCalculator"
      class="absolute"
      @close="ui.bpmCalculator = false"
    />
    <Transition name="popup">
      <OSUBeatmapList class="absolute" v-if="VueUI.selectBeatmapDirectory" @close="VueUI.selectBeatmapDirectory = false"/>
    </Transition>
    <FloatNotification v-if="!VueUI.notification" class="absolute right-0"/>
    <Toast class="absolute" style="position: absolute"/>
    <DevelopTip class="absolute right-0 bottom-0"/>
  </div>
</template>
<script setup lang="ts">

import {computed, onMounted, provide, reactive, ref, watch} from 'vue';
import '../public/Material_Icon/material-icons.css';
import BpmCalculator from "./components/BpmCalculator.vue";
import DevelopTip from "./components/DevelopTip.vue";
import MiniPlayer from "./components/MiniPlayer.vue";
import Playlist from "./components/Playlist.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import Toast from "./components/Toast.vue";
import Visualizer2 from "./components/Visualizer2.vue";
import VolumeAdjuster from "./components/VolumeAdjuster.vue";
import AudioPlayerV2 from "./ts/player/AudioPlayer";
import {Toaster} from "./ts/global/Toaster";
import {scope, useKeyboard} from './ts/Utils';
import OSUPlayer from "./ts/player/OSUPlayer";
import PlayManager from "./ts/player/PlayManager";
import {PlayerState} from "./ts/player/PlayerState";
import {loadOSZ} from './ts/osu/OSZ';
import OSUBeatmapList from './components/OSUBeatmapList.vue';
import {onEnterMenu, onLeftSide, onRightSide, VueUI} from './ts/global/GlobalState';
import ScreenManager from "./ts/webgl/util/ScreenManager";
import {useCollect} from "./ts/util/use";
import {PLAYER} from "./ts/build";
import TempOSUPlayManager from "./ts/player/TempOSUPlayManager";
import Notification from "./components/notification/NotificationPanel.vue";
import {notifyMessage} from "./ts/notify/OsuNotification";
import FloatNotification from "./components/notification/FloatNotification.vue";
import {playSound, Sound} from "./ts/player/SoundEffect";
import {collect, collectLatest} from "./ts/util/eventRef";
import ScreenSelector from "./components/ScreenSelector.vue";
import SideButton from "./components/SideButton.vue";
import {MouseEventFire} from "./ts/webgl/event/MouseEventFire";

const ui = reactive({
  list: false,
  bpmCalculator: false,
  showUI: false,
  screenSelector: false
})
const screenId = ref("main")
useCollect(ScreenManager.currentId, id => {
  screenId.value = id
  if (id === 'main') {
    ui.showUI = false
  }
})

provide("openList", () => {
  ui.list = true
})

provide("openMiniPlayer", () => {
  VueUI.miniPlayer = true
})

watch(() => VueUI.settings, value => {
  if (value) {
    playSound(Sound.OverlayBigPopIn)
  } else {
    playSound(Sound.OverlayBigPopOut)
  }
  onLeftSide.emit(value)
})
watch(() => VueUI.notification, value => {
  if (value) {
    playSound(Sound.OverlayBigPopIn)
  } else {
    playSound(Sound.OverlayBigPopOut)
  }
  onRightSide.emit(value)
})
watch(() => VueUI.miniPlayer, value => playSound(value ? Sound.NowPlayingPopIn : Sound.NowPlayingPopOut))
watch(() => VueUI.selectBeatmapDirectory, value => playSound(value ? Sound.WavePopIn : Sound.WavePopOut))
useKeyboard('up', (evt) => {
  if (evt.code === 'KeyO') {
    ui.showUI = true
  }
  if (evt.code === 'Escape') {
    ui.showUI = false
  }
  if (evt.code === 'KeyP') {
    OSUPlayer.stop()
    Toaster.show("停止")
  }
  if (evt.code === 'KeyM') {
    VueUI.miniPlayer = !VueUI.miniPlayer
  }
  if (ui.bpmCalculator) {
    return
  }
  if (evt.code === 'ArrowRight') {
    nextSong()
    Toaster.show("下一曲")
  } else if (evt.code === 'ArrowLeft') {
    prevSong()
    Toaster.show("上一曲")
  } else if (evt.code === 'Space') {
    play()
  }
})

onEnterMenu.collect((value) => {
  ui.showUI = value
})

const hasSomeUIShow = computed(() => ui.list || VueUI.settings || VueUI.miniPlayer || VueUI.selectBeatmapDirectory || VueUI.notification || ui.screenSelector)

watch(hasSomeUIShow, (value) => {
  if (value) {
    MouseEventFire.pause()
  } else {
    MouseEventFire.resume()
  }
}, { immediate: true })

function closeAll() {
  VueUI.settings = false
  ui.list = false
  VueUI.miniPlayer = false
  VueUI.selectBeatmapDirectory = false
  VueUI.notification = false
}

const stateText = ref("")
// const collector = () => PLAYER && nextSong()

// watch(() => ui.bpmCalculator, (value) => {
//   if (value)
//     AudioPlayerV2.onEnd.removeCollect(collector)
//   else
//     AudioPlayerV2.onEnd.collect(collector)
// })

collect(AudioPlayerV2.onEnd, () => {
  const isBpmCalculatorOpen = ui.bpmCalculator
  if (isBpmCalculatorOpen) {
    return
  }
  PLAYER && nextSong()
})

// AudioPlayerV2.onEnd.collect(collector)
collectLatest(AudioPlayerV2.playState, stateCode => {
  stateText.value = {
    [PlayerState.STATE_DOWNLOADING]: '正在下载',
    [PlayerState.STATE_DECODING]: '正在解码',
    [PlayerState.STATE_PLAYING]: '正在播放',
    [PlayerState.STATE_DECODE_DONE]: '准备就绪',
    [PlayerState.STATE_PAUSING]: '播放暂停'
  }[stateCode] ?? ""
})

onMounted(() => init())
notifyMessage("Welcome!")

async function init() {
  if (PLAYER) {
    await PlayManager.loadMusicList()
    await PlayManager.playAt(0)
    OSUPlayer.pause()
  }
}

function play() {
  scope(OSUPlayer, function () {
    if (this.isPlaying()) {
      this.pause()
      Toaster.show("暂停")
    } else {
      this.play()
      Toaster.show("播放")
    }
  })
  
}

function nextSong() {
  if (PLAYER)
    PlayManager.next()
  else
    TempOSUPlayManager.next()
}

function prevSong() {
  if (PLAYER)
    PlayManager.previous()
  else
    TempOSUPlayManager.prev()
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  if (e.type === "dragenter") {
  } else if (e.type === "dragleave") {
  } else if (e.type === "drop") {
    handleFile(e)
  }
}

function handleFile(e: DragEvent) {
  e.preventDefault()
  //@ts-ignore
  const files = e.dataTransfer.files
  if (files.length > 1) {
    return
  }
  notifyMessage("开始加载拖动的 osz 文件")
  loadOSZ(files.item(0)!)
}

</script>

<style scoped>
.list-enter-active,
.list-leave-active,
.mask-enter-active,
.mask-leave-active,
.settings-enter-active,
.settings-leave-active {
  transition: all 500ms cubic-bezier(0.16, 1, 0.3, 1)
}

.player-enter-active {
  transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.player-leave-active {
  transition: all 200ms ease-out;
}

.list-enter-from, .list-leave-to {
  transform: translateX(100%);
}

.list-enter-to, .list-leave-from {
  transform: translateX(0);
}

.settings-enter-from, .settings-leave-to {
  transform: translateX(-100%);
}

.settings-enter-to, .settings-leave-from {
  transform: translateX(0);
}

.player-enter-from, .player-leave-to {
  transform-origin: top center;
  opacity: 0;
  transform: scale(0.8);
}

.player-enter-to, .player-leave-from {
  transform-origin: top center;
  opacity: 1;
  transform: scale(1);
}

.mask-enter-from, .mask-leave-to {
  opacity: 0;
}

.mask-enter-to, .mask-leave-from {
  opacity: 1;
}

.mask {
  background-color: #00000080;
}

.top-bar-enter-from, .top-bar-leave-to {
  transform: translateY(-100%);
}

.top-bar-enter-to, .top-bar-leave-from {
  transform: translateY(0);
}

.top-bar-enter-active, .top-bar-leave-active {
  transition-property: transform;
  transition-duration: 500ms;
  transition-delay: 300ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
.top-bar-leave-active {
  transition-delay: 0s;
}

.popup-enter-active, .popup-leave-active {
  transition: all .5s ease;
}
.popup-enter-from, .popup-leave-to {
  transform: translateY(100%);
}
.popup-enter-to, .popup-leave-from {
  transform: translateY(0);
}

@keyframes player-enter-animation {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  
  16% {
    opacity: 1;
    transform: scale(1.06);
  }
  
  28% {
    opacity: 0.87;
    transform: scale(0.97);
  }
  
  44% {
    opacity: 1;
    transform: scale(1);
  }
  
  59% {
    opacity: 0.98;
    transform: scale(0.99);
  }
  
  73% {
    opacity: 1;
    transform: scale(1);
  }
  
  88% {
    opacity: 1;
    transform: scale(0.99);
  }
  
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes player-leave-animation {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
