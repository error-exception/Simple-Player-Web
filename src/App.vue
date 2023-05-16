
<template>
  <div class="fill-size" style="position: relative; overflow: hidden">
    <Visualizer2 style="position: absolute"/>
    <FPSCounter
        :frame-time="16"
        style="position: absolute; left: 4px; bottom: 4px"
    />
    <TopBar
        style="position: absolute; top: 0"
        :stateText = "state.stateText"
        @settingsClick="state.settingsState = !state.settingsState"
        @bpmCalcClick="state.bpmCalculatorState = !state.bpmCalculatorState"
        @hideUI="hideUI()"
        v-show="state.showUI"
    />
    <Transition name="mask">
      <div style="position: absolute" class="max-size mask" v-if="hasSomeUIShow" @click="closeAll()"></div>
    </Transition>
    <VolumeAdjuster style="position: absolute; right: 0; bottom: 0"/>

    <Transition name="list">
      <Playlist style="position: absolute; right: 0" v-if="state.listState"/>
    </Transition>

    <Transition name="settings">
      <SettingsPanel
          v-if="state.settingsState"
          style="position: absolute; left: 0"
      />
    </Transition>

    <Transition name="player">
      <MiniPlayer v-if="state.miniPlayerState" style="position: absolute; top: 48px; right: 80px"/>
    </Transition>
    <BpmCalculator style="position: absolute" v-if="state.bpmCalculatorState" @close="state.bpmCalculatorState = false"/>
    <Toast style="position: absolute"/>

    <DevelopTip style="position: absolute; right: 0; bottom: 0"/>
  </div>
</template>
<script setup lang="ts">

import '../public/Material_Icon/material-icons.css'
import Playlist from "./components/Playlist.vue";
import {computed, onMounted, provide, reactive, watch} from "vue";
import {fetchJson, url, useKeyboard} from "./ts/Utils";
import {useStore} from "vuex";
import TopBar from "./components/TopBar.vue";
import BpmCalculator from "./components/BpmCalculator.vue";
import Visualizer2 from "./components/Visualizer2.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import MiniPlayer from "./components/MiniPlayer.vue";
import VolumeAdjuster from "./components/VolumeAdjuster.vue";
import {AudioPlayerV2} from "./ts/AudioPlayerV2";
import {ResponseResult} from "./ts/type";
import {fetchAndInitAllTiming} from "./ts/TimingInfo";
import DevelopTip from "./components/DevelopTip.vue";
import Toast from "./components/Toast.vue";
import {Toaster} from "./ts/Toaster";
import FPSCounter from "./components/FPSCounter.vue";

const state = reactive({
  listState: false,
  settingsState: false,
  bpmCalculatorState: false,
  showUI: true,
  miniPlayerState: false,
  stateText: ""
})

const store = useStore()

provide("openList", () => {
  state.listState = true
})

provide("openMiniPlayer", () => {
  state.miniPlayerState = true
})

provide<{
  nextSong: () => void,
  play: () => void,
  prevSong: () => void
}>("playerControl", {
  nextSong, play, prevSong
})

useKeyboard('up', (evt) => {
  if (evt.code === 'KeyO') {
    state.showUI = true
  }
  if (state.bpmCalculatorState) {
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

const hasSomeUIShow = computed(() => state.listState || state.settingsState || state.miniPlayerState)

watch(() => state.bpmCalculatorState, (value) => {
  AudioPlayerV2.instance.onEnded = value ? null : () => {
    nextSong()
  }
})

AudioPlayerV2.instance.onState = (stateCode: number) => {
  if (stateCode === AudioPlayerV2.STATE_DOWNLOADING) {
    state.stateText = "正在下载"
  } else if (stateCode === AudioPlayerV2.STATE_DECODING) {
    state.stateText = "正在解码"
  } else if (stateCode === AudioPlayerV2.STATE_PLAYING) {
    state.stateText = "正在播放"
  } else if (stateCode === AudioPlayerV2.STATE_DECODE_DONE) {
    state.stateText = "准备就绪"
  } else if (stateCode === AudioPlayerV2.STATE_PAUSING) {
    state.stateText = "播放暂停"
  }
}

onMounted(async () => {

  await fetchAndInitAllTiming()

  const obj: ResponseResult = await fetchJson(url('/musicList'))
  console.log(obj)
  store.commit("setMusicList", obj.data)
  store.commit('setMusic', store.state.musicList[store.state.currentIndex])
  AudioPlayerV2.instance.src(store.state.currentMusic)
})

function hideUI() {
  state.showUI = false
  Toaster.show(`按“O“显示 `)
}

function closeAll() {
  state.settingsState = false
  state.listState = false
  state.miniPlayerState = false
}


function play() {
  if (AudioPlayerV2.instance.isPlaying.value) {
    AudioPlayerV2.instance.pause()
    Toaster.show("暂停")
  } else {
    AudioPlayerV2.instance.play()
    Toaster.show("播放")
  }
}

function nextSong() {
  const songCount = store.state.musicList.length;
  let newIndex = store.state.currentIndex + 1
  if (newIndex >= songCount) {
    newIndex = 0
  }
  store.commit("setIndex", newIndex)
  const music = store.state.currentMusic;
  AudioPlayerV2.instance.src(music)
  AudioPlayerV2.instance.play()
}

function prevSong() {
  const songCount = store.state.musicList.length;
  let newIndex = store.state.currentIndex - 1
  if (newIndex < 0) {
    newIndex = songCount - 1
  }
  store.commit("setIndex", newIndex)
  const music = store.state.currentMusic;
  AudioPlayerV2.instance.src(music)
  AudioPlayerV2.instance.play()
}

AudioPlayerV2.instance.onEnded = () => {
  nextSong()
}

</script>

<style scoped>
.list-enter-active,
.list-leave-active,
.mask-enter-active,
.mask-leave-active,
.settings-enter-active,
.settings-leave-active
{
  transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1)
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
