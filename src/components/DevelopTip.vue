<script lang="ts" setup>
import { onMounted, onUnmounted, reactive } from 'vue';
import { PerformanceStatistics } from '../ts/webgl/util/PerformanceStatistics';


const performance = reactive({
  expectFrame: 60,
  frameTime: 0,
  drawCallsCount: 0,
})

function updatePerformance() {
  const result = PerformanceStatistics.getPerformanceResult();
  performance.frameTime = result.frameTime;
  performance.drawCallsCount = result.drawCallsPerFrame;
  performance.expectFrame = result.frameCountPerSec;
}

let intervalId: any;
onMounted(() => {
  intervalId = setInterval(() => {
    updatePerformance();
  }, 500);
})

onUnmounted(() => {
  clearInterval(intervalId);
})

</script>
<template>
  <div class="flex flex-col rounded-tl-[8px] p-2 text-white bg-[#00000080] pointer-events-none text-sm">
    <span>In Dev</span>
    <span>Expect Frame：{{ Math.round(performance.expectFrame) }}</span>
    <span>Draw Calls: {{ performance.drawCallsCount }}</span>
    <span>Frame Time: {{ performance.frameTime.toFixed(2) }}ms</span>
  </div>
</template>