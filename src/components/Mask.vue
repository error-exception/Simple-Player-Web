<script setup lang="ts">
import {onMounted, onUnmounted} from "vue";
import {MouseEventFire} from "../ts/webgl/event/MouseEventFire";

onMounted(() => {
  MouseEventFire.pause()
})

onUnmounted(() => {
  MouseEventFire.resume()
})

</script>

<template>
  <div
      class="mask-box"
  />
</template>

<style scoped>
.mask-box {
  width: 100vw;
  height: 100vh;
  background-color: #00000080;
  pointer-events: auto;
}
</style>