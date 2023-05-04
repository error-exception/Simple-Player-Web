
<template>
  <div class="fill-size" style="position: relative; background-color: white; overflow: hidden">
<!--    <SideBars style="position: absolute" v-show="whiteBar"/>-->
    <Visualizer2 style="position: absolute"/>
    <TopBar
        style="position: absolute; top: 0"
        @settingsClick="state.settingsState = !state.settingsState"
        @bpmCalcClick="state.bpmCalculatorState = !state.bpmCalculatorState"
        @hideUI="state.showUI = false"
        v-show="state.showUI"
    />
<!--    <BottomBar :ui="state" style="position: absolute; bottom: 0" v-show="state.showUI"/>-->
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
  </div>
</template>
<script setup lang="ts">

import '../public/Material_Icon/material-icons.css'
import Playlist from "./components/Playlist.vue";
import {computed, provide, reactive} from "vue";
import {fetchJson, useKeyboard} from "./ts/Utils";
import {useStore} from "vuex";
import {AudioPlayer} from "./ts/AudioPlayer";
import TopBar from "./components/TopBar.vue";
import BpmCalculator from "./components/BpmCalculator.vue";
import Visualizer2 from "./components/Visualizer2.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import MiniPlayer from "./components/MiniPlayer.vue";
import VolumeAdjuster from "./components/VolumeAdjuster.vue";
import {launchVisualizer} from "./ts/Visualizer";
import {AudioPlayerV2} from "./ts/AudioPlayerV2";

const state = reactive({
  listState: false,
  settingsState: false,
  bpmCalculatorState: false,
  showUI: true,
  miniPlayerState: false,
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
  } else if (evt.code === 'ArrowLeft') {
    prevSong()
  } else if (evt.code === 'Space') {
    play()
  }
})

const hasSomeUIShow = computed(() => state.listState || state.settingsState || state.miniPlayerState)

function openBpmCalculator() {
  state.bpmCalculatorState = true
  AudioPlayerV2.instance.onEnded = null
}
function closeBpmCalculator() {
  state.bpmCalculatorState = false
  AudioPlayerV2.instance.onEnded = () => {
    nextSong()
  }
}

function closeAll() {
  state.settingsState = false
  state.listState = false
  state.miniPlayerState = false
}

fetchJson('/api/musicList').then((obj) => {
  console.log(obj)
  store.commit("setMusicList", obj.data)
  store.commit('setMusic', store.state.musicList[store.state.currentIndex])
  AudioPlayerV2.instance.src(store.state.currentMusic)
})
function play() {
  if (AudioPlayerV2.instance.isPlaying.value) {
    AudioPlayerV2.instance.pause()
  } else {
    AudioPlayerV2.instance.play()
  }
  launchVisualizer(store)
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
  launchVisualizer(store)
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
  launchVisualizer(store)
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
.settings-leave-active,
.player-enter-active,
.player-leave-active
{
  transition: all 260ms cubic-bezier(0, 0.22, 0, 0.98)
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
  transform: scale(0);
}
.player-enter-to, .player-leave-from {
  transform-origin: top center;
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
</style>
