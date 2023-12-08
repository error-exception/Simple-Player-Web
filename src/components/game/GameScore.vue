<script setup lang="ts">
import {computed, watch} from "vue";
import {maniaScore, maniaTotalCombo} from "../../ts/global/ManiaState";
import {Judge} from "../../ts/Judge";

watch([() => Judge.perfect, () => Judge.good, () => Judge.bad, maniaTotalCombo], ([perfect, good, bad, total]) => {
  const per = 1000000 / total
  maniaScore.value = Math.round(perfect * per + good * (per * 0.6) + bad * (per * 0.2))
}, { immediate: true })
const scoreString = computed(() => {
  const s = maniaScore.value + ''
  return s.padStart(7, '0')
})
</script>
<template>
  <span class="text-white text-[48px] text-right">{{ scoreString }}</span>
</template>