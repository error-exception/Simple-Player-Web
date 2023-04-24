<template>
  <div class="fill-size">
    <div class="fill-size" style="position: relative">
      <div class="bar_1" :style="`opacity: ${volume}`"></div>
      <div class="bar_2" :style="`opacity: ${volume}`"></div>
      <div class="bar_3" :style="`opacity: ${volume}`"></div>
      <div class="bar_4" :style="`opacity: ${volume}`"></div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed} from "vue";
import {useStore} from "vuex";
import Row from "./Row.vue";

const store = useStore()

const volume = computed(() => store.state.visualizerVolume)

</script>

<style scoped>
.bar_1 {
  width: 56px;
  background-color: white;
  height: 100%;
  animation-name: bar_move_lr;
  animation-duration: 5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  position: absolute;
}
.bar_2 {
  position: absolute;
  width: 56px;
  background-color: white;
  height: 100%;
  margin-left: auto;
  /*transform: translateX(0);*/
  animation-name: bar_move_rl;
  animation-delay: 500ms;
  animation-duration: 5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
.bar_3 {
  position: absolute;
  width: 100%;
  background-color: white;
  height: 56px;
  margin-left: auto;
  /*transform: translateY(0);*/
  animation-name: bar_move_tb;
  animation-delay: 600ms;
  animation-duration: 6s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
.bar_4 {
  position: absolute;
  width: 100%;
  background-color: white;
  height: 56px;
  margin-left: auto;
  /*transform: translateY(0);*/
  animation-name: bar_move_bt;
  animation-delay: 400ms;
  animation-duration: 6s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes bar_move_lr {
  from {
    transform: translateX(-56px);
  }
  to {
    transform: translateX(100vw);
  }
}
@keyframes bar_move_rl {
  from {
    transform: translateX(100vw);
  }
  to {
    transform: translateX(-56px);
  }
}
@keyframes bar_move_tb {
  from {
    transform: translateY(-56px);
  }
  to {
    transform: translateY(100vh);
  }
}
@keyframes bar_move_bt {
  from {
    transform: translateY(100vh);
  }
  to {
    transform: translateY(-56px);
  }
}
</style>