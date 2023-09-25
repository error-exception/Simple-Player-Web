<template>
  <Column class="fps-counter-box">
    <span>{{ frame }} ms</span>
    <span>{{ fps }} FPS</span>
  </Column>
</template>

<script setup lang="ts">
import Column from "./Column.vue";
import {ref, watch} from "vue";
import {currentMilliseconds} from "../ts/Utils";

const fps = ref(0)
const frame = ref(1)

const frameTime = ref(16.6667)
let lastUpdate = currentMilliseconds()
update()

watch(() => frameTime.value, () => {
  update()
})

function update() {
  const current = currentMilliseconds()
  if (current - lastUpdate > 200) {
    frame.value = Math.round(frameTime.value * 100) / 100
    fps.value = Math.round(1000 / frame.value)
    lastUpdate = current
  }
}
</script>

<style scoped>
.fps-counter-box {
  padding: 4px;
  border-radius: 4px;
  background-color: orange;
  color: #8d4e00;
  font-size: 12px;
  font-weight: bold;
}
</style>