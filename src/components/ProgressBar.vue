<template>
  <div class="progress-box" @mousedown="changeProgress" ref="progressBar">
    <div class="progress-bg" :style="progress"></div>
  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, reactive, ref} from "vue";
import OSUPlayer from "../ts/player/OSUPlayer";

const state = reactive({
  width: 0
})
const progressBar = ref<HTMLDivElement | null>(null)

const duration = OSUPlayer.duration
const current = OSUPlayer.currentTime

const progress = computed(() => {
  return `width: ${current.value / duration.value * state.width}px`
})

const changeProgress = (ev: MouseEvent) => {
  const progress = ev.offsetX / state.width
  OSUPlayer.seek(duration.value * progress)
  // state.current = player.currentTime()
}
// useEvent({
//   onSongChanged(id: number) {
//     state.duration = player.duration.value
//     state.current = player.currentTime
//   }
// })

onMounted(() => {
  if (progressBar.value) {
    state.width = progressBar.value.clientWidth
  }
})


</script>

<style scoped>
.progress-box {
  width: 100%;
  height: 8px;
  cursor: pointer;
}
.progress-bg {
  height: 8px;
  background-color: yellow;
}
</style>