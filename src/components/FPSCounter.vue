<template>
  <Column class="fps-counter-box">
    <span>{{ frame }} ms</span>
    <span>{{ fps }} FPS</span>
  </Column>
</template>

<script setup lang="ts">
import Column from "./Column.vue";
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import {currentMilliseconds} from "../ts/Utils";

const fps = ref(0)
const frame = ref(1)

const store = useStore()

const frameTime = computed(() => store.state.frameTime)
let lastUpdate = currentMilliseconds()
update()

watch(() => frameTime.value, () => {
  update()
})

function update() {
  const current = currentMilliseconds()
  if (current - lastUpdate > 1000) {
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