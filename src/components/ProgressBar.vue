<template>
  <div class="progress-box" @mousedown="changeProgress" ref="progressBar">
    <div class="progress-bg" :style="progress"></div>
  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, onUnmounted, reactive, ref} from "vue";
import {AudioPlayerV2} from "../ts/AudioPlayerV2";
import {useEvent} from "../ts/EventBus";

const state = reactive({
  current: 0,
  duration: 0,
  width: 0
})
let intervalId: any
const player = AudioPlayerV2.instance
const progressBar = ref<HTMLDivElement | null>(null)

const progress = computed(() => {
  return `width: ${state.current / player.duration.value * state.width}px`
})

const changeProgress = (ev: MouseEvent) => {
  const progress = ev.offsetX / state.width
  player.seek(player.duration.value * progress)
  state.current = player.currentTime
}

useEvent({
  onSongChanged(id: number) {
    state.duration = player.duration.value
    state.current = player.currentTime
  }
})

onMounted(() => {
  if (progressBar.value) {
    state.width = progressBar.value.clientWidth
  }
  state.current = player.currentTime
  state.duration = player.duration.value
  intervalId = setInterval(() => {
    state.current = player.currentTime
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
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