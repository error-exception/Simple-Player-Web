<template>
  <div class="progress-box" @mousedown="changeProgress">
    <div class="progress-bg" :style="progress"></div>
    <div class="progress-thumb" :style="thumb"></div>
  </div>
</template>

<script setup lang="ts">

import {computed, reactive} from "vue";
import {AudioPlayerV2} from "../ts/AudioPlayerV2";

const state = reactive({
  current: 0,
  duration: 0
})

const player = AudioPlayerV2.instance

// player.onTimeupdate(() => {
//   state.current = player.currentTime
// })
const progress = computed(() => {
  return `width: ${state.current / player.duration.value * 300}px`
})

const thumb = computed(() => {
  return `transform: translateX(${state.current / player.duration.value * 300}px)`
})

const changeProgress = (ev: MouseEvent) => {
  const progress = ev.offsetX / 300
  player.seek(player.duration.value * progress)
}

</script>

<style scoped>
.progress-box {
  width: 300px;
  height: 4px;
  position: relative;
  background-color: #ffffff80;
}
.progress-thumb {
  height: 8px;
  width: 8px;
  position: absolute;
  border-radius: 50%;
  background-color: white;
  top: -2px;
}
.progress-bg {
  height: 4px;
  background-color: white;
}
</style>